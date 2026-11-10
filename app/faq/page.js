'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '@/lib/constants';
import { LAYANAN, TOTAL_IZIN } from '@/lib/layanan';
import {
  Building2, HardHat, MessageCircle, GraduationCap, HeartPulse, Home, Users, Briefcase,
  Leaf, Store, Fish, Bus, Wheat, ShoppingCart, Factory, Camera, Radio,
  MapPin, Clock, Phone, Globe,
} from 'lucide-react';

// Ikon tiap sektor. Kunci harus sama dengan nama sektor di lib/layanan.js.
const IKON_SEKTOR = {
  'Pendidikan dan Kebudayaan': GraduationCap,
  'Kesehatan': HeartPulse,
  'Pekerjaan Umum dan Penataan Ruang': HardHat,
  'Perumahan dan Kawasan Permukiman': Home,
  'Sosial': Users,
  'Ketenagakerjaan': Briefcase,
  'Lingkungan Hidup': Leaf,
  'Koperasi dan UMKM': Store,
  'Kelautan dan Perikanan': Fish,
  'Perhubungan': Bus,
  'Pertanian': Wheat,
  'Perdagangan': ShoppingCart,
  'Perindustrian': Factory,
  'Pariwisata': Camera,
  'Komunikasi dan Informatika': Radio,
};

function IkonSektor({ nama }) {
  const Ikon = IKON_SEKTOR[nama] || Building2;
  return <Ikon size={18} strokeWidth={1.9} />;
}

// ====== EDIT DI SINI ======
const KONTAK = {
  nama: 'Kantor Layanan Perizinan Kota Baubau',
  alamat: 'Jl. Raya Palagimata, Kel. Lipu, Kec. Betoambari, Kota Baubau, Sulawesi Tenggara 93721', // pastikan masih benar
  telepon: '', // isi kalau sudah diverifikasi, kosongkan untuk menyembunyikan
  website: 'dpmptsp.baubaukota.go.id', // pastikan masih aktif
  jam: '', // isi jam resmi, kosongkan untuk menyembunyikan
};

const LAYANAN_CEPAT = [
  { ikon: Building2, judul: 'Urus NIB', teks: 'Daftar Nomor Induk Berusaha secara online lewat OSS.', href: 'https://oss.go.id', label: 'Buka OSS' },
  { ikon: HardHat, judul: 'Ajukan PBG', teks: 'Persetujuan Bangunan Gedung diajukan lewat SIMBG.', href: 'https://simbg.pu.go.id', label: 'Buka SIMBG' },
  { ikon: MessageCircle, judul: 'Tanya Chatbot', teks: 'Dapatkan jawaban cepat seputar layanan perizinan.', href: '/', label: 'Mulai Chat', internal: true },
];

// Nama kunci harus SAMA PERSIS dengan isi CATEGORIES / "category" di faq.json.
const ALUR = {
  Semua: {
    catatan: 'Alur umum. Pilih kategori di atas untuk melihat alur yang lebih spesifik.',
    langkah: [
      'Tentukan jenis layanan yang dibutuhkan.',
      'Siapkan berkas persyaratan sesuai jenis layanan.',
      'Ajukan permohonan (online atau datang ke kantor perizinan).',
      'Petugas memeriksa kelengkapan berkas.',
      'Terima hasil layanan.',
    ],
    dokumen: ['KTP pemohon', 'NPWP (jika ada)', 'Berkas lain sesuai jenis layanan'],
  },
  'Perizinan Usaha (NIB)': {
    catatan: 'Alur umum NIB lewat OSS. Hubungi kantor untuk ketentuan di Kota Baubau.',
    langkah: [
      'Siapkan KTP (NIK) pemilik usaha, NPWP, alamat usaha, dan kode KBLI.',
      'Daftar akun di oss.go.id.',
      'Isi data pelaku usaha dan kegiatan usaha di OSS.',
      'Sistem menerbitkan NIB. Pembuatan NIB tidak dipungut biaya.',
      'Jika perlu izin lanjutan sesuai tingkat risiko, lengkapi di OSS atau tanyakan ke kantor.',
    ],
    dokumen: ['KTP (NIK) pemilik usaha', 'NPWP', 'Alamat lokasi usaha', 'Kode KBLI kegiatan usaha', 'Email dan nomor HP aktif'],
  },
  'PBG / Bangunan': {
    catatan: 'Alur umum PBG lewat SIMBG. Hubungi kantor untuk ketentuan dan retribusi di Kota Baubau.',
    langkah: [
      'Siapkan identitas, bukti kepemilikan tanah, gambar teknis, dan rencana tapak.',
      'Daftar akun di simbg.pu.go.id, lalu ajukan permohonan PBG.',
      'Dinas memeriksa dokumen dan standar teknis. Pantau pemberitahuan di akun SIMBG.',
      'Bayar retribusi jika sudah ditetapkan.',
      'PBG terbit dan dapat diunduh dari akun SIMBG.',
    ],
    dokumen: ['Identitas pemohon', 'Bukti kepemilikan tanah', 'Gambar teknis (denah, tampak, potongan)', 'Rencana tapak (site plan)'],
  },
  'Izin Lainnya': {
    catatan: 'Persyaratan berbeda untuk tiap jenis izin. Tanyakan ke kantor perizinan.',
    langkah: [
      'Tanyakan ke kantor perizinan jenis izin yang dibutuhkan.',
      'Siapkan berkas persyaratan sesuai arahan petugas.',
      'Ajukan permohonan ke kantor perizinan.',
      'Petugas memeriksa kelengkapan berkas.',
      'Terima hasil layanan.',
    ],
    dokumen: ['KTP pemohon', 'Dokumen sesuai arahan petugas'],
  },
  'Informasi Umum': {
    catatan: '',
    langkah: [
      'Tanyakan informasi layanan, lokasi, dan alur lewat chatbot.',
      'Untuk hal yang belum terjawab, datang atau hubungi langsung kantor perizinan.',
    ],
    dokumen: [],
  },
};
// ==========================

