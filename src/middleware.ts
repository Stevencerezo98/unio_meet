
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This forces the middleware to run on the Node.js runtime,
// preventing "Cannot find module 'node:process'" errors.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This cookie is a custom one we set during admin login.
  const hasSession = request.cookies.has('session');

  // --- Logic for admin routes ---
  if (pathname.startsWith('/admin')) {
    // If the user is trying to access /admin but has no session,
    // redirect them to the login page.
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // --- Logic for login page ---
  // If a user has a session and tries to access the login page,
  // redirect them directly to the admin dashboard.
  if (pathname.startsWith('/login') && hasSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Allow all other requests to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except for API routes, static files, and image optimization files.
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|image/).*)',
  ],
};
