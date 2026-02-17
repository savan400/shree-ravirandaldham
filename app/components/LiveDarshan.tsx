"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./LiveDarshan.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticleData {
  left: string;
  bottom: string;
  dur: string;
  delay: string;
  isGold: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLES: ParticleData[] = Array.from({ length: 8 }, (_, i) => ({
  left: `${8 + i * 11}%`,
  bottom: `${15 + (i % 3) * 18}%`,
  dur: `${3 + i * 0.4}s`,
  delay: `${i * 0.3}s`,
  isGold: i % 2 === 0,
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

const LiveBadge: React.FC = () => (
  <div className={styles.liveBadge}>
    <div className={styles.liveDot} aria-hidden="true" />
    <span className={styles.liveText}>LIVE</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

interface CornerProps {
  flip?: boolean;
}

const Corner: React.FC<CornerProps> = ({ flip = false }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    className={`${styles.corner} ${flip ? styles["corner--br"] : styles["corner--tl"]}`}
    aria-hidden="true"
  >
    <path d="M3 57 L3 3 L57 3" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.7" />
    <circle cx="3" cy="3" r="3" fill="#FFD700" opacity="0.9" />
    <path d="M3 18 Q14 18 14 3" stroke="#F5A623" strokeWidth="0.7" fill="none" opacity="0.4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const OrnamentLine: React.FC = () => (
  <div className={styles.ornamentLine} aria-hidden="true">
    <div className={styles["ornamentLineSegment--left"]} />
    <div className={styles.ornamentDiamondSm} />
    <div className={styles.ornamentDiamondLg} />
    <div className={styles.ornamentDiamondSm} />
    <div className={styles["ornamentLineSegment--right"]} />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const LiveDarshan: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="live-darshan"
      className={styles.section}
      aria-labelledby="ld-title"
    >
      {/* ── Background decorations ── */}
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.amberGlow} aria-hidden="true" />
      <div className={styles.scanLine} aria-hidden="true" />
      <div className={styles.watermark} aria-hidden="true">ॐ</div>

      {/* ── Border bands ── */}
      <div className={`${styles.borderBand} ${styles["borderBand--top"]}`} aria-hidden="true" />
      <div className={`${styles.borderBand} ${styles["borderBand--bottom"]}`} aria-hidden="true" />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={`${styles.particle} ${p.isGold ? styles["particle--gold"] : styles["particle--saffron"]}`}
          style={{
            left: p.left,
            bottom: p.bottom,
            // Per-particle timing must stay inline — runtime values from array index
            ["--dur" as string]: p.dur,
            ["--delay" as string]: p.delay,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Content ── */}
      <div className={styles.container}>

        {/* Section header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles.hidden}`}>
          <div className={styles.headerRow}>
            <LiveBadge />
            <span className={styles.sanskritLabel}>॥ સીધા દર્શન ॥</span>
          </div>

          <h2 id="ld-title" className={styles.title}>
            લાઈવ દર્શન
          </h2>

          <OrnamentLine />
        </div>

        {/* Video wrapper */}
        <div className={visible ? styles["video--visible"] : styles.hidden}>
          {/* Outer gradient border frame */}
          <div className={styles.videoOuter}>
            <Corner flip={false} />
            <Corner flip={true} />

            {/* Inner dark bezel */}
            <div className={styles.videoBezel}>
              {/* Top info bar */}
              <div className={styles.infoBar}>
                <div className={styles.infoBarLeft}>
                  <div className={styles.infoBarDot} aria-hidden="true" />
                  <span className={styles.infoBarLabel}>LIVE BROADCAST</span>
                </div>
                <span className={styles.infoBarLocation}>
                  Shree KasthBhanjandev Hanumanji Mandir, Salangpur
                </span>
              </div>

              {/* YouTube embed */}
              <div className={styles.embedWrap}>
                <iframe
                  className={styles.embed}
                  src="https://www.youtube.com/embed/SrDCZCWmz1U?autoplay=0&modestbranding=1&rel=0"
                  title="Live Darshan — Shree KasthBhanjandev Hanumanji Mandir Salangpur"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Bottom status bar */}
              <div className={styles.statusBar}>
                <div className={styles.statusDot} aria-hidden="true" />
                <span className={styles.statusText}>STREAMING LIVE IN 4K ULTRAHD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className={`${styles.footerNote} ${visible ? styles["footer--visible"] : styles.hidden}`}>
          <p className={styles.footerText}>
            ॥ જય હનુમાન — ઓનલાઈન દર્શનનો લ્હાવો લો ॥
          </p>
        </div>

      </div>
    </section>
  );
};

export default LiveDarshan;