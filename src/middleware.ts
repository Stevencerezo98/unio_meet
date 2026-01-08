
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This forces the middleware to run on the Node.js runtime,
// preventing "Cannot find module 'node:process'" errors.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // A simple cookie check for client-side sessions.
  // This cookie is a custom one we assume is set during login.
  // In our app, it's called 'session'.
  const hasSession = request.cookies.has('session');

  // --- Logic for already logged-in users ---
  // If a user appears to have a session and tries to access login or register, 
  // redirect them to the main start page.
  if (hasSession) {
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/start', request.url));
    }
  }

  // Allow all other requests to proceed.
  // The protection for '/settings' is handled client-side in the component itself.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for API routes, static files, and image optimization files.
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
