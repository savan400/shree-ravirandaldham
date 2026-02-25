"use client";
import React, { useState } from "react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import matajiDarshan from "@/app/[locale]/upasna-vidhi/mataji-darshan/MatajiDarshanPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import CommonDarshanCard from "@/components/CommonDarshanCard/CommonDarshanCard";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DarshanImage {
  src: string;
  alt?: string;
}

export interface DarshanItem {
  id: string;
  /** Cover image shown on the card grid */
  coverImage: string;
  date: string;
  day: string;
  title?: string;
  /** All photos for this session — shown as a slideshow in the lightbox */
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
    date: "16-02-2026",
    day: "MONDAY",
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
    date: "15-02-2026",
    day: "SUNDAY",
    title: "Special Shringar",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Special Shringar 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Special Shringar 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Special Shringar 3" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Special Shringar 4" },
    ],
  },
  {
    id: "4",
    coverImage: "/images/salangpurhanumanji.jpg",
    date: "14-02-2026",
    day: "SATURDAY",
    title: "Festival Darshan",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 3" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 4" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 5" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Festival Darshan 6" },
    ],
  },
  {
    id: "5",
    coverImage: "/images/salangpurhanumanji.jpg",
    date: "13-02-2026",
    day: "FRIDAY",
    title: "Mangala Aarti",
    images: [
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 1" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 2" },
      { src: "/images/salangpurhanumanji.jpg", alt: "Mangala Aarti 3" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const MatajiDarshanPage = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  // Lightbox state — rebuilt per card click
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
      <section ref={sectionRef} className={styles.section}>
        <PageBackgroundDecorations />
        <div className={matajiDarshan.container}>
          <div className={visibleClass("header", visible)}>
            <CommonTitle text="માતાજી દર્શન" />
            <LotusDivider />

            <div className={matajiDarshan.grid}>
              {darshanList.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title ?? "Darshan"} — ${item.images.length} photo${item.images.length !== 1 ? "s" : ""}`}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(item)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <CommonDarshanCard
                    image={item.coverImage}
                    date={item.date}
                    day={item.day}
                    priority={index === 0}
                  />

                  {/* Photo count pill */}
                  {item.images.length > 1 && (
                    <div
                      className={matajiDarshan.photoCountPill}
                      aria-hidden="true"
                    >
                      📷 {item.images.length} Photos
                    </div>
                  )}
                </div>
              ))}
            </div>

            <RandalSahayate />
          </div>
        </div>
      </section>

      {/* Per-group lightbox slideshow */}
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

export default MatajiDarshanPage;