// Pencocokan kategori toleran terhadap spasi, tanda baca, dan huruf besar-kecil.
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const CSS = `
.fx-hero{background:linear-gradient(135deg,#12365c,#1f5a94);color:#fff;border-radius:16px;padding:28px 24px;margin-bottom:18px}
.fx-hero h2{margin:0 0 6px;font-size:26px}
.fx-hero p{margin:0 0 16px;opacity:.9}
.fx-search{width:100%;padding:13px 16px;border-radius:10px;border:0;font-size:16px;box-sizing:border-box}
.fx-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.fx-stat{background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:14px;text-align:center}
.fx-stat b{display:block;font-size:24px;color:#12365c}
.fx-stat span{font-size:13px;color:#667085}
.fx-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:22px}
.fx-quick{background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:16px;text-decoration:none;color:inherit;display:block;transition:box-shadow .15s,transform .15s}
.fx-quick:hover{box-shadow:0 6px 18px rgba(18,54,92,.12);transform:translateY(-2px)}
.fx-quick .ik{width:44px;height:44px;border-radius:12px;background:#e8f0fa;color:#12365c;display:flex;align-items:center;justify-content:center}
.fx-quick h3{margin:8px 0 4px;font-size:16px}
.fx-quick p{margin:0 0 10px;font-size:14px;color:#667085}
.fx-quick em{font-style:normal;font-weight:600;color:#12365c;font-size:14px}
.fx-sec{margin:26px 0 10px;font-size:20px}
.fx-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;padding:0;list-style:none;margin:0}
.fx-step{background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:14px;position:relative}
.fx-step .no{width:30px;height:30px;border-radius:50%;background:#12365c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;margin-bottom:8px}
.fx-step p{margin:0;font-size:14px;line-height:1.5}
.fx-doc{background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:14px 18px;margin-top:14px}
.fx-doc h3{margin:0 0 8px;font-size:16px}
.fx-doc ul{margin:0;padding:0;list-style:none}
.fx-doc li{padding:4px 0;font-size:14px}
.fx-doc li:before{content:'✔ ';color:#1f8f5f}
.fx-contact{background:#eef4fb;border:1px solid #d5e3f3;border-radius:12px;padding:16px 18px;margin-top:22px}
.fx-contact h3{margin:0 0 8px}
.fx-contact p{margin:4px 0;font-size:14px}
.fx-note{margin-top:16px;font-size:13px;color:#667085}
.fx-warn{background:#fff6e5;border:1px solid #f5d9a0;border-radius:10px;padding:12px 14px;font-size:14px;margin:10px 0}
.fx-sektor-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;align-items:start}
.fx-sektor{background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:12px 14px}
.fx-sektor summary{cursor:pointer;font-weight:600;font-size:15px;display:flex;align-items:center;gap:10px;min-height:48px;list-style:none}
.fx-sektor summary::-webkit-details-marker{display:none}
.fx-sektor summary::after{content:'';margin-left:auto;width:8px;height:8px;border-right:2px solid #667085;border-bottom:2px solid #667085;transform:rotate(45deg);flex-shrink:0;transition:transform .15s}
.fx-sektor[open] summary::after{transform:rotate(-135deg)}
.fx-nama{line-height:1.3}
.fx-sektor summary small{color:#667085;font-weight:400;flex-shrink:0}
.fx-sektor ul{margin:8px 0 0;padding-left:18px}
.fx-sektor li{font-size:14px;padding:2px 0}
.fx-ico{display:inline-flex;width:32px;height:32px;border-radius:9px;background:#e8f0fa;color:#12365c;align-items:center;justify-content:center;flex-shrink:0}
.fx-row{display:flex;gap:8px;align-items:flex-start}
.fx-row svg{flex-shrink:0;margin-top:2px;color:#12365c}
@media(max-width:560px){.fx-stats{grid-template-columns:1fr}.fx-hero{padding:20px 16px}}
`;

