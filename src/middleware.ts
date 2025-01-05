import { 
    publicRoutes,
    authRoutes
} from "./routes";
import { match } from 'path-to-regexp';
import { NextResponse, NextRequest } from 'next/server'; 
import { GetUserProfile } from "./services/user";
import axios from "axios"
import jwt from 'jsonwebtoken';
export async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    try {
        const pathname = nextUrl.pathname;
        const isPublicRoute = publicRoutes.some(route => {
            const matcher = match(route, { decode: decodeURIComponent });
            return matcher(pathname); 
        });
        
        const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    
        if (isPublicRoute || isAuthRoute) {
            return NextResponse.next();
        }

        let userProfile = await GetUserProfile();
        const response = NextResponse.next();
        if (!userProfile) {
            const refreshResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
                headers: {
                    Cookie: `refresh_token=${req.cookies?.get('refresh_token')?.value || ''}`
                },
                withCredentials: true,
            });
            const accessToken = refreshResponse.data.data?.access_token;
            if (accessToken) {
                const decodedToken = jwt.decode(accessToken) as jwt.JwtPayload;
                const expirationTime = decodedToken?.exp ? new Date(decodedToken?.exp * 1000) : Math.floor(Date.now() / 1000) + 3600; // 1 hour
                
                // Set the new access token in a cookie
                response.cookies.set('access_token', accessToken, {
                    path: '/',
                    expires: expirationTime,
                });
                
                const userProfileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${accessToken || ''}`,
                    },
                    withCredentials: true,
                });
                userProfile = userProfileResponse?.data?.data || null;
                if(!userProfile){
                    return NextResponse.redirect(new URL("/auth/login", nextUrl));
                }
            } else {
                return NextResponse.redirect(new URL("/auth/login", nextUrl));
            }
        }

        // Set the cookie with the user profile data
        const encodedUserProfile = encodeURIComponent(JSON.stringify(userProfile));
        response.cookies.set('user_profile', encodedUserProfile, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
        
    }
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

