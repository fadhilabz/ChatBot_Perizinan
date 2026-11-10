'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Bot, User, Send, Trash2, Copy, Check, Building2, HardHat, ListChecks,
  Clock, MapPin, ClipboardCheck, ExternalLink, Lightbulb, BookOpen,
} from 'lucide-react';

// ====== EDIT DI SINI ======
const KONTAK = {
  nama: 'Kantor Layanan Perizinan Kota Baubau',
  alamat: 'Jl. Raya Palagimata, Kel. Lipu, Kec. Betoambari, Kota Baubau, Sulawesi Tenggara 93721', // pastikan masih benar
  jam: '', // isi jam resmi, kosongkan untuk menyembunyikan
  telepon: '', // isi kalau sudah diverifikasi
};

const TOPIK = [
  { ikon: Building2, judul: 'Syarat NIB', teks: 'Dokumen dan cara daftar lewat OSS', q: 'Apa saja syarat mengurus NIB?' },
  { ikon: HardHat, judul: 'Ketentuan PBG', teks: 'Persetujuan Bangunan Gedung', q: 'Bagaimana ketentuan PBG?' },
  { ikon: ListChecks, judul: 'Daftar Layanan', teks: '15 sektor perizinan', q: 'Apa saja layanan perizinan yang ada di Kota Baubau?' },
  { ikon: Clock, judul: 'Jam Layanan', teks: 'Hari dan jam buka kantor', q: 'Kapan jam layanan kantor perizinan?' },
  { ikon: MapPin, judul: 'Lokasi Kantor', teks: 'Alamat dan cara ke sana', q: 'Di mana alamat kantor layanan perizinan?' },
  { ikon: ClipboardCheck, judul: 'Cek Status', teks: 'Pantau permohonan Anda', q: 'Bagaimana cara mengecek status permohonan?' },
];

const CHIPS = [
  { label: 'Syarat NIB', q: 'Apa saja syarat mengurus NIB?' },
  { label: 'PBG', q: 'Bagaimana ketentuan PBG?' },
  { label: 'Daftar Izin', q: 'Apa saja layanan perizinan yang ada di Kota Baubau?' },
  { label: 'Jam Layanan', q: 'Kapan jam layanan kantor perizinan?' },
  { label: 'Lokasi Kantor', q: 'Di mana alamat kantor layanan perizinan?' },
  { label: 'Cek Status', q: 'Bagaimana cara mengecek status permohonan?' },
];

const TAUTAN = [
  { label: 'OSS (urus NIB)', href: 'https://oss.go.id' },
  { label: 'SIMBG (urus PBG)', href: 'https://simbg.pu.go.id' },
];

const TIPS = [
  'Tulis pertanyaan yang spesifik, misalnya "syarat NIB perorangan".',
  'Sebutkan jenis izin yang Anda maksud.',
  'Untuk keputusan resmi, hubungi kantor perizinan.',
];
// ==========================

const WELCOME = {
  role: 'bot',
  t: null,
  text: 'Halo! Saya asisten virtual layanan perizinan Kota Baubau. Silakan tanyakan seputar NIB, PBG, daftar izin, atau lokasi kantor.',
};

// ---------- tampilan teks balasan (tebal, daftar, tautan) ----------
const INLINE_RE = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]*[^\s).,;:!?]|\b(?:oss\.go\.id|simbg\.pu\.go\.id|dpmptsp\.baubaukota\.go\.id)\b)/g;

function inline(text, k) {
  return text.split(INLINE_RE).map((p, i) => {
    if (!p) return null;
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={`${k}-${i}`}>{p.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(p)) return <a key={`${k}-${i}`} href={p} target="_blank" rel="noopener noreferrer">{p}</a>;
    if (/^(oss\.go\.id|simbg\.pu\.go\.id|dpmptsp\.baubaukota\.go\.id)$/.test(p))
      return <a key={`${k}-${i}`} href={`https://${p}`} target="_blank" rel="noopener noreferrer">{p}</a>;
    return p;
  });
}

