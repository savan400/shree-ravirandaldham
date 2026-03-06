"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./FacilitiesCards.module.css";
import FacilityCard, { FacilityCardData } from "./Facilitycard";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";
import { useInView } from "@/hooks/useInView";

// ─── Constants ────────────────────────────────────────────────────────────────

const FACILITIES: FacilityCardData[] = [
  {
    image: "/images/bhojanalay.webp",
    title: "facility_1_title",
    description: "facility_1_desc",
    icon: "🍽️",
    tag: "facility_1_tag",
    accentColor: "#FF6B00",
    navigateTo: "/facilities/bhojan-shala",
  },
  {
    image: "/images/yatrik-bhuvan.webp",
    title: "facility_2_title",
    description: "facility_2_desc",
    icon: "🏛️",
    tag: "facility_2_tag",
    accentColor: "#E8A000",
    navigateTo: "/facilities/atithi-gruh",
  },
  {
    image: "/images/bhojanalay.webp",
    title: "facility_3_title",
    description: "facility_1_desc",
    icon: "🍽️",
    tag: "facility_1_tag",
    accentColor: "#FF6B00",
    navigateTo: "/facilities/bhojan-shala",
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
  const t = useTranslations("Homepage");
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

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
          <CommonBadge text={t("facilities_badge")} />
          <CommonTitle text={t("facilities_title")} />
        </div>

        <DiamondDivider />

        {/* Cards grid — now using the common FacilityCard component */}
        <div className={styles.cardsGrid}>
          {FACILITIES.map((facility, i) => (
            <FacilityCard
              key={facility.title}
              facility={{
                ...facility,
                title: t(facility.title as any),
                description: t(facility.description as any),
                tag: t(facility.tag as any)
              }}
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
