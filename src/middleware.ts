
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs on the Node.js runtime.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Use the standard cookie name for Firebase Auth session cookies
  const sessionCookie = request.cookies.get('__session')?.value;

  // --- Logic for already logged-in users ---
  if (sessionCookie) {
    // If a logged-in user tries to access login or register, redirect them to the start page.
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/start', request.url));
    }
  }

  // --- Logic for users who are NOT logged in ---
  if (!sessionCookie) {
      // If a non-logged-in user tries to access /settings, redirect them to the login page.
      // This is a server-side backup to the client-side protection.
      if (pathname.startsWith('/settings')) {
          return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for API routes, static files, and image optimization files.
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
