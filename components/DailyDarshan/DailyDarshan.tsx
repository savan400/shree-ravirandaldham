"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import styles from "./DailyDarshan.module.css";
import LotusDivider from "../LotusDivider/LotusDivider";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";
import CommonDarshanCard from "../CommonDarshanCard/CommonDarshanCard";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox";
import { useInView } from "@/hooks/useInView";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DarshanImage {
  src: string;
  alt?: string;
}

export interface DarshanItem {
  id: string;
  /** Cover image shown on the card */
  coverImage: string;
  date: string;
  day: string;
  title?: string;
  /** All images for this darshan session — shown in the lightbox slideshow */
  images: DarshanImage[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const darshanList: DarshanItem[] = [
  {
    id: "1",
    coverImage: "/images/salangpurhanumanji.jpg",
    date: "17-02-2026",
    day: "TUESDAY",
    title: "Morning Darshan",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Morning Darshan 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Morning Darshan 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Morning Darshan 3" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Morning Darshan 4" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Morning Darshan 5" },
    ],
  },
  {
    id: "2",
    coverImage: "/images/salangpurhanumanji.jpg",
    date: "17-02-2026",
    day: "TUESDAY",
    title: "Evening Darshan",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Evening Darshan 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Evening Darshan 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Evening Darshan 3" },
    ],
  },
  {
    id: "3",
    coverImage: "/images/salangpurhanumanji.jpg",
    date: "17-02-2026",
    day: "TUESDAY",
    title: "Mangala Aarti",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 3" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 4" },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const DailyDarshan: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  // Lightbox state — items change per card click
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (darshan: DarshanItem) => {
    const items: LightboxItem[] = darshan.images.map((img, i) => ({
      src: img.src,
      alt: img.alt ?? `${darshan.title ?? "Darshan"} — photo ${i + 1}`,
      title: `${darshan.title ?? "Darshan"} — ${darshan.day}, ${darshan.date}`,
    }));

    if (items.length === 0) return;
    setLightboxItems(items);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const next = () => setLightboxIndex((i) => (i + 1) % lightboxItems.length);

  const prev = () =>
    setLightboxIndex(
      (i) => (i - 1 + lightboxItems.length) % lightboxItems.length,
    );

  return (
    <>
      <section
        ref={sectionRef}
        id="dev-darshan"
        className={styles.section}
        aria-labelledby="dd-title"
      >
        <PageBackgroundDecorations />
        <div className={styles.container}>
          {/* Section header */}
          <div
            className={`${styles.header} ${visible ? styles["header--visible"] : styles.hidden}`}
          >
            <div className={styles.tag}>
              <span className={styles.tagEmoji} aria-hidden="true">
                🪷
              </span>
              <span className={styles.tagText}>ભગવાનનાં દરરોજ દર્શન</span>
            </div>
            <CommonTitle text="ડેઈલી દર્શન" />
            <LotusDivider />
          </div>

          {/* Darshan cards */}
          <div className={styles.cardGrid}>
            {darshanList.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.cardWrap} ${visible ? styles["card--visible"] : styles.hidden}`}
                onClick={() => openLightbox(item)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title ?? "Darshan"} — ${item.images.length} photo${item.images.length !== 1 ? "s" : ""}`}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(item)}
                style={{ cursor: "pointer" }}
              >
                {/* Badge: session title + date */}
                <div className={styles.dateBadgeWrap}>
                  <CommonBadge
                    text={`${item.title?.toUpperCase() ?? item.day} — ${item.date}`}
                  />
                </div>
                <div className="relative">
                  {/* Cover image card */}
                  <CommonDarshanCard
                    image={item.coverImage}
                    date={item.date}
                    day={item.day}
                    priority={index === 0}
                  />

                  {/* Photo count pill — only shown when there are multiple images */}
                  {item.images.length > 1 && (
                    <div className={styles.photoCountPill} aria-hidden="true">
                      📷 {item.images.length} Photos
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.viewAllWrap}>
            <Link
              href="/upasna-vidhi/mataji-darshan"
              className={styles.viewAllLink}
            >
              VIEW ALL DARSHAN
              <ChevronRight className={styles.viewAllIcon} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox — slideshow through all images of the clicked darshan group */}
      <Lightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={next}
        onPrev={prev}
      />
    </>
  );
};

export default DailyDarshan;
