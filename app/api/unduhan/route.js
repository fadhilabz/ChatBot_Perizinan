import { NextResponse, connection } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { readJson, writeJson, newId, hariIniWita, SAVE_ERROR } from '@/lib/store';
import { isAdmin } from '@/lib/adminAuth';
import { KAT_UNDUHAN } from '@/lib/konten';

const FILE = 'unduhan.json';
const URL_RE = /^(https?:\/\/[^\s]+|\/unduhan\/[A-Za-z0-9._-]+)$/i;
const tolak = (msg, status = 400) => NextResponse.json({ error: msg }, { status });

function bersihkan(b) {
  const judul = String(b.judul || '').trim().slice(0, 120);
  const deskripsi = String(b.deskripsi || '').trim().slice(0, 500);
  const url = String(b.url || '').trim();
  if (!judul) return { error: 'Judul wajib diisi.' };
  if (!URL_RE.test(url)) return { error: 'Tautan berkas harus berupa alamat http(s) atau hasil unggahan.' };
  const kategori = KAT_UNDUHAN.includes(b.kategori) ? b.kategori : 'Umum';
  const ukuran = String(b.ukuran || '').trim().slice(0, 20);
  return { data: { judul, deskripsi, kategori, url, ukuran } };
}

export async function GET() {
  await connection(); // pastikan data selalu dibaca baru
  const semua = await readJson(FILE);
  return NextResponse.json([...semua].sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal))));
}

export async function POST(req) {
  if (!isAdmin(req)) return tolak('Tidak diizinkan.', 401);
  const b = await req.json().catch(() => ({}));
  const { data, error } = bersihkan(b);
  if (error) return tolak(error);
  try {
    const semua = await readJson(FILE);
    const item = { id: newId(), ...data, tanggal: hariIniWita() };
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
    if (i < 0) return tolak('Berkas tidak ditemukan.', 404);
    semua[i] = { ...semua[i], ...data };
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
    const item = semua.find((x) => x.id === b.id);
    await writeJson(FILE, semua.filter((x) => x.id !== b.id));
    // hapus juga berkas yang diunggah lewat admin (bukan tautan luar)
    if (item && String(item.url).startsWith('/unduhan/')) {
      const target = path.join(process.cwd(), 'public', 'unduhan', path.basename(item.url));
      await fs.unlink(target).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return tolak(SAVE_ERROR, 500);
  }
}