import { NextResponse } from 'next/server';
import { readFaq } from '@/lib/faq';
import { SITE_NAME } from '@/lib/constants';

export async function POST(req) {
  const { message } = await req.json();
  const q = String(message || '').trim().slice(0, 500);
  if (!q) return NextResponse.json({ error: 'Pertanyaan kosong' }, { status: 400 });

  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  if (!key) return NextResponse.json({ error: 'GEMINI_API_KEY belum diisi' }, { status: 500 });

  const faq = await readFaq();
  console.log('jumlah FAQ terbaca:', faq.length);
  const knowledge = faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  console.log('panjang knowledge:', knowledge.length);

  const system =
    `Kamu adalah asisten virtual ${SITE_NAME}. Jawab dalam Bahasa Indonesia, singkat, sopan, dan jelas. ` +
    `Gunakan hanya informasi pada DATA di bawah. Jika jawabannya tidak ada, katakan belum punya informasinya ` +
    `dan sarankan menghubungi atau datang langsung ke kantor. Jangan mengarang persyaratan, biaya, atau jam layanan.\n\n` +
    `DATA:\n${knowledge}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: q }] }],
        }),
      }
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || 'Maaf, saya belum bisa menjawab.';
    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Layanan chatbot sedang bermasalah. Coba lagi nanti.' }, { status: 502 });
  }
}

// SEMENTARA: untuk cek data, hapus setelah selesai debug
export async function GET() {
  const faq = await readFaq();
  return NextResponse.json({
    jumlah: faq.length,
    contoh: faq.slice(0, 2),
    ada_key: !!process.env.GEMINI_API_KEY,
  });
}