"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import styles from "./HariVani.module.css";
import LotusDivider from "../LotusDivider/LotusDivider";
import { useInView } from "@/hooks/useInView";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticleData {
  size: "lg" | "sm";
  color: "gold" | "saffron";
  left: string;
  bottom: string;
  dur: string;
  delay: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLES: ParticleData[] = Array.from({ length: 10 }, (_, i) => ({
  size: i % 3 === 0 ? "lg" : "sm",
  color: i % 2 === 0 ? "gold" : "saffron",
  left: `${6 + i * 9}%`,
  bottom: `${10 + (i % 4) * 15}%`,
  dur: `${3.5 + i * 0.35}s`,
  delay: `${i * 0.25}s`,
}));

// ─── Sub-components ───────────────────────────────────────────────────────────

interface QuoteOrnamentProps {
  flip?: boolean;
}

const QuoteOrnament: React.FC<QuoteOrnamentProps> = ({ flip = false }) => (
  <svg
    width="40"
    height="32"
    viewBox="0 0 40 32"
    fill="none"
    style={{ transform: flip ? "scaleX(-1) scaleY(-1)" : "none", display: "block" }}
    aria-hidden="true"
  >
    <path d="M2 28 Q2 4 16 4 L16 14 Q8 14 8 22 L16 22 L16 28 Z" fill="url(#qg1)" opacity="0.7" />
    <path d="M22 28 Q22 4 36 4 L36 14 Q28 14 28 22 L36 22 L36 28 Z" fill="url(#qg1)" opacity="0.7" />
    <defs>
      <linearGradient id="qg1" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FFD700" />
      </linearGradient>
    </defs>
  </svg>
);



// ─── Main Component ───────────────────────────────────────────────────────────

const HariVani: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="hv-title"
    >
      {/* ── Background decorations ── */}
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.radialGlow} aria-hidden="true" />
      <div className={styles.scanLine} aria-hidden="true" />
      <div className={styles.watermarkOm} aria-hidden="true">ॐ</div>
      <div className={styles.watermarkDanda} aria-hidden="true">॥</div>

      {/* ── Border bands ── */}
      <div className={`${styles.borderBand} ${styles["borderBand--top"]}`} aria-hidden="true" />
      <div className={`${styles.borderBand} ${styles["borderBand--bottom"]}`} aria-hidden="true" />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={`${styles.particle} ${styles[`particle--${p.color}`]} ${styles[`particle--${p.size}`]}`}
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

      {/* ── Bapu image ── */}
      <Image
        src="/images/main-bapu.png"
        alt="Dineshpuri Bapu"
        width={320}
        height={480}
        className={styles.bapuImage}
      />

      <div className={styles.container}>

        {/* Title block */}
        <div className={`${styles.titleBlock} ${visible ? styles["titleBlock--visible"] : styles.hidden}`}>
          <div className={styles.tagPill}>
            <div className={styles.tagDot} aria-hidden="true" />
            <span id="hv-title" className={styles.tagText}>
              ॥ કૈલાશ નિવાસી મહંત શ્રી દિનેશપુરીબાપુ ના ગુરુવચન ॥
            </span>
            <div className={styles.tagDot} aria-hidden="true" />
          </div>
          <LotusDivider />
        </div>

        {/* Quote block */}
        <blockquote
          className={`${styles.quoteBlock} ${visible ? styles["quoteBlock--visible"] : styles.hidden}`}
          cite="Dineshpuri Bapu"
        >
          {/* Decorative accent bar */}
          <div className={styles.quoteAccentBar} aria-hidden="true" />

          {/* Quote ornaments */}
          <div className={styles.quoteOrnamentTop}>
            <QuoteOrnament />
          </div>
          <div className={styles.quoteOrnamentBottom}>
            <QuoteOrnament flip />
          </div>

          {/* Quote text */}
          <p className={styles.quoteText}>
            ઈચ્છા પૂરી ના થાય તો ક્રોધ વધે છે,<br />
            ને ઈચ્છા પૂરી થાય તો લોભ વધે છે
          </p>

          {/* Attribution */}
          <footer className={`${styles.attribution} ${visible ? styles["attribution--visible"] : styles.hidden}`}>
            <div className={styles.attributionLine} aria-hidden="true" />
            <div className={styles.attributionDiamond} aria-hidden="true" />
            <cite className={styles.attributionText}>— પ. પૂ. દીનેશપરી બાપુ</cite>
          </footer>
        </blockquote>

      </div>
    </section>
  );
};

export default HariVani;