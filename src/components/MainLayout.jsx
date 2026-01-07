// D:\ene\src\components\MainLayout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Fondo from './Fondo';

/**
 * MainLayout V11
 * Uso: envolver cada página con <MainLayout>{...}</MainLayout>
 * - Proporciona Header + Fondo (opcional hero) + Footer
 * - Recibe props: mode, heroImage, children
 */

export default function MainLayout({
  children,
  mode = 'day',        // 'day' | 'night'
  heroImage = null,    // url or null
  overlay = true,
  parallax = false
}) {
  return (
    <Fondo mode={mode} heroImage={heroImage} overlay={overlay} parallax={parallax}>
      <div className="site-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main role="main" style={{ flex: 1, paddingTop: 16 }}>
          {children}
        </main>
        <Footer mode={mode} />
      </div>

      <style>{`
        .site-root { color: var(--mo-text); background: transparent; }
        main[role="main"] { max-width: 1200px; margin: 0 auto; padding: 20px; width: 100%; box-sizing: border-box; }
        @media (max-width:760px) {
          main[role="main"] { padding: 12px; }
        }
      `}</style>
    </Fondo>
  );
}
