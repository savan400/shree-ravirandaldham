import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { route, secret } = body;

    // Validate secret if needed
    // if (secret !== process.env.REVALIDATION_TOKEN) ...

    if (route) {
        revalidatePath(route);
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } else {
        return NextResponse.json({ revalidated: false, message: 'Missing route' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
