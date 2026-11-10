import { promises as fs } from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'data');

export async function readJson(name) {
  try {
    const raw = await fs.readFile(path.join(DIR, name), 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeJson(name, data) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, name), JSON.stringify(data, null, 2), 'utf8');
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Tanggal hari ini di zona WITA (UTC+8), format YYYY-MM-DD
export function hariIniWita() {
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

export const SAVE_ERROR =
  'Gagal menyimpan data. Jika situs berjalan di Vercel, penyimpanan ke file tidak didukung dan perlu database.';
