
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware can run on the edge or node runtime.
// No Node.js specific APIs are used.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // A simple cookie check for client-side sessions managed by Firebase Auth.
  // This cookie is automatically set by Firebase Auth on the client.
  // We're checking for any cookie that indicates a session might be active.
  // The name can vary, but 'session' is common for custom setups or other libraries.
  // For Firebase default client-side persistence, it uses IndexedDB, but a custom cookie might be set.
  // A more reliable check might be a specific cookie you set upon successful login on the client.
  // For this app, let's assume a cookie named 'session' might be set by some part of the auth flow.
  // Note: The default Firebase client SDK does not set a simple session cookie by default.
  // This middleware logic is based on the assumption that a session indicator cookie exists.
  // The original code used a server-side '__session' cookie which is not being set.
  // Let's check for a more generic indicator.
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
