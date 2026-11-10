import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'faq.json');

export async function readFaq() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}

export async function writeFaq(list) {
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), 'utf8');
}

export function isAdmin(req) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && req.headers.get('x-admin-password') === pw;
}