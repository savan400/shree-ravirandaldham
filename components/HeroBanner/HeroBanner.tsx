"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./HeroBanner.module.css";
import CommonButton from "../CommonButton/CommonButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlideData {
  title: string;
  subtitle: string;
  verse: string;
  accent: string;
}

interface ParticleData {
  left: string;
  bottom: string;
  animDelay: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BANNER_IMAGES: string[] = [
  "/images/banner-1.webp",
  "/images/banner-2.webp",
  "/images/banner-3.webp",
  "/images/banner-4.webp",
];

const SLIDE_DATA: SlideData[] = [
  {
    title: "Shree Ravirandaldham",
    subtitle: "Randaldhma Mandir, Dadva",
    verse: "॥ श्री राम जय राम जय जय राम ॥",
    accent: "#FF8C00",
  },
  {
    title: "Pavitra Dham",
    subtitle: "A Sacred Abode of Peace & Devotion",
    verse: "॥ हरि ओम तत्सत् ॥",
    accent: "#FF6B00",
  },
  {
    title: "Upasna & Aradhana",
    subtitle: "Embrace the Divine Light Within",
    verse: "॥ ओम नमः शिवाय ॥",
    accent: "#E8A000",
  },
  {
    title: "Darshan & Seva",
    subtitle: "Come, Seek Blessings & Tranquility",
    verse: "॥ जय श्री राम ॥",
    accent: "#FF5500",
  },
];

const AUTO_PLAY_INTERVAL = 7000;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MandalaRingProps {
  size?: number;
  opacity?: number;
  className?: string;
}

const MandalaRing: React.FC<MandalaRingProps> = ({
  size = 400,
  opacity = 0.08,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    className={className}
    style={{ opacity }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="200" cy="200" r="196" stroke="#F5A623" strokeWidth="1.5" />
    <circle cx="200" cy="200" r="176" stroke="#F5A623" strokeWidth="0.8" />
    <circle cx="200" cy="200" r="156" stroke="#F5A623" strokeWidth="1" />

    {Array.from({ length: 24 }, (_, i) => {
      const angle = (i * 360) / 24;
      const rad = (angle * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={200 + 156 * Math.cos(rad)}
          y1={200 + 156 * Math.sin(rad)}
          x2={200 + 196 * Math.cos(rad)}
          y2={200 + 196 * Math.sin(rad)}
          stroke="#F5A623"
          strokeWidth="0.6"
        />
      );
    })}

    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 360) / 12;
      const rad = (angle * Math.PI) / 180;
      const x = 200 + 176 * Math.cos(rad);
      const y = 200 + 176 * Math.sin(rad);
      return (
        <g key={i} transform={`rotate(${angle}, ${x}, ${y})`}>
          <polygon
            points={`${x},${y - 6} ${x + 4},${y + 4} ${x - 4},${y + 4}`}
            fill="#F5A623"
            opacity="0.9"
          />
        </g>
      );
    })}

    <circle cx="200" cy="200" r="30" stroke="#F5A623" strokeWidth="1" />
    <circle cx="200" cy="200" r="16" stroke="#F5A623" strokeWidth="0.8" />

    {Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 360) / 8;
      const rad = (angle * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={200 + 16 * Math.cos(rad)}
          y1={200 + 16 * Math.sin(rad)}
          x2={200 + 30 * Math.cos(rad)}
          y2={200 + 30 * Math.sin(rad)}
          stroke="#F5A623"
          strokeWidth="0.8"
        />
      );
    })}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

interface DivaParticleProps {
  particle: ParticleData;
  index: number;
}

