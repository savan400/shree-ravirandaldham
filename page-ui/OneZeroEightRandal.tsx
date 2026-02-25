"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../app/[locale]/ravirandaldham/parichay/ParichayPage.module.css";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";
import CommonStatsSection, {
  StatItem,
} from "@/components/CommonStatsSection/CommonStatsSection";
import ClickableImage from "@/components/ClickableImage";

// ── Corner ornament ────────────────────────────────────────────────────────
const CornerOrnament = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    className={`${styles.cornerOrnament} ${flip ? styles.cornerOrnamentRight : styles.cornerOrnamentLeft}`}
  >
    <path
      d="M4 66 L4 4 L66 4"
      stroke="#FFD700"
      strokeWidth="2"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M4 4 L18 4 M4 4 L4 18"
      stroke="#FF8C00"
      strokeWidth="1.2"
      opacity="0.9"
    />
    <circle cx="4" cy="4" r="4" fill="#FFD700" />
    <circle cx="4" cy="4" r="2" fill="#FFF" opacity="0.6" />
    <path
      d="M4 28 Q18 28 18 4"
      stroke="#F5A623"
      strokeWidth="0.7"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M4 42 Q32 42 32 4"
      stroke="#F5A623"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);
const TEMPLE_STATS: StatItem[] = [
  {
    iconKey: "height",
    value: 108,
    suffix: "ft",
    label: "શિખર ઉંચાઈ",
    sublabel: "Shikar Height",
    featured: true,
  },
  {
    iconKey: "people",
    value: 10000,
    suffix: "+",
    label: "ભક્તો દૈનિક",
    sublabel: "Daily Devotees",
  },
  {
    iconKey: "rooms",
    value: 52,
    suffix: "",
    label: "મંડપ",
    sublabel: "Mandaps",
  },
];
// ── Page component ─────────────────────────────────────────────────────────
const OneZeroEightRandal = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <>
      <section ref={sectionRef} className={styles.section}>
        <PageBackgroundDecorations />
        <div className={styles.container}>
          {/* ── Header ── */}
          <div className={visibleClass("header", visible)}>
            <CommonBadge text="॥ મંદિર વિશે ॥" />
            <CommonTitle text="૧૦૮ રાંદલ" />
            <LotusDivider />
          </div>
          {/* ── Content grid ── */}
          <div className={styles.grid}>
            {/* Left: image */}
            <div className="sticky-img-class">
              <ClickableImage
                items={{
                  src: "/images/108-randal.jpg",
                  alt: "Shree Ravirandaldham Deity",
                }}
              >
                <div
                  className={`${styles.imageCol} ${visible ? styles.visible : ""}`}
                >
                  <div className={styles.imageFrame}>
                    <CornerOrnament />
                    <CornerOrnament flip />
                    <div className={styles.halo} />

                    <div className={styles.imageContainer}>
                      {imageLoaded && <div className={styles.imageShine} />}
                      <Image
                        src="/images/108-randal.jpg"
                        alt="Shree Ravirandaldham Deity"
                        width={500}
                        height={650}
                        className={styles.deityImage}
                        onLoad={() => setImageLoaded(true)}
                        priority
                      />
                    </div>

                    <div className={styles.frameBottomGradient} />
                  </div>
                </div>
              </ClickableImage>
            </div>

            {/* Right: text */}
            <div
              className={`${styles.textCol} ${visible ? styles.visible : ""}`}
            >
              <div className={styles.contentCard}>
                <div className={styles.contentCardAccentBar} />

                <p className={styles.contentText}>
                  હાલમાં, રાંદલમાં, ૧૦૮ જોડી પગથિયાં સાથે એક ખાસ વાવ બનાવવામાં
                  આવી છે, જ્યાં દરેક ભક્ત તેમની ભક્તિ અને પ્રસાદનું પ્રતિનિધિત્વ
                  કરતા "લોટા" (એક નાનું પાત્ર) ને ડૂબાડી શકે છે.
                </p>
                <RandalSahayate />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <CommonStatsSection
        title="૧૦૮ રાંદલની વિશેષતાઓ"
        subtitle="પ્રભુ ધામની ભવ્યતા"
        footerNote="॥ રાંદલ ના દડવા ॥"
        stats={TEMPLE_STATS}
        countDuration={1800} // faster count-up
        threshold={0.3}
      /> */}
    </>
  );
};

export default OneZeroEightRandal;
