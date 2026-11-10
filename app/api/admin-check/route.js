import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';

export async function GET(req) {
  if (isAdmin(req)) return NextResponse.json({ ok: true });
  // jeda singkat agar tebak-tebakan kata sandi lebih lambat
  await new Promise((r) => setTimeout(r, 600));
  return NextResponse.json({ error: 'Kata sandi salah.' }, { status: 401 });
}