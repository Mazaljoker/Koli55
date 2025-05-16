import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui nécessitent une authentification
const protectedRoutes = [
  '/assistants/[id]', // Détail d'un assistant spécifique
  '/assistants/[id]/edit', // Édition d'un assistant
  '/assistants/my', // Liste des assistants personnels
  '/workflows',
  '/calls',
  '/dashboard',
  '/dashboard/knowledge-bases',
  '/dashboard/phone-numbers',
  '/dashboard/usage-billing',
  '/dashboard/settings',
];

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/', // Landing page
  '/assistants/new', // Création d'un assistant
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
  
  // 1. Si l'utilisateur est authentifié et sur la page d'accueil, rediriger vers le dashboard
  if (session && pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  // 2. Vérifier si la route actuelle correspond à une route protégée
  const isProtectedRoute = protectedRoutes.some(route => {
    // Gérer les routes dynamiques avec paramètres
    if (route.includes('[id]')) {
      const baseRoute = route.split('/[id]')[0];
      return pathname.startsWith(baseRoute) && 
             pathname !== `${baseRoute}/new`; // Exclure la route de création
    }
    return pathname.startsWith(route);
  });
  
  // 3. Si la route est protégée et l'utilisateur n'est pas connecté
  if (isProtectedRoute && !session) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // 4. Si l'utilisateur est authentifié et essaie d'accéder à une page d'authentification
  if (publicAuthRoutes.includes(pathname) && session) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 