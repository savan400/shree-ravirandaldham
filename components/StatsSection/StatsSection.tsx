"use client";

import styles from "./StatsSection.module.css";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "../CommonTitle/CommonTitle";
import { useInView } from "@/hooks/useInView";

const CONTACT_BOXES = [
  { label: "Matajina Shangar Mate", contact: "9879276966" },
  { label: "Randal Tedva Mate", contact: "9879276966" },
  { label: "Mata na Thal Mate", contact: "9879276966" },
  { label: "Gaushala ni Mate", contact: "8282827766" },
  { label: "Akhand Jyot Mate", contact: "8282827766" },
];

const StatsSection: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="ss-title"
    >
      <PageBackgroundDecorations />
      <div className={styles.container}>
        <div
          className={`${styles.header} ${visible ? styles["header--visible"] : styles["header--hidden"]}`}
        >
          <CommonTitle text={"શ્રી રાવીરાંદલધામ માં"} />

          <p
            className={`${styles.subtitle} ${visible ? styles["subtitle--visible"] : styles["subtitle--hidden"]}`}
          >
            આવનાર શ્રદ્ધાળુ ની વ્યવસ્થા
          </p>

          <div className={styles.divider} aria-hidden="true">
            <div className={styles["dividerLine--left"]} />
            <div className={styles.dividerDiamondSm} />
            <div className={styles.dividerDiamondLg} />
            <div className={styles.dividerDiamondSm} />
            <div className={styles["dividerLine--right"]} />
          </div>
        </div>
        {/* Contact Boxes */}
        <div className={styles.contactGrid}>
          {CONTACT_BOXES.map((box, i) => (
            <a
              key={i}
              href={`tel:${box.contact}`}
              className={styles.contactCard}
            >
              <div className={styles.contactCornerTR} aria-hidden="true" />
              <div className={styles.contactCornerBL} aria-hidden="true" />

              <div className={styles.contactIcon} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"
                    fill="url(#ph1)"
                  />
                  <defs>
                    <linearGradient id="ph1" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#FF6B00" />
                      <stop offset="1" stopColor="#FFD700" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className={styles.contactLabel}>{box.label}</div>
              <div className={styles.contactNumber}>{box.contact}</div>
              <div className={styles.contactAccentLine} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
