import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/tasks', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/tasks/:path*',
    '/ai-recommend/:path*',
    '/login',
    '/register',
    '/((?!login/redirect).*)'
  ]
};

