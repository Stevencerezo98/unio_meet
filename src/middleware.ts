
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, getApp } from 'firebase-admin/app';

export const runtime = 'nodejs';

// Initialize Firebase Admin SDK if not already initialized
// This pattern is safer for environments like Next.js middleware
if (!getApps().length) {
  initializeApp();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get Auth instance safely by passing the initialized app
  const auth = getAuth(getApps()[0]);
  
  const sessionCookieName = '__session';

  const unprotectedRoutes = [
    '/',
    '/login',
    '/register',
    '/thank-you'
  ];
  
  // Allow access to admin, lobby and meeting for both logged in and anonymous users.
  // The pages themselves will handle logic based on auth state.
  if (unprotectedRoutes.includes(pathname) || pathname.startsWith('/lobby') || pathname.startsWith('/meeting') || pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    // If no cookie, and it's a protected route, redirect to login.
    if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // Otherwise, it's an unprotected route or one that handles anon users, so let it pass.
    return NextResponse.next();
  }

  try {
    // Verify the session cookie. This checks if the user is genuinely logged in.
    await auth.verifySessionCookie(sessionCookie, true);
    
    // If the user is logged in and tries to access login/register, redirect them to the start page.
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/start', request.url));
    }

    // For any other route, let them proceed.
    return NextResponse.next();
  } catch (error) {
    // Session cookie is invalid, expired, or something went wrong.
    // We create a response to clear the invalid cookie.
    const response = NextResponse.next();
    response.cookies.delete(sessionCookieName);
    
    // If they were trying to access a protected route, redirect them to login.
    if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
        const loginUrl = new URL('/login', request.url);
        // We need to return a redirect response, not just the response with the deleted cookie.
        return NextResponse.redirect(loginUrl);
    }
    
    // If it was an unprotected page, just clear the cookie and let them continue.
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except for API routes, static files, and image optimization files.
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
