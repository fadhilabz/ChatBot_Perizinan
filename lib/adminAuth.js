import crypto from 'crypto';

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();

// Admin dikenali lewat header x-admin-password (nilainya di-encodeURIComponent oleh halaman admin).
export function isAdmin(req) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  let given = '';
  try {
    given = decodeURIComponent(req.headers.get('x-admin-password') || '');
  } catch {
    return false;
  }
  return crypto.timingSafeEqual(sha(given), sha(real));
}
