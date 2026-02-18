"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./StatsSection.module.css";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";

// ─── Types ────────────────────────────────────────────────────────────────────

type IconKey = "height" | "floors" | "rooms" | "sqft" | "people";

interface StatData {
  iconKey: IconKey;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  featured?: boolean;
}

interface StatCardProps {
  stat: StatData;
  inView: boolean;
  index: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATS: StatData[] = [
  { iconKey: "height", value: 103, suffix: "", label: "ફૂટ ઉંચું", sublabel: "Height" },
  { iconKey: "floors", value: 11, suffix: "", label: "માળ", sublabel: "Floors" },
  { iconKey: "rooms", value: 1050, suffix: "", label: "રૂમો", sublabel: "Rooms", featured: true },
  { iconKey: "sqft", value: 885000, suffix: "", label: "સ્ક્વેર ફૂટ", sublabel: "Under Construction" },
  { iconKey: "people", value: 4000, suffix: "+", label: "લોકો", sublabel: "Capacity" },
];

// ─── Custom Hook ──────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, start: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | undefined;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(easeOut(progress) * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const StatIcons: Record<IconKey, React.ReactNode> = {
  height: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="12" y="2" width="8" height="28" rx="2" fill="url(#si1)" opacity="0.3" />
      <rect x="14" y="2" width="4" height="28" rx="1" fill="url(#si1)" />
      <path d="M8 8 L16 2 L24 8" stroke="#FFD700" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M8 24 L16 30 L24 24" stroke="#FF8C00" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="16" cy="16" r="3" fill="#FFD700" />
      <defs>
        <linearGradient id="si1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FF6B00" /><stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  ),
  floors: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x="4" y={4 + i * 5} width="24" height="4" rx="1" fill="url(#si2)" opacity={1 - i * 0.15} />
      ))}
      <rect x="13" y="22" width="6" height="8" rx="1" fill="#FFD700" opacity="0.9" />
      <defs>
        <linearGradient id="si2" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#FF6B00" /><stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  ),
  rooms: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="26" height="20" rx="2" stroke="url(#si3)" strokeWidth="1.5" fill="none" />
      <rect x="7" y="13" width="7" height="7" rx="1" fill="url(#si3)" opacity="0.7" />
      <rect x="18" y="13" width="7" height="7" rx="1" fill="url(#si3)" opacity="0.7" />
      <path d="M3 16 L29 16" stroke="#FFD700" strokeWidth="0.8" opacity="0.5" />
      <path d="M16 8 L16 28" stroke="#FF8C00" strokeWidth="0.8" opacity="0.4" />
      <path d="M8 3 L16 7 L24 3" stroke="#FFD700" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <defs>
        <linearGradient id="si3" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FF6B00" /><stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  ),
  sqft: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="26" height="26" rx="2" stroke="url(#si4)" strokeWidth="1.5" fill="none" />
      <path d="M3 3 L10 3 M3 3 L3 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M29 3 L22 3 M29 3 L29 10" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 29 L10 29 M3 29 L3 22" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" />
      <path d="M29 29 L22 29 M29 29 L29 22" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="5" stroke="#FFD700" strokeWidth="1" fill="url(#si4)" opacity="0.4" />
      <defs>
        <linearGradient id="si4" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FF6B00" /><stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  ),
  people: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="10" cy="9" r="4" fill="url(#si5)" opacity="0.8" />
      <circle cx="22" cy="9" r="4" fill="url(#si5)" opacity="0.8" />
      <circle cx="16" cy="7" r="5" fill="url(#si5)" />
      <path d="M2 26 Q2 18 10 18 Q14 18 16 20 Q18 18 22 18 Q30 18 30 26" fill="url(#si5)" opacity="0.6" />
      <path d="M5 28 Q5 21 16 21 Q27 21 27 28" fill="url(#si5)" />
      <defs>
        <linearGradient id="si5" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FF6B00" /><stop offset="1" stopColor="#FFD700" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatCount(count: number, stat: StatData): string {
  const atTarget = count >= stat.value;
  if (stat.value >= 10_000) {
    const k = (count / 1000).toFixed(atTarget ? 0 : 1);
    return `${k}K${atTarget ? stat.suffix : ""}`;
  }
  return `${count.toLocaleString()}${atTarget ? stat.suffix : ""}`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({ stat, inView, index }) => {
  const count = useCountUp(stat.value, 2200, inView);

  // Per-card stagger delay — runtime-computed from index, must stay inline
  const staggerDelay = `${0.1 + index * 0.1}s`;

  return (
    <div
      className={`${styles.card} ${stat.featured ? styles["card--featured"] : styles["card--default"]} ${!inView ? styles["card--hidden"] : ""}`}
      style={
        inView
          ? { opacity: 1, transform: "none", transitionDelay: staggerDelay }
          : { transitionDelay: staggerDelay }
      }
    >
      {/* Featured crown */}
      {stat.featured && (
        <div className={styles.crownBadge} aria-label="Key stat">
          <span className={styles.crownBadgeText}>KEY STAT</span>
        </div>
      )}

      {/* Corner accents */}
      <div
        className={`${styles.cornerTR} ${stat.featured ? styles["cornerTR--featured"] : styles["cornerTR--default"]}`}
        aria-hidden="true"
      />
      <div
        className={`${styles.cornerBL} ${stat.featured ? styles["cornerBL--featured"] : styles["cornerBL--default"]}`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className={`${styles.iconWrap} ${stat.featured ? styles["iconWrap--featured"] : styles["iconWrap--default"]}`}>
        {StatIcons[stat.iconKey]}
      </div>

      {/* Counter */}
      <div className={styles.statNumber} aria-live="polite">
        {formatCount(count, stat)}
      </div>

      {/* Labels */}
      <div className={styles.statLabel}>{stat.label}</div>
      <div className={styles.statSublabel}>{stat.sublabel}</div>

      {/* Bottom accent line */}
      <div className={styles.cardAccentLine} aria-hidden="true" />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StatsSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-labelledby="ss-title">
      <PageBackgroundDecorations />
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles["header--hidden"]}`}>
          <CommonTitle text=" શ્રી ગોપાળાનંદ સ્વામી" />
          <p className={`${styles.subtitle} ${visible ? styles["subtitle--visible"] : styles["subtitle--hidden"]}`}>
            નૂતન યાત્રિક ભુવનની વિશેષતાઓ
          </p>

          <div className={styles.divider} aria-hidden="true">
            <div className={styles["dividerLine--left"]} />
            <div className={styles.dividerDiamondSm} />
            <div className={styles.dividerDiamondLg} />
            <div className={styles.dividerDiamondSm} />
            <div className={styles["dividerLine--right"]} />
          </div>
        </div>

        {/* Stats grid — observed for counter trigger */}
        <div ref={gridRef} className={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.iconKey} stat={stat} inView={inView} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <p className={`${styles.footerNote} ${visible ? styles["footerNote--visible"] : styles["footerNote--hidden"]}`}>
          ॥ ભારતનું સૌથી મોટું યાત્રિક ભવન ॥
        </p>
      </div>
    </section>
  );
};

export default StatsSection;