"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./DailyDarshan.module.css";
import LotusDivider from "../LotusDivider/LotusDivider";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";
import CommonButton from "../CommonButton/CommonButton";

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
      <PageBackgroundDecorations />
      <div className={styles.container}>

        {/* Section header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles.hidden}`}>
          <div className={styles.tag}>
            <span className={styles.tagEmoji} aria-hidden="true">🪷</span>
            <span className={styles.tagText}>ભગવાનનાં દરરોજ દર્શન</span>
          </div>
          <CommonTitle text="ડેઈલી દર્શન" />
          <LotusDivider />
        </div>

        {/* Darshan card */}
        <div className={`${styles.cardWrap} ${visible ? styles["card--visible"] : styles.hidden}`}>

          {/* Date badge */}
          <div className={styles.dateBadgeWrap}>
            <CommonBadge text="TUESDAY — 17-02-2026" />
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
              <CommonButton text="READ MORE" variant="primary" icon={true} className="w-full mb-4" />
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