import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

function json(status: number, body: any) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect the admin UI and admin APIs.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // APIs should return JSON instead of redirects.
      if (pathname.startsWith('/api/')) {
        return json(401, { error: 'Unauthorized' });
      }

      const url = req.nextUrl.clone();
      url.pathname = '/auth/signin';
      url.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }

    const legacyAdminEmail = process.env.ADMIN_EMAIL;
    const isAdmin =
      (token as any).role === 'admin' ||
      (!!legacyAdminEmail && (token as any).email === legacyAdminEmail);

    if (!isAdmin) {
      if (pathname.startsWith('/api/')) {
        return json(403, { error: 'Forbidden' });
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

