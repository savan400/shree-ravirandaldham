"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./KashtabhanjanDev.module.css";
import CommonButton from "../CommonButton/CommonButton";

// ─── Types ────────────────────────────────────────────────────────────────────

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface ParticleData {
  top: string;
  left: string;
  animDelay: string;
  animDuration: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLES: ParticleData[] = [
  { top: "15%", left: "8%", animDelay: "0s", animDuration: "4s" },
  { top: "70%", left: "12%", animDelay: "1s", animDuration: "5s" },
  { top: "40%", left: "5%", animDelay: "2s", animDuration: "3.5s" },
  { top: "25%", left: "20%", animDelay: "0.5s", animDuration: "4.5s" },
  { top: "80%", left: "30%", animDelay: "1.5s", animDuration: "6s" },
  { top: "55%", left: "15%", animDelay: "3s", animDuration: "4s" },
];

const CORNER_CLASSES: Record<CornerPosition, string> = {
  "top-left": styles["corner--tl"],
  "top-right": styles["corner--tr"],
  "bottom-left": styles["corner--bl"],
  "bottom-right": styles["corner--br"],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CornerGlowProps {
  position: CornerPosition;
}

const CornerGlow: React.FC<CornerGlowProps> = ({ position }) => (
  <svg
    width="90"
    height="90"
    viewBox="0 0 90 90"
    fill="none"
    className={`${styles.corner} ${CORNER_CLASSES[position]}`}
    aria-hidden="true"
  >
    <path d="M5 85 L5 5 L85 5" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M5 5 L20 5 M5 5 L5 20" stroke="#FF8C00" strokeWidth="1" opacity="0.8" />
    <circle cx="5" cy="5" r="4" fill="#FFD700" opacity="0.9" />
    <circle cx="5" cy="5" r="2" fill="#FFF" opacity="0.6" />
    <path d="M5 30 Q22 30 22 5" stroke="#F5A623" strokeWidth="0.6" fill="none" opacity="0.3" />
    <path d="M5 45 Q35 45 35 5" stroke="#F5A623" strokeWidth="0.4" fill="none" opacity="0.2" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const GoldRule: React.FC = () => (
  <div className={styles.goldRule} aria-hidden="true">
    <div className={styles["goldRuleLine--left"]} />
    <div className={styles.goldRuleDiamondLg} />
    <div className={styles.goldRuleDiamondSm} />
    <div className={styles.goldRuleDiamondLg} />
    <div className={styles["goldRuleLine--right"]} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

interface FloatingParticleProps {
  particle: ParticleData;
}

const FloatingParticle: React.FC<FloatingParticleProps> = ({ particle }) => (
  <div
    className={styles.particle}
    style={{
      top: particle.top,
      left: particle.left,
      // CSS custom properties drive the animation timing via the .particle rule
      ["--dur" as string]: particle.animDuration,
      ["--delay" as string]: particle.animDelay,
    }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────

const KashtabhanjanDev: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Intersection observer — trigger entry animations once
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Passive scroll listener for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // JS-driven parallax offset — only the translateY value stays inline
  // because it must be computed at runtime from scroll position
  const bgOffset = sectionRef.current
    ? (scrollY - (sectionRef.current as HTMLElement).offsetTop) * 0.3
    : 0;

  return (
    <section
      ref={sectionRef}
      id="kashtabhanjan-dev"
      className={styles.section}
      aria-labelledby="kd-title"
    >
      {/* ── Parallax background (translateY is intentionally inline — runtime value) ── */}
      <div
        className={styles.bgImage}
        style={{ transform: `translateY(${bgOffset}px)` }}
        role="img"
        aria-label="Kashtabhanjan Dev temple background"
      />

      {/* ── Overlay stack ── */}
      <div className={`${styles.overlay} ${styles["overlay--horizontal"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--vertical"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--amberGlow"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--vignette"]}`} aria-hidden="true" />
      <div className={`${styles.overlay} ${styles["overlay--noise"]}`} aria-hidden="true" />

      {/* ── Corner ornaments ── */}
      <CornerGlow position="top-left" />
      <CornerGlow position="top-right" />
      <CornerGlow position="bottom-left" />
      <CornerGlow position="bottom-right" />

      {/* ── Border bands ── */}
      <div className={`${styles.borderBand} ${styles["borderBand--top"]}`} aria-hidden="true" />
      <div className={`${styles.borderBand} ${styles["borderBand--bottom"]}`} aria-hidden="true" />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <FloatingParticle key={i} particle={p} />
      ))}

      {/* ── Main content ── */}
      <div className={styles.contentWrap}>
        <div className={styles.contentInner}>

          {/* Badge */}
          <div className={`${styles.badge} ${visible ? styles["badge--visible"] : styles.hidden}`}>
            <div className={styles.badgeDot} aria-hidden="true" />
            <span className={styles.badgeText}>॥ જય હનુમાન ॥</span>
            <div className={styles.badgeDot} aria-hidden="true" />
          </div>

          {/* Heading */}
          <h2
            id="kd-title"
            className={`${styles.title} ${visible ? styles["title--visible"] : styles.hidden}`}
          >
            શ્રી કષ્ટભંજન દેવ
          </h2>

          {/* Gold rule */}
          <div className={visible ? styles["rule--visible"] : styles.hidden}>
            <GoldRule />
          </div>

          {/* Body paragraph */}
          <p className={`${styles.para} ${visible ? styles["para--visible"] : styles.hidden}`}>
            શ્રી કષ્ટભંજનદેવની શરણમાં આવેલો જીવ ક્યારેય ખાલી હાથે પાછો ગયો
            નથી. તેમની મનોકામના સદૈવ પૂર્ણ થઈ છે. દાદાનાં દર્શન, સાધના અને
            સેવાથી એવા એક નહીં પણ અસંખ્ય માનવીઓ અને પરિવારોએ શાંતિ, સુરક્ષા
            અને સુખ મેળવ્યાં છે. દેશ-વિદેશની અગણિત પેઢીઓ હનુમાનજીનાં
            આશીર્વાદ થકી સમૃદ્ધ થઈ છે.
          </p>

          {/* CTA */}
          <div className={visible ? styles["cta--visible"] : styles.hidden}>
            <CommonButton text="READ MORE" variant="primary" icon={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KashtabhanjanDev;