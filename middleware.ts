import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Il est crucial de rafraîchir la session pour que le middleware la voie correctement.
  await supabase.auth.getUser(); 

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  console.log(`Middleware (Simple): Path=${pathname}, Session=${session ? 'Exists' : 'None'}`);

  // Routes protégées (exemple minimal)
  const protectedRoutes = ['/dashboard', '/assistants', '/settings'];
  // Page de connexion
  const loginPath = '/auth/login';

  // Si l'utilisateur n'est pas connecté ET essaie d'accéder à une route protégée
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log(`Middleware (Simple): Accès à ${pathname} refusé, redirection vers ${loginPath}`);
    return NextResponse.redirect(new URL(loginPath, req.url));
  }

  // Si l'utilisateur EST connecté ET essaie d'accéder à la page de connexion
  if (session && pathname === loginPath) {
    console.log(`Middleware (Simple): Utilisateur connecté sur ${loginPath}, redirection vers /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)S',
  ],
}; 