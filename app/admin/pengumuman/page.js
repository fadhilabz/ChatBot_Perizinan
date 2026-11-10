'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Pin, LogOut, Plus } from 'lucide-react';
import AdminGate from '@/app/components/AdminGate';
import AdminNav from '@/app/components/AdminNav';
import { PAGE_CSS } from '@/lib/pageStyles';
import { KAT_PENGUMUMAN, fmtTanggal, kelasKategori, hariIniLokal } from '@/lib/konten';

function Pengelola({ pw, keluar }) {
  const hariIni = hariIniLokal();
  const kosong = { id: null, judul: '', isi: '', kategori: 'Info Layanan', tanggal: hariIni, berakhir: '', sematkan: false };
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(kosong);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': encodeURIComponent(pw) };

  async function muat() {
    const r = await fetch('/api/pengumuman', { headers, cache: 'no-store' });
    if (r.ok) setItems(await r.json());
  }
  useEffect(() => {
    muat();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function simpan(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/pengumuman', { method: form.id ? 'PUT' : 'POST', headers, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal menyimpan.');
      setMsg({ type: 'ok', text: form.id ? 'Pengumuman diperbarui.' : 'Pengumuman ditambahkan.' });
      setForm(kosong);
      await muat();
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    }
    setBusy(false);
  }

  async function hapus(item) {
    if (!confirm(`Hapus pengumuman "${item.judul}"?`)) return;
    setMsg(null);
    const r = await fetch('/api/pengumuman', { method: 'DELETE', headers, body: JSON.stringify({ id: item.id }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) setMsg({ type: 'err', text: d.error || 'Gagal menghapus.' });
    else {
      setMsg({ type: 'ok', text: 'Pengumuman dihapus.' });
      if (form.id === item.id) setForm(kosong);
      await muat();
    }
  }

  const statusItem = (i) => {
    if (i.tanggal > hariIni) return ['Terjadwal', 'k-jam'];
    if (i.berakhir && i.berakhir < hariIni) return ['Berakhir', 'k-abu'];
    return ['Tayang', 'k-ok'];
  };

  return (
    <>
      <style>{PAGE_CSS}</style>
      <AdminNav />
      <div className="pg-bar">
        <h2 style={{ margin: 0 }}>Kelola Pengumuman</h2>
        <Link className="pg-btn ghost sm" href="/pengumuman">Lihat halaman</Link>
        <button className="pg-btn ghost sm sp" type="button" onClick={keluar}><LogOut size={14} /> Keluar</button>
      </div>

      {msg && <div className={`pg-msg ${msg.type}`}>{msg.text}</div>}

      <div className="pg-admin">
        <form className="pg-card pg-form" onSubmit={simpan}>
          <h3>{form.id ? 'Ubah pengumuman' : 'Pengumuman baru'}</h3>
          <label>Judul<input value={form.judul} onChange={set('judul')} maxLength={120} required /></label>
          <label>Isi<textarea value={form.isi} onChange={set('isi')} maxLength={2000} required /></label>
          <label>Kategori
            <select value={form.kategori} onChange={set('kategori')}>
              {KAT_PENGUMUMAN.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <div className="pg-grid2">
            <label>Tanggal tayang<input type="date" value={form.tanggal} onChange={set('tanggal')} /></label>
            <label>Berakhir (opsional)<input type="date" value={form.berakhir} onChange={set('berakhir')} /></label>
          </div>
          <label className="chk"><input type="checkbox" checked={form.sematkan} onChange={set('sematkan')} /> Sematkan di bagian atas</label>
          <div className="pg-row">
            <button className="pg-btn" type="submit" disabled={busy}>
              {form.id ? 'Simpan perubahan' : <><Plus size={16} /> Tambah</>}
            </button>
            {form.id && <button className="pg-btn ghost" type="button" onClick={() => setForm(kosong)}>Batal</button>}
          </div>
        </form>

        <div className="pg-card">
          <h3>Daftar pengumuman ({items.length})</h3>
          {items.length === 0 && <p className="pg-date">Belum ada pengumuman.</p>}
          {items.map((i) => {
            const [label, kelas] = statusItem(i);
            return (
              <div key={i.id} className="pg-item">
                <div style={{ minWidth: 0 }}>
                  <div className="pg-row">
                    <span className={`pg-badge ${kelasKategori(i.kategori)}`}>{i.kategori}</span>
                    <span className={`pg-badge ${kelas}`}>{label}</span>
                    {i.sematkan && <span className="pg-pin"><Pin size={13} /> Disematkan</span>}
                  </div>
                  <b>{i.judul}</b>
                  <span className="pg-date">
                    {fmtTanggal(i.tanggal)}{i.berakhir ? ` sampai ${fmtTanggal(i.berakhir)}` : ''}
                  </span>
                </div>
                <div className="acts">
                  <button className="pg-btn ghost sm" type="button" onClick={() => { setForm({ ...kosong, ...i }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Ubah">
                    <Pencil size={14} />
                  </button>
                  <button className="pg-btn danger sm" type="button" onClick={() => hapus(i)} aria-label="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function AdminPengumumanPage() {
  return <AdminGate>{(pw, keluar) => <Pengelola pw={pw} keluar={keluar} />}</AdminGate>;
}