
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware ahora es mucho más simple. Solo protege la página de configuración.
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session'); // Aún usamos un cookie genérico para el ejemplo

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isSettingsPage = request.nextUrl.pathname.startsWith('/settings');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // 1. Proteger la página de configuración (/settings)
  // Solo los usuarios con sesión pueden acceder. En una app real, verificaríamos el token de Firebase.
  if (isSettingsPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Proteger la página de admin (/admin)
  // Solo un 'admin' puede acceder.
  if (isAdminPage && sessionCookie?.value !== 'admin-logged-in') {
      return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 3. Si un usuario con sesión intenta ir a login/register, redirigirlo a /start
  // Esto evita que vean páginas de autenticación si ya están logueados.
  if (isAuthPage && sessionCookie) {
      // Excepción: si es el admin, puede que quiera ver el login, así que lo dejamos pasar
      if(sessionCookie.value !== 'admin-logged-in') {
        return NextResponse.redirect(new URL('/start', request.url));
      }
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar el middleware a todas las rutas excepto los archivos estáticos y de la API.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*.js|icons/).*)',
  ],
};
