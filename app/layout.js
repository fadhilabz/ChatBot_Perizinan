import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata = {
  title: 'Asisten Layanan Perizinan Kota Baubau',
  description: 'Chatbot dan FAQ layanan perizinan Kota Baubau',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
          <Header />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