function Rich({ text }) {
  const blocks = [];
  let list = null;
  String(text).split('\n').forEach((raw) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)/);
    const num = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (bullet || num) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        list = { type, items: [] };
        blocks.push(list);
      }
      list.items.push((bullet || num)[1]);
    } else if (line.trim() === '') {
      list = null;
    } else {
      list = null;
      blocks.push({ type: 'p', text: line });
    }
  });
  return blocks.map((b, i) => {
    if (b.type === 'p') return <p key={i}>{inline(b.text, i)}</p>;
    const Tag = b.type;
    return (
      <Tag key={i}>
        {b.items.map((t, j) => (
          <li key={j}>{inline(t, `${i}-${j}`)}</li>
        ))}
      </Tag>
    );
  });
}

const fmtTime = (t) => (t ? new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '');

const CSS = `
.cx-wrap{display:grid;grid-template-columns:minmax(0,1fr) 300px;grid-template-rows:minmax(0,1fr);gap:16px;height:calc(100dvh - 150px)}
.cx-card{background:#fff;border:1px solid #e3e8ef;border-radius:16px;display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden}
.cx-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,#12365c,#1f5a94);color:#fff}
.cx-avatar{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cx-head h2{margin:0;font-size:17px;line-height:1.2}
.cx-status{display:flex;align-items:center;gap:6px;font-size:12.5px;opacity:.92;margin-top:2px}
.cx-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block}
.cx-clear{margin-left:auto;display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.28);border-radius:9px;padding:7px 11px;font-size:13px;cursor:pointer}
.cx-clear:hover{background:rgba(255,255,255,.24)}
.cx-log{flex:1;min-height:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;background:#f7f9fc;scrollbar-width:none;-ms-overflow-style:none}
.cx-log::-webkit-scrollbar{display:none}
.cx-msg{display:flex;gap:10px;align-items:flex-start;max-width:92%}
.cx-msg.user{flex-direction:row-reverse;align-self:flex-end}
.cx-ava{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#e8f0fa;color:#12365c}
.cx-msg.user .cx-ava{background:#12365c;color:#fff}
.cx-bubble{background:#fff;border:1px solid #e3e8ef;border-radius:4px 14px 14px 14px;padding:10px 13px;font-size:15px;line-height:1.55;min-width:0;overflow-wrap:anywhere}
.cx-msg.user .cx-bubble{background:#12365c;border-color:#12365c;color:#fff;border-radius:14px 4px 14px 14px}
.cx-bubble p{margin:0}
.cx-bubble p+p,.cx-bubble ul,.cx-bubble ol{margin-top:8px}
.cx-bubble ul,.cx-bubble ol{margin-bottom:0;padding-left:20px}
.cx-bubble li{padding:1px 0}
.cx-bubble a{color:#1f5a94;text-decoration:underline}
.cx-msg.user .cx-bubble a{color:#fff}
.cx-meta{display:flex;align-items:center;gap:10px;margin-top:5px;font-size:12px;color:#667085;min-height:20px}
.cx-msg.user .cx-meta{justify-content:flex-end}
.cx-copy{display:inline-flex;align-items:center;gap:4px;background:none;border:0;color:#667085;font-size:12px;cursor:pointer;padding:2px 4px;border-radius:6px}
.cx-copy:hover{background:#eef2f7;color:#12365c}
.cx-typing{display:inline-flex;gap:4px;padding:4px 2px}
.cx-typing i{width:7px;height:7px;border-radius:50%;background:#98a2b3;animation:cx-bounce 1.2s infinite ease-in-out}
.cx-typing i:nth-child(2){animation-delay:.15s}
.cx-typing i:nth-child(3){animation-delay:.3s}
@keyframes cx-bounce{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}
.cx-topics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:2px}
.cx-topic{display:flex;gap:8px;align-items:flex-start;text-align:left;background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:9px 10px;cursor:pointer;font:inherit;color:inherit;transition:border-color .15s,box-shadow .15s}
.cx-topic:hover{border-color:#9db8d6;box-shadow:0 4px 14px rgba(18,54,92,.1)}
.cx-topic .ic{width:30px;height:30px;border-radius:10px;background:#e8f0fa;color:#12365c;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cx-topic b{display:block;font-size:13.5px}
.cx-topic span{display:block;font-size:12px;line-height:1.35;color:#667085;margin-top:1px}
.cx-chips{display:flex;gap:8px;padding:10px 16px 0;overflow-x:auto;scrollbar-width:thin}
.cx-chip{white-space:nowrap;background:#fff;border:1px solid #d5e3f3;color:#12365c;border-radius:999px;padding:7px 13px;font-size:13.5px;cursor:pointer}
.cx-chip:hover:not(:disabled){background:#eef4fb}
.cx-chip:disabled{opacity:.55;cursor:not-allowed}
.cx-composer{display:flex;gap:10px;align-items:center;padding:12px 16px 6px}
.cx-foot{margin:0;padding:0 16px 10px;font-size:12px;color:#667085;text-align:center}
.cx-composer .cx-field{flex:1;position:relative;min-width:0}
.cx-composer .cx-input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #d0d7e2;border-radius:12px;font-size:15px;background:#fff;outline:none}
.cx-composer .cx-input:focus{border-color:#1f5a94;box-shadow:0 0 0 3px rgba(31,90,148,.15)}
.cx-count{position:absolute;right:10px;bottom:-16px;font-size:11.5px;color:#98a2b3}
.cx-composer .cx-send{display:inline-flex;align-items:center;gap:7px;background:#12365c;color:#fff;border:0;border-radius:12px;padding:12px 18px;font-size:15px;font-weight:600;cursor:pointer}
.cx-composer .cx-send:hover:not(:disabled){background:#1a4a7a}
.cx-composer .cx-send:disabled{opacity:.5;cursor:not-allowed}
.cx-side{display:flex;flex-direction:column;gap:10px;height:100%;min-height:0;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.cx-side::-webkit-scrollbar{display:none}
.cx-panel{background:#fff;border:1px solid #e3e8ef;border-radius:14px;padding:12px 14px;flex-shrink:0}
.cx-panel h3{margin:0 0 8px;font-size:14.5px;display:flex;align-items:center;gap:8px}
.cx-panel h3 svg{color:#12365c}
.cx-panel p{margin:3px 0;font-size:13.5px;line-height:1.45}
.cx-panel ul{margin:0;padding-left:18px}
.cx-panel li{font-size:13.5px;padding:3px 0;color:#344054}
.cx-link{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 10px;border:1px solid #e3e8ef;border-radius:10px;text-decoration:none;color:#12365c;font-size:13.5px;font-weight:600;margin-top:6px}
.cx-link:hover{background:#eef4fb}
.cx-wrap button:focus-visible,.cx-wrap a:focus-visible{outline:2px solid #1f5a94;outline-offset:2px}
@media(max-height:900px){.cx-tips{display:none}}
@media(max-width:900px){.cx-wrap{grid-template-columns:1fr}.cx-side{display:none}}
@media(max-width:560px){.cx-topics{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:520px){.cx-msg{max-width:100%}.cx-composer .cx-send span{display:none}.cx-head{padding:12px}}
@media(prefers-reduced-motion:reduce){.cx-typing i{animation:none}}
`;

