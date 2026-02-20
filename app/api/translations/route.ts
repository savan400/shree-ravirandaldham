import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * GET /api/translations
 * Proxies to the Express backend and returns nested translations.
 * Used by i18n/request.ts to merge DB translations at runtime.
 */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/translations`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      return NextResponse.json({}, { status: 200 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fail gracefully — return empty so JSON file defaults are used
    return NextResponse.json({});
  }
}
