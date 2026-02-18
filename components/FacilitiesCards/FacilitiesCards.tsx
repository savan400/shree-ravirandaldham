"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./FacilitiesCards.module.css";
import FacilityCard, { FacilityCardData } from "./Facilitycard";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";

// ─── Constants ────────────────────────────────────────────────────────────────

const FACILITIES: FacilityCardData[] = [
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

// ─── Diamond Divider ──────────────────────────────────────────────────────────

const DiamondDivider: React.FC = () => (
  <div className={styles.diamondDivider} aria-hidden="true">
    <div className={styles["diamondDividerLine--left"]} />
    <div className={styles.diamondSm} />
    <div className={styles.diamondLg} />
    <div className={styles.diamondSm} />
    <div className={styles["diamondDividerLine--right"]} />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FacilitiesCards: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
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
      <PageBackgroundDecorations />
      <div className={styles.container}>
        {/* Header */}
        <div
          className={`${styles.header} ${visible ? styles["header--visible"] : styles["header--hidden"]
            }`}
        >
          <CommonBadge text="॥ ભક્તો માટે સેવા ॥" />
          <CommonTitle text=" સુવિધાઓ" />
        </div>

        <DiamondDivider />

        {/* Cards grid — now using the common FacilityCard component */}
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