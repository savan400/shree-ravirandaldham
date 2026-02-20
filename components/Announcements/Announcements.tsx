"use client";

import { AlertTriangle, Bell, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import styles from "./Announcements.module.css";
import { useInView } from "@/hooks/useInView";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrnamentalDividerProps {
  /** CSS width value, e.g. "100%" or "180px" */
  width?: string;
  opacity?: number;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const OrnamentalDivider: React.FC<OrnamentalDividerProps> = ({
  width = "100%",
  opacity = 1,
}) => (
  <div className={styles.divider} style={{ width, opacity }}>
    <div className={`${styles.dividerLine} ${styles["dividerLine--left"]}`} />
    <div className={styles.dividerDiamondLg} />
    <div className={styles.dividerDiamondSm} />
    <div className={styles.dividerDiamondLg} />
    <div className={`${styles.dividerLine} ${styles["dividerLine--right"]}`} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AccentBar: React.FC = () => (
  <div className={styles.accentBar} aria-hidden="true">
    <div className={`${styles.accentBarSegment} ${styles["accentBarSegment--lg"]}`} />
    <div className={`${styles.accentBarSegment} ${styles["accentBarSegment--md"]}`} />
    <div className={`${styles.accentBarSegment} ${styles["accentBarSegment--sm"]}`} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const PulsingBell: React.FC = () => (
  <div className={styles.pulsingBell}>
    <div className={styles.bellRingOuter} aria-hidden="true" />
    <div className={styles.bellRingInner} aria-hidden="true" />
    <div className={styles.bellCore}>
      <Bell className={styles.bellIcon} aria-hidden="true" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Announcements: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="announcements"
      aria-labelledby="announcements-title"
    >
      {/* ── Background decorations ── */}
      <div className={styles.watermarkOm} aria-hidden="true">ॐ</div>
      <div className={styles.watermarkDanda} aria-hidden="true">॥</div>
      <div className={styles.dotGrid} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>

          {/* ── LEFT: Section label ── */}
          <div className={`${styles.labelCol} ${visible ? styles.visibleLeft : styles.hidden}`}>
            <div className={styles.bellWrap}>
              <PulsingBell />
            </div>

            <h2
              id="announcements-title"
              className={styles.sectionTitle}
            >
              Announce<br />ments
            </h2>

            <OrnamentalDivider width="180px" />

            <div className={styles.stackedBars} aria-hidden="true">
              <div className={`${styles.stackedBar} ${styles["stackedBar--lg"]}`} />
              <div className={`${styles.stackedBar} ${styles["stackedBar--md"]}`} />
              <div className={`${styles.stackedBar} ${styles["stackedBar--sm"]}`} />
            </div>

            <p className={styles.sanskritTag}>॥ સૂચના ॥</p>
          </div>

          {/* ── RIGHT: Announcement card ── */}
          <div className={`${styles.cardCol} ${visible ? styles.visibleRight : styles.hidden}`}>
            <article className={styles.card} aria-label="Fraud alert announcement">
              {/* Animated left accent bar */}
              <div className={styles.cardAccentBar} aria-hidden="true" />

              {/* Temple name */}
              <div className={styles.templeNameRow}>
                <AccentBar />
                <p className={styles.templeName}>
                  શ્રી સ્વામિનારાયણ મંદિર વડતાલધામ તાબાનું શ્રી કષ્ટભંજનદેવ
                  હનુમાનજી મંદિર-સાળંગપુર
                </p>
              </div>

              {/* Thin divider */}
              <div className={styles.cardDivider} aria-hidden="true" />

              {/* Fraud Alert badge */}
              <div className={styles.fraudBadge} role="alert">
                <div className={styles.fraudIconWrap}>
                  <AlertTriangle className={styles.fraudIcon} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.fraudTitle}>FRAUD ALERT</p>
                  <p className={styles.fraudSubtitle}>ફ્રોડથી સાવધાન</p>
                </div>
              </div>

              {/* Gujarati paragraph */}
              <p className={styles.gujaratiText}>
                સાળંગપુરધામમાં શ્રી કષ્ટભંજનદેવ હનુમાનજી મંદિર દ્વારા
                ઉતારા(રૂમ) માટે એડવાન્સ બુકિંગ તથા ઓનલાઈન બુકિંગની કોઈપણ
                એજન્ટો દ્વારા વ્યવસ્થા ચલાવવામાં આવતી નથી.
              </p>

              {/* English note */}
              <div className={styles.englishNote}>
                <p className={styles.englishText}>
                  <strong className={styles.englishTextStrong}>Beware of fraud:</strong>{" "}
                  Advance booking and online booking for UTARA(Room) by Sri
                  Kastabhanjandev Hanumanji Temple in Salangpurdham is not
                  managed by our temple or any agents. You are welcome for
                  darshan, you will get UTARA(Room) only after the devotees
                  arrive at the temple as per the situation at that time.
                </p>
              </div>

              {/* Bottom divider + Read More */}
              <OrnamentalDivider opacity={0.5} />

              <div className={styles.readMoreWrap}>
                <button type="button" className={styles.readMoreBtn}>
                  READ MORE
                  <ChevronRight className={styles.readMoreIcon} aria-hidden="true" />
                </button>
              </div>
            </article>

            {/* Shadow strip below card */}
            <div className={styles.cardShadowStrip} aria-hidden="true" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Announcements;