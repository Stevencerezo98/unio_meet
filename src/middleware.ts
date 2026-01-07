
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './firebase/server';

export const runtime = 'nodejs'; // Add this line

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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

  // The 'session' cookie is a custom name for the session cookie.
  // You can name it anything you want.
  const sessionCookie = request.cookies.get(auth.SESSION_COOKIE_NAME)?.value
  if (!sessionCookie) {
    if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // If the user is logged in and tries to access login/register, redirect them.
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/start', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to login for protected routes.
    const response = NextResponse.next();
    response.cookies.delete(auth.SESSION_COOKIE_NAME);
    
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
