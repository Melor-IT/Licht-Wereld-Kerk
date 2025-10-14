// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const res = NextResponse.next();

  // هدرهای امنیتی
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // CSP امن با فونت‌های گوگل
  res.headers.set(
    'Content-Security-Policy',
    `default-src 'self';
     script-src 'self';
     style-src 'self' https://fonts.googleapis.com;
     font-src 'self' https://fonts.gstatic.com;
     img-src 'self' data:;
     object-src 'none';
     base-uri 'self';
     frame-ancestors 'none';`
  );

  return res;
}

export const config = {
  matcher: '/:path*', // اعمال روی تمام مسیرها
};
