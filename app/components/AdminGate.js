'use client';
import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { PAGE_CSS } from '@/lib/pageStyles';

// Gerbang login admin. Anak (children) berupa fungsi: (pw, keluar) => tampilan.
export default function AdminGate({ children }) {
  const [pw, setPw] = useState(null);
  const [input, setInput] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  async function verifikasi(kandidat, diam) {
    setBusy(true);
    try {
      const r = await fetch('/api/admin-check', {
        headers: { 'x-admin-password': encodeURIComponent(kandidat) },
        cache: 'no-store',
      });
      if (r.ok) {
        sessionStorage.setItem('adm_pw', kandidat);
        setPw(kandidat);
        setErr('');
      } else {
        sessionStorage.removeItem('adm_pw');
        if (!diam) setErr('Kata sandi salah.');
      }
    } catch {
      if (!diam) setErr('Tidak dapat terhubung ke server.');
    }
    setBusy(false);
    setReady(true);
  }

  useEffect(() => {
    const tersimpan = sessionStorage.getItem('adm_pw');
    if (tersimpan) verifikasi(tersimpan, true);
    else setReady(true);
  }, []);

  function keluar() {
    sessionStorage.removeItem('adm_pw');
    setPw(null);
    setInput('');
  }

  if (!ready) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <p className="pg-date">Memuat…</p>
      </>
    );
  }

  if (!pw) {
    return (
      <>
        <style>{PAGE_CSS}</style>
        <div className="pg-card" style={{ maxWidth: 380, margin: '40px auto' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}>
            <Lock size={18} /> Masuk Admin
          </h3>
          <form
            className="pg-form"
            onSubmit={(e) => {
              e.preventDefault();
              verifikasi(input, false);
            }}
          >
            <label>
              Kata sandi
              <input type="password" value={input} onChange={(e) => setInput(e.target.value)} autoFocus autoComplete="current-password" />
            </label>
            {err && <div className="pg-msg err">{err}</div>}
            <button className="pg-btn" type="submit" disabled={busy || !input}>
              {busy ? 'Memeriksa…' : 'Masuk'}
            </button>
          </form>
        </div>
      </>
    );
  }

  return children(pw, keluar);
}
