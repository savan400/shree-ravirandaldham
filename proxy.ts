import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Split pathname to check for locale segments
  const segments = pathname.split('/');
  // segments[0] is always empty for paths starting with "/"
  const localeCandidate = segments[1];

  // If we detect a 2-letter segment that is NOT a supported locale,
  // we redirect to the same path but with the default locale prefix.
  // This prevents URL rewrites like /en/fr/...
  if (localeCandidate && localeCandidate.length === 2) {
    const isSupported = (routing.locales as readonly string[]).includes(localeCandidate);
    
    if (!isSupported) {
      const remainingPath = segments.slice(2).join('/');
      const url = request.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}/${remainingPath}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files (e.g. /favicon.ico, /next.svg, /images/*)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};
