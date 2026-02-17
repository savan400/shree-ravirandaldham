"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import styles from "./FacilitiesCards.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FacilityData {
  image: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
  accentColor: string;
}

interface FacilityCardProps {
  facility: FacilityData;
  index: number;
  visible: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FACILITIES: FacilityData[] = [
  {
    image: "/images/bhojanalay.webp",
    title: "શ્રી કષ્ટભંજનદેવ ભોજનાલય",
    description:
      "7 વીઘા જેટલી વિશાળ જમીન પર 3,25,00 સ્ક્વેર ફીટ બાંધકામ ધરાવતું ગુજરાતનું સૌથી મોટું ભોજનાલય સાળંગપુરધામમાં આવેલું શ્રી કષ્ટભંજનદેવ ભોજનાલય છે.",
    icon: "🍽️",
    tag: "ભોજન સેવા",
    accentColor: "#FF6B00",
  },
  {
    image: "/images/yatrik-bhuvan.webp",
    title: "શ્રી ગોપાળાનંદ સ્વામી યાત્રિક ભુવન",
    description:
      "મંદિર પરિસરમાં જ 20 વીઘાની વિશાળતમ જગ્યા પર 8,85,000 સ્ક્વેર ફૂટમાં નિર્માણાધીન શ્રી ગોપાળાનંદ સ્વામી યાત્રિક ભવન ભારતનું સૌથી મોટું યાત્રિક ભવન બની રહેશે.",
    icon: "🏛️",
    tag: "આવાસ સેવા",
    accentColor: "#E8A000",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const DiamondDivider: React.FC = () => (
  <div className={styles.diamondDivider} aria-hidden="true">
    <div className={styles["diamondDividerLine--left"]} />
    <div className={styles.diamondSm} />
    <div className={styles.diamondLg} />
    <div className={styles.diamondSm} />
    <div className={styles["diamondDividerLine--right"]} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

interface CardArchProps {
  color?: string;
}

const CardArch: React.FC<CardArchProps> = ({ color = "#FFD700" }) => {
  const gradId = `cag-${color.replace("#", "")}`;
  return (
    <svg
      viewBox="0 0 400 60"
      fill="none"
      className={styles.cardArch}
      aria-hidden="true"
    >
      <path
        d="M0 60 L0 30 Q200 -20 400 30 L400 60"
        fill={`url(#${gradId})`}
        opacity="0.15"
      />
      <path d="M0 4 Q200 -18 400 4" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
      <circle cx="200" cy="-2" r="4" fill={color} opacity="0.8" />
      <circle cx="0" cy="4" r="4" fill={color} opacity="0.6" />
      <circle cx="400" cy="4" r="4" fill={color} opacity="0.6" />
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const FacilityCard: React.FC<FacilityCardProps> = ({ facility, index, visible }) => {
  // Per-card stagger delay — must stay inline (runtime index-derived value)
  const staggerDelay = `${0.2 + index * 0.18}s`;

  return (
    <div
      className={styles.card}
      style={
        visible
          ? {
            opacity: 1,
            transform: "none",
            // Override the base transition delay per card
            transitionDelay: staggerDelay,
          }
          : { transitionDelay: staggerDelay }
      }
    >
      {/* Top arch ornament */}
      <CardArch color={facility.accentColor} />

      {/* Background image */}
      <Image
        src={facility.image}
        alt={facility.title}
        fill
        className={styles.cardImage}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay — hover handled via CSS */}
      <div className={styles.cardGradient} aria-hidden="true" />

      {/* Accent glow — color is dynamic per card, must be inline */}
      <div
        className={styles.cardAccentGlow}
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${facility.accentColor}22, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Corner ornament */}
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        className={styles.cornerOrnament}
        aria-hidden="true"
      >
        <path d="M48 2 L48 48 L2 48" stroke="#FFD700" strokeWidth="1.5" fill="none" />
        <circle cx="48" cy="2" r="3" fill="#FFD700" />
      </svg>

      {/* Content */}
      <div className={styles.cardContent}>
        {/* Tag badge — bg/border are dynamic per card */}
        <div
          className={styles.cardTag}
          style={{
            background: `linear-gradient(135deg, ${facility.accentColor}33, ${facility.accentColor}18)`,
            border: `1px solid ${facility.accentColor}55`,
          }}
        >
          <span className={styles.cardTagEmoji} aria-hidden="true">{facility.icon}</span>
          <span className={styles.cardTagText}>{facility.tag}</span>
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>{facility.title}</h3>

        {/* Expanding divider line — color is dynamic per card */}
        <div
          className={styles.cardDivider}
          style={{ background: `linear-gradient(to right, ${facility.accentColor}80, transparent)` }}
          aria-hidden="true"
        />

        {/* Description */}
        <p className={styles.cardDescription}>{facility.description}</p>

        {/* View details row — color is dynamic per card */}
        <div className={styles.cardViewDetails}>
          <span
            className={styles.cardViewDetailsText}
            style={{ color: facility.accentColor }}
          >
            VIEW DETAILS
          </span>
          <div
            className={styles.cardViewDetailsLine}
            style={{ background: facility.accentColor }}
            aria-hidden="true"
          />
          <div
            className={styles.cardViewDetailsDot}
            style={{ background: facility.accentColor }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FacilitiesCards: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="fc-title"
    >
      {/* ── Background decorations ── */}
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.watermark} aria-hidden="true">ॐ</div>
      <div className={styles.borderBand} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles["header--hidden"]}`}>
          <div className={styles.headerTag}>
            <span className={styles.headerTagText}>॥ ભક્તો માટે સેવા ॥</span>
          </div>
          <h2 id="fc-title" className={styles.title}>
            સુવિધાઓ
          </h2>
        </div>

        <DiamondDivider />

        {/* Cards grid */}
        <div className={styles.cardsGrid}>
          {FACILITIES.map((facility, i) => (
            <FacilityCard
              key={facility.title}
              facility={facility}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesCards;