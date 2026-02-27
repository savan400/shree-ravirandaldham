'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Image as ImageIcon } from 'lucide-react';

export default function NotFoundContent() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
     

        .not-found-root {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a0a00;
          overflow: hidden;
          position: relative;
          font-family: var(--font-cinzel);
        }

        /* Layered background */
        .bg-layer-1 {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, #5c1a00 0%, transparent 70%),
                      radial-gradient(ellipse 60% 40% at 20% 100%, #3d0f00 0%, transparent 60%),
                      radial-gradient(ellipse 40% 50% at 80% 80%, #2a0800 0%, transparent 60%),
                      #0e0500;
        }

        /* Mandala / sacred circle */
        .mandala-wrap {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(700px, 95vw);
          height: min(700px, 95vw);
          pointer-events: none;
        }
        .mandala {
          width: 100%; height: 100%;
          animation: rotateSlow 60s linear infinite;
          opacity: 0.07;
        }
        @keyframes rotateSlow { to { transform: rotate(360deg); } }

        /* Floating particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: floatUp linear infinite;
          opacity: 0;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }

        /* Diya flame */
        .diya-container {
          position: relative;
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .diya-svg { width: 70px; filter: drop-shadow(0 0 20px #ff6b00); }
        .flame { animation: flameDance 1.2s ease-in-out infinite alternate; transform-origin: 50% 90%; }
        @keyframes flameDance {
          from { transform: scaleX(1)   scaleY(1)   rotate(-3deg); }
          to   { transform: scaleX(0.85) scaleY(1.15) rotate(3deg); }
        }
        .glow-ring {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,120,0,0.35) 0%, transparent 70%);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
          50%       { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
        }

        /* 404 number */
        .num-404 {
          font-family: var(--font-display);
          font-size: clamp(5rem, 18vw, 10rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ff9500 0%, #ff4e00 40%, #ffc200 70%, #ff6600 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 40px rgba(255,120,0,0.5));
          line-height: 1;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(255,120,0,0.4)); }
          50%       { filter: drop-shadow(0 0 60px rgba(255,180,0,0.7)); }
        }

        /* Ornamental divider */
        .ornament {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
          margin: 1.5rem 0;
        }
        .ornament-line {
          flex: 1; max-width: 120px;
          height: 1px;
          background: linear-gradient(to right, transparent, #c8791a, transparent);
        }
        .ornament-diamond {
          width: 8px; height: 8px;
          background: #e8981f;
          transform: rotate(45deg);
          box-shadow: 0 0 8px #ff9500;
        }
        .ornament-dot {
          width: 4px; height: 4px;
          background: #c8791a;
          border-radius: 50%;
        }

        /* Subtitle */
        .subtitle-path {
          font-family: var(--font-noto-hindi);
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: rgba(255,160,60,0.7);
          letter-spacing: 0.1em;
          word-break: break-all;
          max-width: 420px;
          margin: 0 auto 0.5rem;
        }
        .title-main {
          font-family: var(--font-cinzel);
          font-size: clamp(1.4rem, 4vw, 2rem);
          color: #f5c87a;
          font-weight: 700;
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 20px rgba(200,100,0,0.4);
        }
        .body-text {
          font-family: var(--font-noto-hindi);
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          color: rgba(230,185,120,0.65);
          line-height: 1.8;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Cards */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2.5rem;
          max-width: 520px;
          width: 100%;
        }
        @media (max-width: 500px) {
          .cards-grid { grid-template-columns: 1fr; max-width: 200px; }
        }

        .nav-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(200,120,30,0.2);
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          cursor: pointer;
        }
        .nav-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,120,0,0.08), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .nav-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, #ff9500, transparent);
          transform: scaleX(0);
          transition: transform 0.4s;
        }
        .nav-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255,150,0,0.5);
          box-shadow: 0 20px 60px rgba(255,80,0,0.2), 0 0 0 1px rgba(255,150,0,0.1);
        }
        .nav-card:hover::before { opacity: 1; }
        .nav-card:hover::after  { transform: scaleX(1); }
        .nav-card:hover .card-icon { background: rgba(255,120,0,0.2); color: #ffb347; transform: scale(1.1); }

        .card-icon {
          width: 48px; height: 48px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,120,0,0.08);
          color: rgba(255,150,60,0.8);
          margin-bottom: 0.75rem;
          transition: all 0.4s;
          border: 1px solid rgba(200,100,0,0.2);
        }
        .card-label {
          font-family: var(--font-cinzel);
          font-size: 0.8rem;
          font-weight: 600;
          color: #e8c890;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Bottom brand */
        .brand-text {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: rgba(200,130,50,0.45);
          text-transform: uppercase;
          margin-top: 2.5rem;
        }

        /* Entrance animations */
        .fade-up { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .d0  { animation-delay: 0s; }
        .d1  { animation-delay: 0.15s; }
        .d2  { animation-delay: 0.3s; }
        .d3  { animation-delay: 0.45s; }
        .d4  { animation-delay: 0.6s; }
        .d5  { animation-delay: 0.75s; }
      `}</style>

      <div className="not-found-root">
        <div className="bg-layer-1" />

        {/* Sacred geometry mandala */}
        <div className="mandala-wrap">
          <svg className="mandala" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[0, 30, 60, 90, 120, 150].map(r => (
              <g key={r} transform={`rotate(${r} 100 100)`}>
                <circle cx="100" cy="100" r="90" stroke="#c8791a" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="70" stroke="#c8791a" strokeWidth="0.3" />
                <line x1="100" y1="10" x2="100" y2="190" stroke="#c8791a" strokeWidth="0.3" />
                <ellipse cx="100" cy="55" rx="18" ry="45" stroke="#c8791a" strokeWidth="0.4" />
              </g>
            ))}
            <circle cx="100" cy="100" r="12" stroke="#ff9500" strokeWidth="1" />
            <circle cx="100" cy="100" r="4" fill="#ff9500" />
          </svg>
        </div>

        {/* Floating ember particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${5 + (i * 5.5) % 90}%`,
              bottom: `-10px`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: i % 3 === 0 ? '#ff9500' : i % 3 === 1 ? '#ffc200' : '#ff4e00',
              animationDuration: `${6 + (i * 1.3) % 8}s`,
              animationDelay: `${(i * 0.7) % 7}s`,
            }}
          />
        ))}

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Diya */}
          <div className="diya-container fade-up d0">
            <div className="glow-ring" />
            <svg className="diya-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Flame */}
              <g className="flame">
                <ellipse cx="50" cy="28" rx="8" ry="18" fill="url(#fg1)" opacity="0.9" />
                <ellipse cx="50" cy="32" rx="5" ry="12" fill="url(#fg2)" />
                <ellipse cx="50" cy="36" rx="3" ry="7" fill="white" opacity="0.8" />
              </g>
              {/* Diya bowl */}
              <path d="M20 70 Q50 55 80 70 Q85 80 80 88 Q50 95 20 88 Q15 80 20 70Z" fill="url(#dg1)" />
              <path d="M20 70 Q50 63 80 70" stroke="#ff8c00" strokeWidth="1.5" fill="none" />
              <ellipse cx="50" cy="70" rx="30" ry="8" fill="url(#dg2)" opacity="0.5" />
              {/* Wick */}
              <line x1="50" y1="62" x2="50" y2="46" stroke="#c8791a" strokeWidth="1.5" />
              <defs>
                <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffff88" />
                  <stop offset="50%" stopColor="#ff9500" />
                  <stop offset="100%" stopColor="#ff4e00" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="#ff9500" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b05a10" />
                  <stop offset="100%" stopColor="#7a3800" />
                </linearGradient>
                <radialGradient id="dg2" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#ff9500" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* 404 */}
          <div className="num-404 fade-up d1">404</div>

          {/* Ornament */}
          <div className="ornament fade-up d2">
            <div className="ornament-line" />
            <div className="ornament-dot" />
            <div className="ornament-diamond" />
            <div className="ornament-dot" />
            <div className="ornament-line" />
          </div>

          {/* Heading */}
          <div className="fade-up d2">
            <div className="subtitle-path">{pathname}</div>
            <h2 className="title-main">Page Not Found</h2>
            <p className="body-text">
              This path leads beyond the temple walls.<br />
              Let us guide you back to sacred ground.
            </p>
          </div>

          {/* Cards */}
          <div className="cards-grid fade-up d3">
            <Link href="/" className="nav-card">
              <div className="card-icon"><Home size={20} /></div>
              <span className="card-label">Home</span>
            </Link>
            <Link href="/events/upcoming-events" className="nav-card">
              <div className="card-icon"><Calendar size={20} /></div>
              <span className="card-label">Events</span>
            </Link>
            <Link href="/events/photo-gallery" className="nav-card">
              <div className="card-icon"><ImageIcon size={20} /></div>
              <span className="card-label">Gallery</span>
            </Link>
          </div>

          {/* Brand */}
          <p className="brand-text fade-up d4">✦ Shree Ravirandaldham ✦</p>
        </div>
      </div>
    </>
  );
}