"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./TypingText.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const FULL_TEXT = "श्रद्धा का दूसरा नाम श्री रवीरांदल धाम";
const TYPING_SPEED_MS = 70;
const PAUSE_AFTER_MS = 2800;
const DOT_CHAIN_WIDTH = 220;

// ─── Sub-components ───────────────────────────────────────────────────────────

const LotusIcon: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <ellipse cx="14" cy="20" rx="3" ry="6" fill="url(#lp1)" opacity="0.9" />
    <ellipse cx="8"  cy="18" rx="3" ry="5" transform="rotate(-30 8 18)"  fill="url(#lp2)" opacity="0.8" />
    <ellipse cx="20" cy="18" rx="3" ry="5" transform="rotate(30 20 18)"  fill="url(#lp2)" opacity="0.8" />
    <ellipse cx="5"  cy="16" rx="2.5" ry="4" transform="rotate(-55 5 16)"  fill="url(#lp3)" opacity="0.6" />
    <ellipse cx="23" cy="16" rx="2.5" ry="4" transform="rotate(55 23 16)"  fill="url(#lp3)" opacity="0.6" />
    <path d="M4 22 Q14 14 24 22" stroke="url(#lg1)" strokeWidth="1.5" fill="none" />
    <defs>
      <linearGradient id="lp1" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FF8C00" />
      </linearGradient>
      <linearGradient id="lp2" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFB700" />
        <stop offset="1" stopColor="#FF6B00" />
      </linearGradient>
      <linearGradient id="lp3" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFA500" stopOpacity="0.7" />
        <stop offset="1" stopColor="#FF4500" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#FF6B00" stopOpacity="0" />
        <stop offset="0.5" stopColor="#FFD700" />
        <stop offset="1" stopColor="#FF6B00" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

interface DotChainProps {
  width?: number;
}

const DotChain: React.FC<DotChainProps> = ({ width = 200 }) => {
  const count = Math.floor(width / 16);
  return (
    <svg
      width={width}
      height="12"
      viewBox={`0 0 ${width} 12`}
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <circle
            cx={8 + i * 16}
            cy="6"
            r={i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5}
            fill="#F5A623"
            opacity={i % 4 === 0 ? 1 : 0.5}
          />
          {i < count - 1 && (
            <line
              x1={11 + i * 16}
              y1="6"
              x2={19 + i * 16}
              y2="6"
              stroke="#F5A623"
              strokeWidth="0.8"
              opacity="0.3"
            />
          )}
        </g>
      ))}
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TypingText: React.FC = () => {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [mounted, setMounted] = useState(false);
  const idx = useRef(0);

  // Mount flag for entry animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Typewriter loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!typing) return;

      if (idx.current < FULL_TEXT.length) {
        setDisplayed(FULL_TEXT.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setTyping(false);
        setTimeout(() => {
          idx.current = 0;
          setDisplayed("");
          setTyping(true);
        }, PAUSE_AFTER_MS);
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(interval);
  }, [typing]);

  return (
    <section className={styles.section} aria-label="Tagline banner">
      {/* ── Border Bands ── */}
      <div className={`${styles.borderBand} ${styles["borderBand--top"]}`}    aria-hidden="true" />
      <div className={`${styles.borderBandThin} ${styles["borderBandThin--top"]}`} aria-hidden="true" />
      <div className={`${styles.borderBand} ${styles["borderBand--bottom"]}`} aria-hidden="true" />
      <div className={`${styles.borderBandThin} ${styles["borderBandThin--bottom"]}`} aria-hidden="true" />

      {/* ── Shine sweep ── */}
      <div className={styles.shineOverlay} aria-hidden="true" />

      {/* ── Floating lotuses ── */}
      <div className={`${styles.lotus} ${styles["lotus--left"]}`}>
        <LotusIcon />
      </div>
      <div className={`${styles.lotus} ${styles["lotus--right"]}`}>
        <LotusIcon />
      </div>

      {/* ── OM watermarks ── */}
      <div className={`${styles.watermark} ${styles["watermark--right"]}`} aria-hidden="true">ॐ</div>
      <div className={`${styles.watermark} ${styles["watermark--left"]}`}  aria-hidden="true">ॐ</div>

      {/* ── Main content ── */}
      <div className={styles.content}>
        {/* Top ornament */}
        <div className={`${styles.ornamentWrap} ${styles["ornamentWrap--top"]}`}>
          <DotChain width={DOT_CHAIN_WIDTH} />
        </div>

        {/* Typing text + cursor */}
        <h2
          className={`${styles.typingText} ${mounted ? styles["typingText--mounted"] : ""}`}
          aria-live="polite"
          aria-label={FULL_TEXT}
        >
          {displayed}
        </h2>
        <span className={styles.cursor} aria-hidden="true" />

        {/* Bottom ornament */}
        <div className={`${styles.ornamentWrap} ${styles["ornamentWrap--bottom"]}`}>
          <DotChain width={DOT_CHAIN_WIDTH} />
        </div>
      </div>
    </section>
  );
};

export default TypingText;