export default function ChatPage() {
  const [log, setLog] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(-1);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Tinggi area chat = sisa layar di bawah header, sehingga halaman tidak perlu di-scroll.
  // Jika layar terlalu pendek (di bawah MIN), scroll halaman dibiarkan aktif.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const MIN = 360;
    const html = document.documentElement;
    const body = document.body;
    function fit() {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const avail = window.innerHeight - top - 16;
      if (avail >= MIN) {
        el.style.height = `${avail}px`;
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
      } else {
        el.style.height = `${MIN}px`;
        html.style.overflow = '';
        body.style.overflow = '';
      }
    }
    fit();
    const raf = requestAnimationFrame(fit);
    const timer = setTimeout(fit, 300);
    window.addEventListener('resize', fit);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', fit);
      el.style.height = '';
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [log, busy]);

  async function ask(text) {
    const q = text.trim();
    if (!q || busy) return;
    setLog((l) => [...l, { role: 'user', text: q, t: Date.now() }]);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setLog((l) => [...l, { role: 'bot', text: data.reply || data.error || 'Terjadi kesalahan.', t: Date.now() }]);
    } catch {
      setLog((l) => [...l, { role: 'bot', text: 'Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.', t: Date.now() }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  async function copyText(i, text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(-1), 1500);
    } catch {
      /* diabaikan jika browser menolak akses clipboard */
    }
  }

  function clearChat() {
    if (busy) return;
    setLog([WELCOME]);
    setInput('');
    inputRef.current?.focus();
  }

  const fresh = log.length === 1;

  return (
    <>
      <style>{CSS}</style>
      <div className="cx-wrap" ref={wrapRef}>
        <section className="cx-card" aria-label="Percakapan dengan asisten">
          <header className="cx-head">
            <div className="cx-avatar"><Bot size={24} /></div>
            <div>
              <h2>Asisten Perizinan</h2>
              <div className="cx-status"><span className="cx-dot" /> Online, menjawab dari data FAQ kantor</div>
            </div>
            <button type="button" className="cx-clear" onClick={clearChat} disabled={busy || fresh} aria-label="Hapus percakapan">
              <Trash2 size={15} /> Hapus
            </button>
          </header>

          <div className="cx-log" ref={logRef} aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`cx-msg ${m.role}`}>
                <div className="cx-ava">{m.role === 'bot' ? <Bot size={18} /> : <User size={18} />}</div>
                <div>
                  <div className="cx-bubble"><Rich text={m.text} /></div>
                  <div className="cx-meta">
                    {m.t && <span>{fmtTime(m.t)}</span>}
                    {m.role === 'bot' && i > 0 && (
                      <button type="button" className="cx-copy" onClick={() => copyText(i, m.text)}>
                        {copied === i ? <><Check size={13} /> Tersalin</> : <><Copy size={13} /> Salin</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {fresh && (
              <div className="cx-topics">
                {TOPIK.map((t) => (
                  <button key={t.judul} type="button" className="cx-topic" onClick={() => ask(t.q)} disabled={busy}>
                    <span className="ic"><t.ikon size={18} /></span>
                    <span>
                      <b>{t.judul}</b>
                      <span>{t.teks}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="cx-msg bot">
                <div className="cx-ava"><Bot size={18} /></div>
                <div className="cx-bubble" aria-label="Asisten sedang mengetik">
                  <span className="cx-typing"><i /><i /><i /></span>
                </div>
              </div>
            )}
          </div>

          {!fresh && (
            <div className="cx-chips">
              {CHIPS.map((c) => (
                <button key={c.label} type="button" className="cx-chip" onClick={() => ask(c.q)} disabled={busy}>
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <form className="cx-composer" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <div className="cx-field">
              <input
                ref={inputRef}
                className="cx-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                placeholder="Tulis pertanyaan Anda…"
                autoComplete="off"
                aria-label="Pertanyaan"
              />
              {input.length > 400 && <span className="cx-count">{input.length}/500</span>}
            </div>
            <button className="cx-send" type="submit" disabled={busy || !input.trim()}>
              <Send size={17} /> <span>Kirim</span>
            </button>
          </form>
          <p className="cx-foot">Jawaban bersifat informasi umum. Keputusan resmi tetap dari kantor perizinan.</p>
        </section>

        <aside className="cx-side">
          <div className="cx-panel">
            <h3><MapPin size={17} /> Info Kantor</h3>
            <p><b>{KONTAK.nama}</b></p>
            {KONTAK.alamat && <p>{KONTAK.alamat}</p>}
            {KONTAK.jam && <p>Jam layanan: {KONTAK.jam}</p>}
            {KONTAK.telepon && <p>Telepon: {KONTAK.telepon}</p>}
          </div>

          <div className="cx-panel">
            <h3><ExternalLink size={17} /> Tautan Cepat</h3>
            {TAUTAN.map((l) => (
              <a key={l.href} className="cx-link" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} <ExternalLink size={15} />
              </a>
            ))}
            <Link className="cx-link" href="/faq">
              Buka FAQ dan Panduan <BookOpen size={15} />
            </Link>
          </div>

          <div className="cx-panel cx-tips">
            <h3><Lightbulb size={17} /> Tips Bertanya</h3>
            <ul>
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}