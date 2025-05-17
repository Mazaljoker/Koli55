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
  
  // Obtenir la session et également vérifier le token d'authentification dans les cookies
  const { data: { session } } = await supabase.auth.getSession();
  
  // Vérifier également le cookie de session directement pour une double vérification
  const hasAuthCookie = req.cookies.get('sb-auth-token') || 
                         req.cookies.get('supabase-auth-token') ||
                         req.cookies.get('sb-access-token') ||
                         req.cookies.get('sb-refresh-token');
  
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Amélioration: Stocker le chemin initial demandé pour redirection après login
  if (pathname === '/auth/login') {
    const redirectParam = req.nextUrl.searchParams.get('redirect');
    if (!redirectParam && req.headers.get('referer')) {
      const referer = req.headers.get('referer') || '';
      const refererPath = new URL(referer).pathname;
      
      // Si on vient d'une route protégée, stocker cette information
      if (refererPath && refererPath !== '/auth/login' && refererPath !== '/auth/register') {
        url.searchParams.set('redirect', refererPath);
        return NextResponse.redirect(url);
      }
    }
  }
  
  // Autoriser l'accès au dashboard après authentification réussie même si la session n'est pas encore détectable
  const isDashboardAccess = pathname.startsWith('/dashboard');
  const forceBypassAuth = isDashboardAccess && 
                          (req.cookies.get('bypass_auth_check')?.value === 'true' || req.headers.get('x-auth-bypass') === 'true');
  
  const isAuthenticated = !!session || !!hasAuthCookie || forceBypassAuth;
  
  // Console log pour déboguer (ces logs seront visibles dans les logs du serveur)
  console.log(`Middleware: Path=${pathname}, SessionExists=${!!session}, AuthCookie=${!!hasAuthCookie}, ForceBypass=${forceBypassAuth}, IsAuthenticated=${isAuthenticated}`);
  
  // 1. Si l'utilisateur essaie d'accéder au dashboard immédiatement après login
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    // Vérification supplémentaire: si c'est un accès direct après login, laisser passer temporairement
    // (cela devrait être vérifié par la page dashboard elle-même)
    const referer = req.headers.get('referer') || '';
    if (referer.includes('/auth/login')) {
      console.log("Accès au dashboard directement après login, autorisation temporaire");
      // Ajouter un cookie bypass de courte durée (10 secondes)
      const response = NextResponse.next();
      response.cookies.set('bypass_auth_check', 'true', { 
        maxAge: 10, // 10 secondes
        path: '/',
      });
      return response;
    }
  }

  // 2. Si l'utilisateur est authentifié et sur la page d'accueil, rediriger vers le dashboard
  if (isAuthenticated && pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  // 3. Vérifier si la route actuelle correspond à une route protégée
  const isProtectedRoute = protectedRoutes.some(route => {
    // Gérer les routes dynamiques avec paramètres
    if (route.includes('[id]')) {
      const baseRoute = route.split('/[id]')[0];
      return pathname.startsWith(baseRoute) && 
             pathname !== `${baseRoute}/new`; // Exclure la route de création
    }
    return pathname.startsWith(route);
  });
  
  // 4. Si la route est protégée et l'utilisateur n'est pas connecté
  if (isProtectedRoute && !isAuthenticated) {
    console.log(`Middleware: Accès refusé à ${pathname}, redirection vers /auth/login`);
    // Sauvegarder la route demandée pour y revenir après login
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 5. Si l'utilisateur est authentifié et essaie d'accéder à une page d'authentification
  if (publicAuthRoutes.includes(pathname) && isAuthenticated) {
    console.log(`Middleware: Utilisateur déjà authentifié, redirection vers /dashboard`);
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 