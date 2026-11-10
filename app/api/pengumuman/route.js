import { NextResponse, connection } from 'next/server';
import { readJson, writeJson, newId, hariIniWita, SAVE_ERROR } from '@/lib/store';
import { isAdmin } from '@/lib/adminAuth';
import { KAT_PENGUMUMAN } from '@/lib/konten';

const FILE = 'pengumuman.json';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const tolak = (msg, status = 400) => NextResponse.json({ error: msg }, { status });

function bersihkan(b) {
  const judul = String(b.judul || '').trim().slice(0, 120);
  const isi = String(b.isi || '').trim().slice(0, 2000);
  if (!judul || !isi) return { error: 'Judul dan isi wajib diisi.' };
  const kategori = KAT_PENGUMUMAN.includes(b.kategori) ? b.kategori : 'Info Layanan';
  const tanggal = DATE_RE.test(b.tanggal || '') ? b.tanggal : hariIniWita();
  const berakhir = DATE_RE.test(b.berakhir || '') ? b.berakhir : '';
  if (berakhir && berakhir < tanggal) return { error: 'Tanggal berakhir tidak boleh sebelum tanggal pengumuman.' };
  return { data: { judul, isi, kategori, tanggal, berakhir, sematkan: !!b.sematkan } };
}

const urut = (a, b) => Number(!!b.sematkan) - Number(!!a.sematkan) || b.tanggal.localeCompare(a.tanggal);

export async function GET(req) {
  await connection(); // pastikan data selalu dibaca baru
  const semua = await readJson(FILE);
  if (isAdmin(req)) return NextResponse.json([...semua].sort(urut));
  const today = hariIniWita();
  const tayang = semua.filter((x) => x.tanggal <= today && (!x.berakhir || x.berakhir >= today));
  return NextResponse.json(tayang.sort(urut));
}

export async function POST(req) {
  if (!isAdmin(req)) return tolak('Tidak diizinkan.', 401);
  const b = await req.json().catch(() => ({}));
  const { data, error } = bersihkan(b);
  if (error) return tolak(error);
  try {
    const semua = await readJson(FILE);
    const item = { id: newId(), ...data };
    semua.push(item);
    await writeJson(FILE, semua);
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    console.error(e);
    return tolak(SAVE_ERROR, 500);
  }
}

export async function PUT(req) {
  if (!isAdmin(req)) return tolak('Tidak diizinkan.', 401);
  const b = await req.json().catch(() => ({}));
  const { data, error } = bersihkan(b);
  if (error) return tolak(error);
  try {
    const semua = await readJson(FILE);
    const i = semua.findIndex((x) => x.id === b.id);
    if (i < 0) return tolak('Pengumuman tidak ditemukan.', 404);
    semua[i] = { id: semua[i].id, ...data };
    await writeJson(FILE, semua);
    return NextResponse.json(semua[i]);
  } catch (e) {
    console.error(e);
    return tolak(SAVE_ERROR, 500);
  }
}

export async function DELETE(req) {
  if (!isAdmin(req)) return tolak('Tidak diizinkan.', 401);
  const b = await req.json().catch(() => ({}));
  try {
    const semua = await readJson(FILE);
    await writeJson(FILE, semua.filter((x) => x.id !== b.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return tolak(SAVE_ERROR, 500);
  }
}