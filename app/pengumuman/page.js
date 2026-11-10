'use client';
import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Pin, CalendarClock } from 'lucide-react';
import { PAGE_CSS } from '@/lib/pageStyles';
import { KAT_PENGUMUMAN, fmtTanggal, kelasKategori } from '@/lib/konten';

export default function PengumumanPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [tab, setTab] = useState('Semua');
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/pengumuman', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('gagal');
        return r.json();
      })
      .then((d) => {
        setItems(Array.isArray(d) ? d : []);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, []);

  const shown = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(
      (i) =>
        (tab === 'Semua' || i.kategori === tab) &&
        (String(i.judul).toLowerCase().includes(s) || String(i.isi).toLowerCase().includes(s))
    );
  }, [items, tab, q]);

  return (
    <>
      <style>{PAGE_CSS}</style>

      <section className="pg-hero">
        <h2><Megaphone size={24} /> Pengumuman</h2>
        <p>Informasi terbaru seputar libur layanan, perubahan jam, dan kabar dari kantor perizinan.</p>
      </section>

      <div className="pg-tools">
        <input
          className="pg-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari pengumuman…"
          aria-label="Cari pengumuman"
        />
      </div>

      <div className="pg-tabs" role="tablist">
        {['Semua', ...KAT_PENGUMUMAN].map((c) => (
          <button key={c} role="tab" aria-selected={tab === c} className={`pg-tab ${tab === c ? 'on' : ''}`} onClick={() => setTab(c)}>
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="pg-date">Memuat pengumuman…</p>}
      {status === 'error' && <div className="pg-msg err">Pengumuman belum bisa dimuat. Coba muat ulang halaman.</div>}
      {status === 'ok' && shown.length === 0 && (
        <div className="pg-empty">Belum ada pengumuman{tab !== 'Semua' || q ? ' yang cocok' : ''}.</div>
      )}

      <div className="pg-list">
        {shown.map((i) => (
          <article key={i.id} className={`pg-card ${i.sematkan ? 'pinned' : ''}`}>
            <div className="pg-row">
              <span className={`pg-badge ${kelasKategori(i.kategori)}`}>{i.kategori}</span>
              {i.sematkan && <span className="pg-pin"><Pin size={14} /> Disematkan</span>}
              <span className="pg-date">{fmtTanggal(i.tanggal)}</span>
            </div>
            <h3>{i.judul}</h3>
            <p>{i.isi}</p>
            {i.berakhir && (
              <div className="pg-date pg-until">
                <CalendarClock size={14} /> Berlaku sampai {fmtTanggal(i.berakhir)}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
