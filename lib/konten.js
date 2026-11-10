export const KAT_PENGUMUMAN = ['Info Layanan', 'Perubahan Jam', 'Libur Layanan', 'Penting'];
export const KAT_UNDUHAN = ['Perizinan Usaha (NIB)', 'PBG / Bangunan', 'Izin Lainnya', 'Umum'];

export function fmtTanggal(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function kelasKategori(k) {
  return { 'Libur Layanan': 'k-libur', 'Perubahan Jam': 'k-jam', Penting: 'k-penting' }[k] || 'k-info';
}

export function ekstensi(url) {
  const m = String(url || '').split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : '';
}

// Hari ini menurut jam di perangkat pengguna, format YYYY-MM-DD
export function hariIniLokal() {
  return new Date().toLocaleDateString('sv-SE');
}
