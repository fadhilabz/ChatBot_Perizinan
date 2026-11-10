import { NextResponse } from 'next/server';
import { readFaq, writeFaq, isAdmin } from '@/lib/faq';
import { CATEGORIES } from '@/lib/constants';

const deny = () => NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 });

function clean(body) {
  const question = String(body?.question || '').trim().slice(0, 300);
  const answer = String(body?.answer || '').trim().slice(0, 2000);
  const category = CATEGORIES.includes(body?.category) ? body.category : CATEGORIES[0];
  if (!question || !answer) return null;
  return { question, answer, category };
}

export async function GET() {
  return NextResponse.json(await readFaq());
}

export async function POST(req) {
  if (!isAdmin(req)) return deny();
  const data = clean(await req.json());
  if (!data) return NextResponse.json({ error: 'Pertanyaan dan jawaban wajib diisi' }, { status: 400 });
  const list = await readFaq();
  const item = { id: Date.now().toString(), ...data };
  await writeFaq([...list, item]);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req) {
  if (!isAdmin(req)) return deny();
  const body = await req.json();
  const data = clean(body);
  if (!data) return NextResponse.json({ error: 'Pertanyaan dan jawaban wajib diisi' }, { status: 400 });
  const list = await readFaq();
  if (!list.some((x) => x.id === body.id)) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
  await writeFaq(list.map((x) => (x.id === body.id ? { id: x.id, ...data } : x)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!isAdmin(req)) return deny();
  const id = new URL(req.url).searchParams.get('id');
  const list = await readFaq();
  await writeFaq(list.filter((x) => x.id !== id));
  return NextResponse.json({ ok: true });
}