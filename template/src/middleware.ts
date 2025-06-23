import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Check if user is on login page
  const isLoginPage = pathname === '/login';
  
  // Check if user is on a protected route (everything except login)
  const isProtectedRoute = !isLoginPage && pathname !== '/';
  
  // If user has token and is on login page, redirect to home
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If user has no token and is on protected route, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user has no token and is on home page, redirect to login
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};