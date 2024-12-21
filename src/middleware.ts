import { 
    publicRoutes,
    authRoutes
} from "./routes";
import { match } from 'path-to-regexp';
import { NextResponse, NextRequest } from 'next/server'; 
import { GetUserProfile } from "./services/user";
import axios from "@/setup/axios"
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

        const userProfile = await GetUserProfile();
        console.log('all cookies', req.cookies);
        
        // console.log(nextUrl.origin,"adsas");
        
        if (!userProfile) {
            try {
                // const refreshResponse = await fetch('http://localhost:8080/api/v1/auth/refresh-token', {
                //     method: 'GET',
                //     credentials: 'include',
                //     headers: {
                //       'Content-Type': 'application/json',
                //     },
                // });
                const refreshResponse = await axios.get('http://localhost:8080/api/v1/auth/refresh-token');
            } catch (error) {
                return NextResponse.redirect(new URL("/auth/login", nextUrl));
            }

            
            // const url = 'http://localhost:8080/api/v1/auth/refresh-token';
            // const refreshResponse = await fetch(url,{
            //     method: 'GET',
            //     credentials: 'include', // This ensures cookies are sent with the request
            // });
            // console.log(refreshResponse,"dsafsd");
            

            // if (!refreshResponse.ok) {
            //     console.error('Refresh token request failed:', refreshResponse.status, await refreshResponse.text());
            //     return NextResponse.redirect(new URL("/auth/login", nextUrl));
            // }

            // const refreshData = await refreshResponse.json();
            // console.log('Refresh Data:', refreshData);

            // if (refreshData?.access_token) {
            //     // Set the new access token in a cookie
            //     const response = NextResponse.next();
            //     response.cookies.set('access_token', refreshData.access_token, {
            //         secure: process.env.NODE_ENV === 'production',
            //         path: '/',
            //     });

            //     userProfile = await GetUserProfile();
            //     if (!userProfile) {
            //         console.error('Failed to get user profile after token refresh');
            //         return NextResponse.redirect(new URL("/auth/login", nextUrl));
            //     }
            // } else {
            //     console.error('No access token in refresh response');
            //     return NextResponse.redirect(new URL("/auth/login", nextUrl));
            // }
            return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }

        // Set user profile data in a cookie
        const response = NextResponse.next();
        
        // Stringify and encode the user profile data
        const encodedUserProfile = encodeURIComponent(JSON.stringify(userProfile));
        
        // Set the cookie with the user profile data
        response.cookies.set('user_profile', encodedUserProfile, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

