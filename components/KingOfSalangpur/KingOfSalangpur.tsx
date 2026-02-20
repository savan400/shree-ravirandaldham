"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import styles from "./KingOfSalangpur.module.css";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";
import CommonButton from "../CommonButton/CommonButton";
import { useInView } from "@/hooks/useInView";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineDir = "left" | "right";

interface AnnotationData {
  label: string;
  value: string;
  top: string;
  left: string;
  lineDir: LineDir;
}

interface StatBadgeData {
  number: string;
  label: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────


const STATS: StatBadgeData[] = [
  { number: "54ft", label: "કુલ ઊંચાઈ" },
  { number: "1851", label: "નિર્માણ વર્ષ" },
  { number: "∞", label: "ભક્તોનો સ્નેહ" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const DiamondRule: React.FC = () => (
  <div className={styles.diamondRule} aria-hidden="true">
    <div className={styles["diamondRuleLine--left"]} />
    <div className={styles.diamondLg} />
    <div className={styles.diamondSm} />
    <div className={styles.diamondLg} />
    <div className={styles["diamondRuleLine--right"]} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

interface AnnotationPinProps {
  annotation: AnnotationData;
  visible: boolean;
  index: number;
}

const AnnotationPin: React.FC<AnnotationPinProps> = ({ annotation, visible, index }) => {
  const isLeft = annotation.lineDir === "left";
  const transitionDelay = `${0.2 + index * 0.08}s`;

  return (
    <div
      className={styles.pin}
      style={{
        top: annotation.top,
        left: annotation.left,
        // Per-pin staggered transition — delay must be runtime-computed
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateX(${isLeft ? "-20px" : "20px"})`,
        transition: `opacity 0.5s ease ${transitionDelay}, transform 0.5s ease ${transitionDelay}`,
      }}
    >
      <div className={`${styles.pinInner} ${isLeft ? styles["pinInner--left"] : styles["pinInner--right"]}`}>
        {/* Text bubble */}
        <div className={`${styles.pinBubble} ${isLeft ? styles["pinBubble--left"] : styles["pinBubble--right"]}`}>
          <p className={styles.pinLabel}>{annotation.label}</p>
          <p className={styles.pinValue}>{annotation.value}</p>
        </div>

        {/* Connector line + dot */}
        <div className={styles.pinConnector}>
          <div className={isLeft ? styles["pinLine--left"] : styles["pinLine--right"]} />
          <div className={styles.pinDot} />
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

interface StatBadgeProps {
  stat: StatBadgeData;
  visible: boolean;
  delay: number;
}

const StatBadge: React.FC<StatBadgeProps> = ({ stat, visible, delay }) => (
  <div
    className={styles.statBadge}
    style={{
      // Per-badge staggered transition — delay must be runtime-computed
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(16px)",
      transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
    }}
  >
    <div className={styles.statNumber}>{stat.number}</div>
    <div className={styles.statLabel}>{stat.label}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const KingOfSalangpur: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  return (
    <section
      ref={sectionRef}
      id="king-of-salangpur"
      className={styles.section}
      aria-labelledby="ks-title"
    >
      <PageBackgroundDecorations />
      <div className={styles.container}>
        <div className={styles.grid}>

          {/* ── LEFT: Statue with annotation pins ── */}
          <div className={`${styles.statueCol} ${visible ? styles["leftCol--visible"] : styles.hidden}`}>
            {/* Radial glow behind statue */}
            <div className={styles.statueGlow} aria-hidden="true" />

            {/* Spinning decorative ring */}
            <div className={styles.statueRingWrap} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" className={styles.statueRing}>
                <circle cx="100" cy="100" r="95" stroke="#FF8C00" strokeWidth="1" strokeDasharray="6 4" />
                <circle cx="100" cy="100" r="80" stroke="#FFD700" strokeWidth="0.5" />
                {Array.from({ length: 16 }, (_, i) => {
                  const a = (i * 360 / 16) * Math.PI / 180;
                  return (
                    <line
                      key={i}
                      x1={100 + 80 * Math.cos(a)}
                      y1={100 + 80 * Math.sin(a)}
                      x2={100 + 95 * Math.cos(a)}
                      y2={100 + 95 * Math.sin(a)}
                      stroke="#FF8C00"
                      strokeWidth="0.8"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Statue image */}
            <Image
              src="/images/king-of-salangpur.webp"
              alt="King of Salangpur — Shree Hanumanji Maharaj, 54-foot statue"
              width={400}
              height={560}
              className={styles.statueImage}
            />

          </div>

          {/* ── RIGHT: Text content ── */}
          <div className={`${styles.textCol} ${visible ? styles["rightCol--visible"] : styles.hidden}`}>

            <CommonBadge text="ગુજરાતની ગૌરવ" />

            {/* Heading */}
            <CommonTitle text="કિંગ ઓફ સાળંગપુર" />
            <DiamondRule />

            {/* Description */}
            <p className={styles.description}>
              ગુજરાતમાં પંચધાતુમાં નિર્મિત શ્રી હનુમાનજી મહારાજની સૌથી ઉંચી
              પ્રતિમા 'કિંગ ઓફ સાળંગપુર' ભક્તિ, સેવા અને કળાનાં દિવ્યતા અને
              ભવ્યતાનાં સંગમ સમાન છે. માત્ર સ્વામિનારાયણ સંપ્રદાય જ નહીં પરંતુ
              ગુજરાત અને સનાતન ધર્મનાં ગૌરવ સમાન આ પ્રતિમા સાળંગપુરધામમાં
              સૌને દર્શન આપે છે.
            </p>

            {/* Stats */}
            <div className={styles.statsRow}>
              {STATS.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <StatBadge

                    stat={stat}
                    visible={visible}
                    delay={0.6 + i * 0.1}
                  />
                  {i < STATS.length - 1 && (
                    <div key={`div-${i}`} className={styles.statsDivider} aria-hidden="true" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <CommonButton text="READ MORE" variant="primary" icon={true} />

          </div>
        </div>
      </div>
    </section>
  );
};

export default KingOfSalangpur;