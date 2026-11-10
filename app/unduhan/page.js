'use client';
import { useEffect, useMemo, useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileImage, File as FileIcon, FolderDown } from 'lucide-react';
import { PAGE_CSS } from '@/lib/pageStyles';
import { KAT_UNDUHAN, fmtTanggal, ekstensi } from '@/lib/konten';

function IkonBerkas({ url }) {
  const e = ekstensi(url);
  if (['xls', 'xlsx', 'csv'].includes(e)) return <FileSpreadsheet size={22} />;
  if (['jpg', 'jpeg', 'png'].includes(e)) return <FileImage size={22} />;
  if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(e)) return <FileText size={22} />;
  return <FileIcon size={22} />;
}

export default function UnduhanPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [tab, setTab] = useState('Semua');
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/api/unduhan', { cache: 'no-store' })
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
        (String(i.judul).toLowerCase().includes(s) || String(i.deskripsi || '').toLowerCase().includes(s))
    );
  }, [items, tab, q]);

  return (
    <>
      <style>{PAGE_CSS}</style>

      <section className="pg-hero">
        <h2><FolderDown size={24} /> Unduh Formulir</h2>
        <p>Formulir, template surat, dan panduan yang sering dibutuhkan dalam pengurusan izin.</p>
      </section>

      <div className="pg-tools">
        <input
          className="pg-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari formulir atau dokumen…"
          aria-label="Cari berkas"
        />
      </div>

      <div className="pg-tabs" role="tablist">
        {['Semua', ...KAT_UNDUHAN].map((c) => (
          <button key={c} role="tab" aria-selected={tab === c} className={`pg-tab ${tab === c ? 'on' : ''}`} onClick={() => setTab(c)}>
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="pg-date">Memuat daftar berkas…</p>}
      {status === 'error' && <div className="pg-msg err">Daftar berkas belum bisa dimuat. Coba muat ulang halaman.</div>}
      {status === 'ok' && shown.length === 0 && (
        <div className="pg-empty">
          {items.length === 0
            ? 'Belum ada berkas yang tersedia. Silakan datang atau hubungi kantor perizinan untuk mendapatkan formulir.'
            : 'Tidak ada berkas yang cocok.'}
        </div>
      )}

      <div className="pg-list">
        {shown.map((i) => (
          <article key={i.id} className="pg-card">
            <div className="pg-file">
              <div className="ic"><IkonBerkas url={i.url} /></div>
              <div className="tx">
                <div className="pg-row">
                  <span className="pg-badge">{i.kategori}</span>
                  {ekstensi(i.url) && <span className="pg-badge k-abu">{ekstensi(i.url).toUpperCase()}</span>}
                  {i.ukuran && <span className="pg-date">{i.ukuran}</span>}
                  {i.tanggal && <span className="pg-date">{fmtTanggal(i.tanggal)}</span>}
                </div>
                <h3>{i.judul}</h3>
                {i.deskripsi && <p>{i.deskripsi}</p>}
              </div>
              <a className="pg-btn" href={i.url} target="_blank" rel="noopener noreferrer" download>
                <Download size={16} /> Unduh
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
