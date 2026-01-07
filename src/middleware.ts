
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware logic is simplified for demonstration.
// In a production app, you'd use server-side helpers to securely validate Firebase sessions.
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session'); // Using a generic cookie name for the example

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  
  // The settings page is the only one that strictly requires a non-anonymous, registered user.
  const isProtectedUserPage = request.nextUrl.pathname.startsWith('/settings');

  // If trying to access a protected page without a session, redirect to login.
  if (isProtectedUserPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on an auth page with a session, redirect to the start page.
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/start', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except for static files, images, and specific utility paths.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/|admin).*)',
  ],
};
