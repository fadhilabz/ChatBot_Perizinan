'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Chat' },
  { href: '/faq', label: 'FAQ' },
  { href: '/unduhan', label: 'Unduhan' },
  { href: '/pengumuman', label: 'pengumuman' },
  { href: '/admin', label: 'Admin' },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="top">
      <div className="bar">
        <div className="logo" aria-label="Placeholder logo">LOGO</div>
        <h1>Asisten Layanan Perizinan Kota Baubau</h1>
        <nav>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? 'on' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
