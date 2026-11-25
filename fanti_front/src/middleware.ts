import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply middleware to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the origin/referer of the request
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Allow requests from the same host (internal navigation)
  const allowedOrigin = process.env.NEXT_PUBLIC_ALLOWED_ORIGIN;
  const currentHost = process.env.NEXTAUTH_URL || `https://${host}`;

  // Check if request comes from allowed origins
  const isFromAllowedOrigin =
    (referer && allowedOrigin && referer.startsWith(allowedOrigin)) ||
    (origin && allowedOrigin && origin === allowedOrigin) ||
    (referer && currentHost && referer.startsWith(currentHost)) ||
    (origin && currentHost && origin === currentHost);

  if (!isFromAllowedOrigin) {
    return NextResponse.json({ error: 'Unauthorized - API access denied' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Only match API routes for security restriction
     * - /api/* (all API routes protected)
     * Pages remain publicly accessible
     */
    '/api/:path*',
  ],
};
