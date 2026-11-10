'use client';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/constants';
import AdminGate from '@/app/components/AdminGate';
import AdminNav from '@/app/components/AdminNav';

const EMPTY = { id: null, question: '', answer: '', category: CATEGORIES[0] };

function Pengelola({ pw, keluar }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null); // null = form tertutup
  const [formErr, setFormErr] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-password': encodeURIComponent(pw),
  };

  const load = () =>
    fetch('/api/faq', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setItems);

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();
    setFormErr('');
    const res = await fetch('/api/faq', {
      method: form.id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return setFormErr(d.error || 'Gagal menyimpan.');
    }
    setForm(null);
    load();
  }

  async function remove(id) {
    if (!confirm('Hapus tanya-jawab ini?')) return;
    await fetch(`/api/faq?id=${id}`, { method: 'DELETE', headers });
    load();
  }

  return (
    <section>
      <AdminNav />

      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ margin: 0 }}>Data Tanya-Jawab</h2>
        <div className="row">
          <button className="btn" onClick={() => setForm({ ...EMPTY })}>Tambah Tanya-Jawab</button>
          <button className="btn ghost" onClick={keluar}>Keluar</button>
        </div>
      </div>

      {form && (
        <form className="card form" onSubmit={save}>
          <h3 style={{ margin: 0, color: 'var(--navy)' }}>{form.id ? 'Ubah Tanya-Jawab' : 'Tambah Tanya-Jawab'}</h3>
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            maxLength={300}
            placeholder="Pertanyaan"
            aria-label="Pertanyaan"
            required
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={5}
            maxLength={2000}
            placeholder="Jawaban"
            aria-label="Jawaban"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            aria-label="Kategori"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="msgline">{formErr}</div>
          <div className="row">
            <button className="btn" type="submit">Simpan</button>
            <button className="btn ghost" type="button" onClick={() => setForm(null)}>Batal</button>
          </div>
        </form>
      )}

      <div className="wrap">
        <table>
          <thead>
            <tr><th>Pertanyaan</th><th>Jawaban</th><th>Kategori</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f.id}>
                <td>{f.question}</td>
                <td>{f.answer}</td>
                <td>{f.category}</td>
                <td>
                  <div className="row">
                    <button className="btn ghost" onClick={() => setForm({ ...f })}>Ubah</button>
                    <button className="btn ghost" onClick={() => remove(f.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminPage() {
  return <AdminGate>{(pw, keluar) => <Pengelola pw={pw} keluar={keluar} />}</AdminGate>;
}