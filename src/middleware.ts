
// import { NextResponse } from 'next/server';
import { 
    publicRoutes,
    // apiAuthPrefix,
    // DEFAULT_LOGIN_REDIRECT,
    authRoutes
} from "./routes";
import { match } from 'path-to-regexp';

import { NextResponse, NextRequest } from 'next/server'; 
import axios from 'axios'; // Import axios

const apiUrl = process.env.API_URL || 'https://your-api-url.com';
export async function middleware(req: NextRequest) {
    const { nextUrl, headers } = req;
    const pathname = nextUrl.pathname;
    const isPublicRoute = publicRoutes.some(route => {
        const matcher = match(route, { decode: decodeURIComponent });
        return matcher(pathname); // Kiểm tra xem pathname có khớp với route
    });
    console.log(nextUrl.pathname,"next");
    
    const isAuthRoute =  authRoutes.includes(nextUrl.pathname);

    if (isPublicRoute || isAuthRoute) {
        return NextResponse.next();
    }


    const token = headers.get('Authorization')?.split(' ')[1]; // "Bearer <token>"


    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }


    const isValidUser = await checkUserAuth(token);


    if (!isValidUser) {
        return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    return NextResponse.next();
}

async function checkUserAuth(token: string) {
    try {
        const response = await axios.post(`${apiUrl}/api/auth/verify-token`, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.isAuthenticated;
    } catch (error) {
        console.error('Error verifying user token:', error);
        return false;
    }
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

