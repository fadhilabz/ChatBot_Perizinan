import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAdmin } from '@/lib/adminAuth';
import { SAVE_ERROR } from '@/lib/store';

const MAX = 10 * 1024 * 1024; // 10 MB
const OK_EXT = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png']);
const tolak = (msg, status = 400) => NextResponse.json({ error: msg }, { status });

const fmtUkuran = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export async function POST(req) {
  if (!isAdmin(req)) return tolak('Tidak diizinkan.', 401);
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') return tolak('Berkas tidak ditemukan.');
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!OK_EXT.has(ext)) return tolak('Jenis berkas tidak diizinkan. Gunakan PDF, Word, Excel, PowerPoint, JPG, atau PNG.');
    if (file.size > MAX) return tolak('Ukuran berkas maksimal 10 MB.');

    const base =
      file.name
        .replace(/\.[^.]+$/, '')
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'berkas';
    const nama = `${Date.now().toString(36)}-${base}.${ext}`;
    const dir = path.join(process.cwd(), 'public', 'unduhan');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, nama), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/unduhan/${nama}`, ukuran: fmtUkuran(file.size), nama: file.name });
  } catch (e) {
    console.error(e);
    return tolak(SAVE_ERROR, 500);
  }
}