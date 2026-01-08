
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';

export const runtime = 'nodejs';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = getAuth(getApp());
  
  // Use the standard cookie name for Firebase Auth session cookies
  const sessionCookie = request.cookies.get('__session')?.value;

  // --- Logic for already logged-in users ---
  if (sessionCookie) {
    try {
      // Verify the cookie is valid
      await auth.verifySessionCookie(sessionCookie, true);
      
      // If user is logged in and tries to access login or register, redirect to start
      if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/start', request.url));
      }

    } catch (error) {
      // Invalid cookie. Clear it and proceed.
      const response = NextResponse.next();
      response.cookies.delete('__session');
      return response;
    }
  }

  // --- Logic for users who are NOT logged in ---
  if (!sessionCookie) {
      // If a non-logged-in user tries to access /settings, redirect them to login.
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
