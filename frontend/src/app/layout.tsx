// src/app/layout.tsx
import Providers from './providers';
import AuthInit from '@/components/auth/AuthInit';
import SessionTimeout from '@/components/auth/SessionTimeout';

import Footer from '@/components/layout/Footer';
import './globals.css';
import Marquee from '@/components/home/Marquee';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Cake Heaven - Delicious Cakes & Pastries',
  description: 'Premium quality cakes and pastries for all occasions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Marquee />
          <Header />
          <Navbar />
          <AuthInit />
          <SessionTimeout />
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}