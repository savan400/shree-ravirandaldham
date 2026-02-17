"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./DailyDarshan.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DarshanDateBadgeProps {
  date: string;
  day: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DARSHAN_DATE = "17-02-2026";
const DARSHAN_DAY = "TUESDAY";
const DARSHAN_IMG =
  "/images/salangpurhanumanji.jpg";

// ─── Sub-components ───────────────────────────────────────────────────────────

const ArchFrame: React.FC = () => (
  <svg
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.archFrame}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M12 320 L12 120 Q12 12 200 12 Q388 12 388 120 L388 320"
      stroke="url(#arch-gold)" strokeWidth="3" fill="none" opacity="0.85"
    />
    <path
      d="M28 320 L28 125 Q28 30 200 30 Q372 30 372 125 L372 320"
      stroke="url(#arch-gold)" strokeWidth="1" fill="none" opacity="0.4"
    />
    <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" fill="#FFD700" opacity="0.9" />
    <rect x="382" y="6" width="12" height="12" transform="rotate(45 388 12)" fill="#FFD700" opacity="0.9" />
    <circle cx="200" cy="14" r="5" fill="#FFD700" opacity="0.9" />
    <circle cx="200" cy="14" r="3" fill="#FFF" opacity="0.5" />

    {[0.3, 0.5, 0.7].map((t, i) => (
      <g key={i}>
        <line x1="12" y1={120 + t * 200} x2="26" y2={120 + t * 200} stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
        <line x1="374" y1={120 + t * 200} x2="388" y2={120 + t * 200} stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
      </g>
    ))}

    <defs>
      <linearGradient id="arch-gold" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FF6B00" />
        <stop offset="0.35" stopColor="#FFD700" />
        <stop offset="0.65" stopColor="#FF8C00" />
        <stop offset="1" stopColor="#FF6B00" />
      </linearGradient>
    </defs>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const LotusDivider: React.FC = () => (
  <div className={styles.lotusDivider} aria-hidden="true">
    <div className={styles["lotusDividerLine--left"]} />
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
      <ellipse cx="12" cy="14" rx="2.5" ry="5" fill="url(#lf1)" />
      <ellipse cx="7" cy="13" rx="2" ry="4" transform="rotate(-25 7 13)" fill="url(#lf2)" opacity="0.8" />
      <ellipse cx="17" cy="13" rx="2" ry="4" transform="rotate(25 17 13)" fill="url(#lf2)" opacity="0.8" />
      <ellipse cx="3" cy="12" rx="1.5" ry="3" transform="rotate(-45 3 12)" fill="url(#lf3)" opacity="0.6" />
      <ellipse cx="21" cy="12" rx="1.5" ry="3" transform="rotate(45 21 12)" fill="url(#lf3)" opacity="0.6" />
      <defs>
        <linearGradient id="lf1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFD700" /><stop offset="1" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient id="lf2" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFB700" /><stop offset="1" stopColor="#FF6B00" />
        </linearGradient>
        <linearGradient id="lf3" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFA500" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FF4500" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
    <div className={styles["lotusDividerLine--right"]} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const DarshanDateBadge: React.FC<DarshanDateBadgeProps> = ({ date, day }) => (
  <div className={styles.dateBadge}>
    <div className={styles.dateBadgeDot} aria-hidden="true" />
    <span className={styles.dateBadgeText}>{day} — {date}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DailyDarshan: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
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
      id="dev-darshan"
      className={styles.section}
      aria-labelledby="dd-title"
    >
      {/* ── Background decorations ── */}
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.watermark} aria-hidden="true">ॐ</div>
      <div className={styles.borderBand} aria-hidden="true" />

      <div className={styles.container}>

        {/* Section header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles.hidden}`}>
          <div className={styles.tag}>
            <span className={styles.tagEmoji} aria-hidden="true">🪷</span>
            <span className={styles.tagText}>ભગવાનનાં દરરોજ દર્શન</span>
          </div>

          <h2 id="dd-title" className={styles.title}>
            ડેઈલી દર્શન
          </h2>

          <LotusDivider />
        </div>

        {/* Darshan card */}
        <div className={`${styles.cardWrap} ${visible ? styles["card--visible"] : styles.hidden}`}>

          {/* Date badge */}
          <div className={styles.dateBadgeWrap}>
            <DarshanDateBadge date={DARSHAN_DATE} day={DARSHAN_DAY} />
          </div>

          {/* Card */}
          <div
            className={styles.card}
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
          >
            <ArchFrame />

            {/* Glow halo */}
            <div className={styles.glowHalo} aria-hidden="true" />

            {/* Shine sweep */}
            <div className={styles.shineSweepWrap} aria-hidden="true">
              <div className={`${styles.shineSweep} ${imgHovered ? styles["shineSweep--active"] : ""}`} />
            </div>

            {/* Darshan image */}
            <Image
              src={DARSHAN_IMG}
              alt={`Daily Darshan ${DARSHAN_DATE} ${DARSHAN_DAY}`}
              width={520}
              height={390}
              className={`${styles.darshanImage} ${imgHovered ? styles["darshanImage--hovered"] : styles["darshanImage--idle"]}`}
              priority
            />

            {/* Bottom overlay */}
            <div className={styles.cardOverlay}>
              <p className={styles.cardDate}>
                Daily Darshan — {DARSHAN_DATE} ({DARSHAN_DAY})
              </p>
              <Link href="#" className={styles.readMoreBtn}>
                READ MORE
                <ChevronRight className={styles.readMoreIcon} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* View all */}
          <div className={styles.viewAllWrap}>
            <Link href="#" className={styles.viewAllLink}>
              VIEW ALL DARSHAN
              <ChevronRight className={styles.viewAllIcon} aria-hidden="true" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DailyDarshan;