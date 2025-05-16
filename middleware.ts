import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/assistants',
  '/workflows',
  '/calls',
  '/dashboard',
];

// Routes accessibles uniquement aux utilisateurs non authentifiés
const publicAuthRoutes = [
  '/auth/login',
  '/auth/register',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  const url = req.nextUrl.clone();
  const { pathname } = url;
  
  // Si la route est protégée et l'utilisateur n'est pas connecté
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à une page d'authentification
  if (publicAuthRoutes.includes(pathname) && session) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 