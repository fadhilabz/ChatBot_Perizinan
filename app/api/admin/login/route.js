import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();
  const real = process.env.ADMIN_PASSWORD;
  if (real && password === real) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: 'Password salah' }, { status: 401 });
}