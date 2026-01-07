
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: This middleware is illustrative.
// In a real app, you'd use Firebase server-side auth helpers
// to securely validate the session.
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('firebase-session'); // Example cookie name

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = !isAuthPage && !request.nextUrl.pathname.startsWith('/_next') && request.nextUrl.pathname !== '/';


  // If trying to access a protected page without a session, redirect to login
  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on an auth page with a session, redirect to the start page
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL('/start', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except for the home page, static files, and image optimization.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/|admin).*)',
    '/', // Apply to home to redirect logged-in users.
  ],
};
