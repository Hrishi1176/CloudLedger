import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@sales-crm/auth';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Exclude assets, public files, API routes, and rewritten tenant routes from subdomain routing
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/tenant') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const host = hostname.split(':')[0];
  let subdomain = '';
  
  const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
  
  if (!isIP) {
    const parts = host.split('.');
    
    // Handle localhost subdomains (e.g. tenant.localhost)
    if (parts.includes('localhost')) {
      if (parts.length > 1 && parts[0] !== 'localhost') {
        subdomain = parts[0];
      }
    } else {
      // Standard subdomain extraction for production / custom domains
      if (parts.length > 2 && parts[0] !== 'www') {
        subdomain = parts[0];
      } else if (parts.length === 2 && parts[1] === 'me') {
        // fallback for tenant.lvh.me
        subdomain = parts[0];
      }
    }
  }

  // If we have a tenant subdomain
  if (subdomain) {
    const token = request.cookies.get('token')?.value;
    const isAuthRoute = url.pathname === '/login' || url.pathname === '/register';

    if (!token) {
      if (!isAuthRoute) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
      // If it's login/register and there's no token, let it pass to the rewritten page
    } else {
      const payload = await verifyJWT(token);
      if (!payload || payload.subdomain !== subdomain) {
        // Clear cookie and redirect to login if token is invalid or belongs to another tenant
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }
      
      if (isAuthRoute) {
        // If logged in, redirect to dashboard
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }

    // Rewrite to the tenant-specific dynamic path: /tenant/[subdomain]/[path]
    url.pathname = `/tenant/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Root domain (marketing pages or root landing)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
