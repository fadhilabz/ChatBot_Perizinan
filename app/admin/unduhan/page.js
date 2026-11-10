'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, LogOut, Plus, Upload } from 'lucide-react';
import AdminGate from '@/app/components/AdminGate';
import AdminNav from '@/app/components/AdminNav';
import { PAGE_CSS } from '@/lib/pageStyles';
import { KAT_UNDUHAN, fmtTanggal, ekstensi } from '@/lib/konten';

const KOSONG = { id: null, judul: '', deskripsi: '', kategori: 'Umum', url: '', ukuran: '' };

function Pengelola({ pw, keluar }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(KOSONG);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const authHeader = { 'x-admin-password': encodeURIComponent(pw) };
  const jsonHeaders = { 'Content-Type': 'application/json', ...authHeader };

  async function muat() {
    const r = await fetch('/api/unduhan', { cache: 'no-store' });
    if (r.ok) setItems(await r.json());
  }
  useEffect(() => {
    muat();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function unggah(file) {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/unduhan/upload', { method: 'POST', headers: authHeader, body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal mengunggah.');
      setForm((f) => ({
        ...f,
        url: d.url,
        ukuran: d.ukuran,
        judul: f.judul || d.nama.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      }));
      setMsg({ type: 'ok', text: 'Berkas terunggah. Lengkapi data lalu klik Tambah.' });
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    }
    if (fileRef.current) fileRef.current.value = '';
    setBusy(false);
  }

  async function simpan(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch('/api/unduhan', { method: form.id ? 'PUT' : 'POST', headers: jsonHeaders, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Gagal menyimpan.');
      setMsg({ type: 'ok', text: form.id ? 'Berkas diperbarui.' : 'Berkas ditambahkan.' });
      setForm(KOSONG);
      await muat();
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    }
    setBusy(false);
  }

  async function hapus(item) {
    if (!confirm(`Hapus "${item.judul}"? Berkas yang diunggah ke situs ikut terhapus.`)) return;
    setMsg(null);
    const r = await fetch('/api/unduhan', { method: 'DELETE', headers: jsonHeaders, body: JSON.stringify({ id: item.id }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) setMsg({ type: 'err', text: d.error || 'Gagal menghapus.' });
    else {
      setMsg({ type: 'ok', text: 'Berkas dihapus.' });
      if (form.id === item.id) setForm(KOSONG);
      await muat();
    }
  }

  return (
    <>
      <style>{PAGE_CSS}</style>
      <AdminNav />
      <div className="pg-bar">
        <h2 style={{ margin: 0 }}>Kelola Unduhan</h2>
        <Link className="pg-btn ghost sm" href="/unduhan">Lihat halaman</Link>
        <button className="pg-btn ghost sm sp" type="button" onClick={keluar}><LogOut size={14} /> Keluar</button>
      </div>

      {msg && <div className={`pg-msg ${msg.type}`}>{msg.text}</div>}

      <div className="pg-admin">
        <form className="pg-card pg-form" onSubmit={simpan}>
          <h3>{form.id ? 'Ubah berkas' : 'Berkas baru'}</h3>
          <label>Judul<input value={form.judul} onChange={set('judul')} maxLength={120} required /></label>
          <label>Deskripsi (opsional)<textarea style={{ minHeight: 70 }} value={form.deskripsi} onChange={set('deskripsi')} maxLength={500} /></label>
          <label>Kategori
            <select value={form.kategori} onChange={set('kategori')}>
              {KAT_UNDUHAN.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label>Unggah berkas (PDF, Word, Excel, PowerPoint, JPG, PNG, maks. 10 MB)
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" onChange={(e) => unggah(e.target.files?.[0])} disabled={busy} />
          </label>
          <label>Atau tempel tautan berkas (misalnya Google Drive)
            <input value={form.url} onChange={set('url')} placeholder="https://… atau hasil unggahan" required />
          </label>
          <label>Ukuran (opsional)<input value={form.ukuran} onChange={set('ukuran')} maxLength={20} placeholder="mis. 240 KB" /></label>
          <div className="pg-row">
            <button className="pg-btn" type="submit" disabled={busy}>
              {form.id ? 'Simpan perubahan' : <><Plus size={16} /> Tambah</>}
            </button>
            {form.id && <button className="pg-btn ghost" type="button" onClick={() => setForm(KOSONG)}>Batal</button>}
          </div>
        </form>

        <div className="pg-card">
          <h3>Daftar berkas ({items.length})</h3>
          {items.length === 0 && <p className="pg-date">Belum ada berkas.</p>}
          {items.map((i) => (
            <div key={i.id} className="pg-item">
              <div style={{ minWidth: 0 }}>
                <div className="pg-row">
                  <span className="pg-badge">{i.kategori}</span>
                  {ekstensi(i.url) && <span className="pg-badge k-abu">{ekstensi(i.url).toUpperCase()}</span>}
                  {String(i.url).startsWith('/unduhan/') && <span className="pg-badge k-ok"><Upload size={11} /> Diunggah</span>}
                </div>
                <b>{i.judul}</b>
                <span className="pg-date">{[i.ukuran, fmtTanggal(i.tanggal)].filter(Boolean).join(' • ')}</span>
              </div>
              <div className="acts">
                <button className="pg-btn ghost sm" type="button" onClick={() => { setForm({ ...KOSONG, ...i }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Ubah">
                  <Pencil size={14} />
                </button>
                <button className="pg-btn danger sm" type="button" onClick={() => hapus(i)} aria-label="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AdminUnduhanPage() {
  return <AdminGate>{(pw, keluar) => <Pengelola pw={pw} keluar={keluar} />}</AdminGate>;
}