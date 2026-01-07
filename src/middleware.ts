
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './firebase/server';

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

  try {
    const session = await auth.verifySessionCookie(
      request.cookies.get(auth.SESSION_COOKIE_NAME)?.value || '', 
      true
    );

    if (session) {
      if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return NextResponse.redirect(new URL('/start', request.url));
      }
      return NextResponse.next();
    }
  } catch (error) {
    // Session cookie is invalid or expired.
  }
  
  if (pathname.startsWith('/settings') || pathname.startsWith('/start')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('continue', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
