'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Megaphone, FolderDown } from 'lucide-react';

const MENU = [
  { href: '/admin', label: 'Tanya-Jawab', ikon: MessageSquare },
  { href: '/admin/pengumuman', label: 'Pengumuman', ikon: Megaphone },
  { href: '/admin/unduhan', label: 'Unduhan', ikon: FolderDown },
];

const CSS = `
.an-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
.an-tab{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;border:1px solid #d5e3f3;background:#fff;color:#12365c;font-weight:600;font-size:14px;text-decoration:none}
.an-tab:hover{background:#eef4fb}
.an-tab.on{background:#12365c;color:#fff;border-color:#12365c}
`;

// Menu navigasi antar halaman admin (Tanya-Jawab, Pengumuman, Unduhan).
export default function AdminNav() {
  const pathname = usePathname() || '';
  return (
    <>
      <style>{CSS}</style>
      <nav className="an-nav" aria-label="Menu admin">
        {MENU.map((m) => {
          const aktif = m.href === '/admin' ? pathname === '/admin' : pathname.startsWith(m.href);
          return (
            <Link key={m.href} href={m.href} className={`an-tab ${aktif ? 'on' : ''}`} aria-current={aktif ? 'page' : undefined}>
              <m.ikon size={16} /> {m.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
