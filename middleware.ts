import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration des routes et sécurité
const PROTECTED_ROUTES = [
  '/dashboard',
  '/assistants', 
  '/settings',
  '/knowledge-bases',
  '/analytics'
];

const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/api/auth',
  '/demo'
];

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password'
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname, origin } = req.nextUrl;

  try {
    // Créer le client middleware Supabase
    const supabase = createMiddlewareClient({ req, res });

    // Headers de sécurité
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Rafraîchir la session pour s'assurer qu'elle est à jour
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.warn(`[MIDDLEWARE] Erreur lors de la vérification de l'utilisateur:`, userError.message);
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn(`[MIDDLEWARE] Erreur lors de la récupération de la session:`, sessionError.message);
    }

    const isAuthenticated = !!(user && session && !userError && !sessionError);

    // Log pour debugging (en développement seulement)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MIDDLEWARE] ${pathname} | Auth: ${isAuthenticated ? '✅' : '❌'} | User: ${user?.email || 'Anonyme'}`);
    }

    // Gestion des routes protégées
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));

    // Redirection des utilisateurs non authentifiés tentant d'accéder aux routes protégées
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/auth/login', origin);
      loginUrl.searchParams.set('redirectTo', pathname);
      
      console.log(`[MIDDLEWARE] Accès refusé à ${pathname}, redirection vers login`);
      return NextResponse.redirect(loginUrl);
    }

    // Redirection des utilisateurs authentifiés tentant d'accéder aux pages d'auth
    if (isAuthRoute && isAuthenticated) {
      // Vérifier s'il y a une URL de redirection
      const redirectTo = req.nextUrl.searchParams.get('redirectTo');
      const redirectUrl = redirectTo && redirectTo.startsWith('/') 
        ? new URL(redirectTo, origin)
        : new URL('/dashboard', origin);
      
      console.log(`[MIDDLEWARE] Utilisateur connecté, redirection depuis ${pathname} vers ${redirectUrl.pathname}`);
      return NextResponse.redirect(redirectUrl);
    }

    // Vérification de session expirée pour les utilisateurs connectés
    if (isAuthenticated && session) {
      const now = Math.floor(Date.now() / 1000);
      const sessionExpiry = session.expires_at;
      
      // Si la session expire dans moins de 5 minutes, tenter de la rafraîchir
      if (sessionExpiry && (sessionExpiry - now) < 300) {
        try {
          await supabase.auth.refreshSession();
          console.log(`[MIDDLEWARE] Session rafraîchie pour ${user?.email}`);
        } catch (refreshError) {
          console.error(`[MIDDLEWARE] Échec du rafraîchissement de session:`, refreshError);
        }
      }
    }

    // Gestion CORS pour les API routes
    if (pathname.startsWith('/api/')) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Répondre aux requêtes OPTIONS pour CORS
      if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: res.headers });
      }
    }

    return res;

  } catch (error) {
    console.error(`[MIDDLEWARE] Erreur inattendue:`, error);
    
    // En cas d'erreur critique, rediriger vers une page d'erreur ou la page d'accueil
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - API routes internes Next.js
     * - Fichiers statiques
     * - Images 
     * - Favicon
     * - Fichiers publics
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 