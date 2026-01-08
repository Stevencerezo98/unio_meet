
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import { initializeApp, getApps } from 'firebase-admin/app';

export const runtime = 'nodejs';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = getAuth();
  const sessionCookieName = '__session';

  const unprotectedRoutes = [
    '/',
    '/login',
    '/register',
    '/admin',
    '/thank-you'
  ];

  if (unprotectedRoutes.includes(pathname) || pathname.startsWith('/lobby') || pathname.startsWith('/meeting')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    await auth.verifySessionCookie(sessionCookie, true);
    
    // If the user is logged in and tries to access login/register, redirect them.
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/start', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to login for protected routes.
    const response = NextResponse.next();
    response.cookies.delete(sessionCookieName);
    
    if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
