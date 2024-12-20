import { 
    publicRoutes,
    authRoutes
} from "./routes";
import { match } from 'path-to-regexp';
import { NextResponse, NextRequest } from 'next/server'; 
import { GetUserProfile } from "./services/user";

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
        if (!userProfile) {
            return NextResponse.redirect(new URL("/auth/login", nextUrl));
        }

        // Set user profile data in a cookie
        const response = NextResponse.next();
        
        // Stringify and encode the user profile data
        const encodedUserProfile = encodeURIComponent(JSON.stringify(userProfile));
        
        // Set the cookie with the user profile data
        response.cookies.set('user_profile', encodedUserProfile, {
            path: '/', // Cookie is available for all paths
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

