
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
  // If the user is trying to access any route under /admin/* (except the login page itself)
  // and has no session, redirect them to the admin login page.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If a user who is already logged in (has a session) tries to access the login page,
  // redirect them to the main admin dashboard. This prevents them from seeing the login page again.
  if (pathname.startsWith('/admin/login') && hasSession) {
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