const DivaParticle: React.FC<DivaParticleProps> = ({ particle, index }) => (
  <>
    {/* Flame */}
    <div
      className={styles.particle}
      style={{
        left: particle.left,
        bottom: particle.bottom,
        animationDelay: particle.animDelay,
      }}
    >
      <div className={styles.particleFlame} />
    </div>

    {/* Floating dot */}
    <div
      className={styles.particle}
      style={{
        left: particle.left,
        bottom: `calc(${particle.bottom} + 12px)`,
        animationDelay: `${parseFloat(particle.animDelay) + 0.2}s`,
        animationDuration: `${3 + (index % 3)}s`,
      }}
    >
      <div className={styles.particleDot} />
    </div>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────

const CornerOrnament: React.FC = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
  >
    <path d="M4 76 L4 4 L76 4" stroke="#F5A623" strokeWidth="2" fill="none" />
    <path d="M4 16 L16 4" stroke="#F5A623" strokeWidth="1" />
    <path d="M4 28 L28 4" stroke="#F5A623" strokeWidth="0.8" opacity="0.5" />
    <circle cx="4" cy="4" r="4" fill="#F5A623" />
    <circle cx="4" cy="4" r="2" fill="#FFD700" />
    <path
      d="M4 40 Q20 40 20 4"
      stroke="#F5A623"
      strokeWidth="0.6"
      opacity="0.4"
      fill="none"
    />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the CSS module class for visible vs hidden text transition state */
function textClass(visible: boolean, ...extra: string[]): string {
  return [visible ? styles.textVisible : styles.textHidden, ...extra]
    .filter(Boolean)
    .join(" ");
}

// ─── Main Component ───────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  const particles: ParticleData[] = Array.from({ length: 12 }, (_, i) => ({
    left: `${5 + i * 8}%`,
    bottom: `${10 + Math.sin(i) * 15}%`,
    animDelay: `${i * 0.3}s`,
  }));

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setTextVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setTimeout(() => {
          setTextVisible(true);
          setAnimating(false);
        }, 200);
      }, 500);
    },
    [animating]
  );

  const nextSlide = useCallback(
    () => goTo((current + 1) % BANNER_IMAGES.length),
    [current, goTo]
  );

  const prevSlide = useCallback(
    () => goTo((current - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDE_DATA[current];

  return (
    <section className={styles.section} aria-label="Hero banner">
      {/* ── IMAGE SLIDES ── */}
      {BANNER_IMAGES.map((img, i) => (
        <div
          key={img}
          className={`${styles.slide} ${i === current ? styles["slide--active"] : styles["slide--inactive"]}`}
        >
          <div
            className={`${styles.slideImage} ${i === current ? styles["slideImage--kenBurns"] : ""}`}
            style={{ backgroundImage: `url(${img})` }}
            role="img"
            aria-label={`Banner slide ${i + 1}`}
          />
        </div>
      ))}

      {/* ── OVERLAYS ── */}
      <div className={`${styles.overlay} ${styles["overlay--dark"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--vignette"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--topGlow"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--bottomGradient"]}`} aria-hidden="true" />

      {/* ── SPINNING MANDALAS ── */}
      <div className={`${styles.mandala} ${styles["mandala--left"]}`}>
        <MandalaRing size={380} opacity={0.12} />
      </div>
      <div className={`${styles.mandala} ${styles["mandala--right"]}`}>
        <MandalaRing size={380} opacity={0.12} />
      </div>
      <div className={`${styles.mandala} ${styles["mandala--center"]}`}>
        <MandalaRing size={600} opacity={0.04} />
      </div>

      {/* ── DIYA PARTICLES ── */}
      {particles.map((p, i) => (
        <DivaParticle key={i} particle={p} index={i} />
      ))}

      {/* ── CORNER ORNAMENTS ── */}
      <div className={`${styles.corner} ${styles["corner--tl"]}`}><CornerOrnament /></div>
      <div className={`${styles.corner} ${styles["corner--tr"]}`}><CornerOrnament /></div>
      <div className={`${styles.corner} ${styles["corner--bl"]}`}><CornerOrnament /></div>
      <div className={`${styles.corner} ${styles["corner--br"]}`}><CornerOrnament /></div>

      {/* ── BORDER BANDS ── */}
      <div className={`${styles.borderBand} ${styles["borderBand--top"]}`} aria-hidden="true" />
      <div className={`${styles.borderBand} ${styles["borderBand--bottom"]}`} aria-hidden="true" />
      <div className={styles.borderBandThin} aria-hidden="true" />

      {/* ── TEXT CONTENT ── */}
      <div className={styles.content}>
        {/* Sanskrit verse */}
        <p className={textClass(textVisible, styles.verse)}>
          {slide.verse}
        </p>

        {/* OM */}
        <div className={textClass(textVisible, styles.om)} aria-label="Om">
          ॐ
        </div>

        {/* Divider */}
        <div className={textClass(textVisible, styles.divider)} aria-hidden="true">
          <div className={`${styles.dividerLine} ${styles["dividerLine--left"]}`} />
          <div className={styles.dividerDiamond} />
          <div className={`${styles.dividerLine} ${styles["dividerLine--right"]}`} />
        </div>

        {/* Main heading */}
        <h1 className={textClass(textVisible, styles.title)}>
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p className={textClass(textVisible, styles.subtitle)}>
          {slide.subtitle}
        </p>

        {/* CTA buttons */}
        <div className={textClass(textVisible, styles.ctaGroup)}>
          <CommonButton text="Darshan Timings" variant="primary" />
          <CommonButton text="Explore Dham" variant="outline" />
        </div>
      </div>

      {/* ── PREV / NEXT ARROWS ── */}
      <button
        type="button"
        onClick={prevSlide}
        disabled={animating}
        className={`${styles.navBtn} ${styles["navBtn--prev"]}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className={styles.navIcon} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        disabled={animating}
        className={`${styles.navBtn} ${styles["navBtn--next"]}`}
        aria-label="Next slide"
      >
        <ChevronRight className={styles.navIcon} aria-hidden="true" />
      </button>

      {/* ── DOTS / COUNTER ── */}
      <div className={styles.dotsBar} role="tablist" aria-label="Slide navigation">
        <span className={`${styles.slideCounter} ${styles["slideCounter--current"]}`} aria-hidden="true">
          {String(current + 1).padStart(2, "0")}
        </span>

        {BANNER_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`${styles.dot} ${i === current ? styles["dot--active"] : styles["dot--inactive"]}`}
          />
        ))}

        <span className={`${styles.slideCounter} ${styles["slideCounter--total"]}`} aria-hidden="true">
          {String(BANNER_IMAGES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default HeroBanner;