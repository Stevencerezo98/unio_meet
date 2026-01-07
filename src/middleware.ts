
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth, signInAnonymously } from 'firebase/auth';

// NOTE: This middleware is illustrative.
// In a real app, you'd use Firebase server-side auth helpers
// to securely validate the session.
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session'); // Example cookie name

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  
  // Pages that require a registered user session
  const protectedUserPages = ['/start', '/settings'];
  const isProtectedUserPage = protectedUserPages.some(p => request.nextUrl.pathname.startsWith(p));

  // If trying to access a page that requires a registered user, redirect to login
  if (isProtectedUserPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on an auth page with a session, redirect to the start page
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
