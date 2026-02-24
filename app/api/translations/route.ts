import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5050/api";

/**
 * GET /api/translations
 * Proxies to the Express backend and returns nested translations.
 * Used by i18n/request.ts to merge DB translations at runtime.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') || 'en';

  try {
    const res = await fetch(`${BACKEND_URL}/translations?locale=${locale}`, {
      cache: 'no-store',
    });
    
    if (res.ok) {
        const data = await res.json();
        console.log(`[Next.js API] Received ${Object.keys(data).length} sections from backend.`);
        return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Translation fetch proxy error:', error);
    return NextResponse.json({});
  }
}