export default function FaqPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Semua');

  useEffect(() => {
    fetch('/api/faq')
      .then((r) => {
        if (!r.ok) throw new Error('gagal');
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('format salah');
        setItems(data);
        setStatus('ok');
      })
      .catch(() => {
        setItems([]);
        setStatus('error');
      });
  }, []);

  const shown = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter(
      (f) =>
        (tab === 'Semua' || norm(f.category) === norm(tab)) &&
        (String(f.question).toLowerCase().includes(s) || String(f.answer).toLowerCase().includes(s))
    );
  }, [items, search, tab]);

  const alur = ALUR[tab] || ALUR.Semua;

  return (
    <>
      <style>{CSS}</style>

      <section className="fx-hero">
        <h2>FAQ dan Panduan Perizinan</h2>
        <p>Temukan jawaban seputar NIB, PBG, dan layanan perizinan lainnya di Kota Baubau.</p>
        <input
          className="fx-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pertanyaan, misalnya: syarat NIB"
          aria-label="Cari pertanyaan"
        />
      </section>

      <div className="fx-stats">
        <div className="fx-stat"><b>{items.length}</b><span>Pertanyaan tersedia</span></div>
        <div className="fx-stat"><b>{LAYANAN.length}</b><span>Sektor layanan</span></div>
        <div className="fx-stat"><b>{TOTAL_IZIN}</b><span>Jenis izin dilayani</span></div>
      </div>

      <div className="fx-grid">
        {LAYANAN_CEPAT.map((l) =>
          l.internal ? (
            <Link key={l.judul} href={l.href} className="fx-quick">
              <div className="ik"><l.ikon size={24} strokeWidth={1.8} /></div>
              <h3>{l.judul}</h3>
              <p>{l.teks}</p>
              <em>{l.label} →</em>
            </Link>
          ) : (
            <a key={l.judul} href={l.href} target="_blank" rel="noopener noreferrer" className="fx-quick">
              <div className="ik"><l.ikon size={24} strokeWidth={1.8} /></div>
              <h3>{l.judul}</h3>
              <p>{l.teks}</p>
              <em>{l.label} →</em>
            </a>
          )
        )}
      </div>

      <h2 className="fx-sec">Daftar Layanan Perizinan</h2>
      <p className="muted">
        {LAYANAN.length} sektor dan {TOTAL_IZIN} jenis izin. Klik sektor untuk melihat daftarnya.
      </p>
      <div className="fx-sektor-grid">
        {LAYANAN.map((s) => (
          <details key={s.sektor} className="fx-sektor">
            <summary>
              <span className="fx-ico"><IkonSektor nama={s.sektor} /></span>
              <span className="fx-nama">{s.sektor}</span>
              <small>({s.izin.length})</small>
            </summary>
            <ul>
              {s.izin.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <p className="fx-note">
        Daftar mengacu pada SK Wali Kota Baubau tahun 2021 dan dapat berubah. Persyaratan tiap izin berbeda, silakan tanyakan ke kantor perizinan.
      </p>

      <h2 className="fx-sec">Pertanyaan yang Sering Diajukan</h2>
      <div className="tabs" role="tablist">
        {['Semua', ...CATEGORIES].map((c) => (
          <button key={c} role="tab" aria-selected={tab === c} className={tab === c ? 'on' : ''} onClick={() => setTab(c)}>
            {c}
          </button>
        ))}
      </div>

      <div>
        {status === 'loading' && <p className="muted">Memuat pertanyaan…</p>}
        {status === 'error' && (
          <div className="fx-warn">
            Data FAQ belum bisa dimuat. Coba muat ulang halaman. Jika terus terjadi, periksa file data FAQ.
          </div>
        )}
        {status === 'ok' && shown.length === 0 && <p className="muted">Tidak ada pertanyaan yang cocok.</p>}
        {shown.map((f) => (
          <details key={f.id} className="card faq-item">
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>

      <h2 className="fx-sec">Alur Pengurusan{tab !== 'Semua' ? `: ${tab}` : ''}</h2>
      {alur.catatan && <p className="muted">{alur.catatan}</p>}
      <ol className="fx-steps">
        {alur.langkah.map((langkah, i) => (
          <li key={i} className="fx-step">
            <div className="no">{i + 1}</div>
            <p>{langkah}</p>
          </li>
        ))}
      </ol>

      {alur.dokumen.length > 0 && (
        <div className="fx-doc">
          <h3>Dokumen yang perlu disiapkan</h3>
          <ul>
            {alur.dokumen.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="fx-contact">
        <h3>Butuh bantuan langsung?</h3>
        <p><b>{KONTAK.nama}</b></p>
        {KONTAK.alamat && <p className="fx-row"><MapPin size={16} /> <span>{KONTAK.alamat}</span></p>}
        {KONTAK.jam && <p className="fx-row"><Clock size={16} /> <span>{KONTAK.jam}</span></p>}
        {KONTAK.telepon && <p className="fx-row"><Phone size={16} /> <span>{KONTAK.telepon}</span></p>}
        {KONTAK.website && <p className="fx-row"><Globe size={16} /> <span>{KONTAK.website}</span></p>}
      </section>

      <p className="fx-note">
        Informasi di halaman ini bersifat umum. Persyaratan dan keputusan resmi tetap mengikuti ketentuan kantor perizinan.
      </p>

      <Link className="fab" href="/">Tanya Chatbot</Link>
    </>
  );
}