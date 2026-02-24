"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/events/photo-gallery/PhotoGalleryPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryGroup {
  id: string;
  date: string;
  title: string;
  images: GalleryImage[];
}

export const groupedGalleryItems: GalleryGroup[] = [
  {
    id: "g1",
    date: "17/02/2026",
    title: "Maruti yagna 17-02-2026",
    images: [{ src: "/images/gallery/p-1.jpeg", alt: "Maruti yagna" }],
  },
  {
    id: "g2",
    date: "16/02/2026",
    title: "Sandhya Aarti Darshan Salangpur",
    images: [
      { src: "/images/gallery/p-2.jpeg", alt: "Aarti Darshan 1" },
      { src: "/images/gallery/p-3.jpeg", alt: "Aarti Darshan 2" },
    ],
  },
  {
    id: "g3",
    date: "12/02/2026",
    title: "Evening Aarti Celebration",
    images: [
      { src: "/images/gallery/p-9.jpeg", alt: "Aarti 1" },
      { src: "/images/gallery/p-10.jpeg", alt: "Aarti 2" },
      { src: "/images/gallery/p-11.jpeg", alt: "Aarti 3" },
      { src: "/images/gallery/p-12.jpeg", alt: "Aarti 4" },
      { src: "/images/gallery/p-13.jpeg", alt: "Aarti 5" },
      { src: "/images/gallery/p-14.jpeg", alt: "Aarti 6" },
      { src: "/images/gallery/p-15.jpeg", alt: "Aarti 7" },
    ],
  },
  {
    id: "g1",
    date: "17/02/2026",
    title: "Maruti yagna 17-02-2026",
    images: [{ src: "/images/gallery/p-1.jpeg", alt: "Maruti yagna" }],
  },
  {
    id: "g2",
    date: "16/02/2026",
    title: "Sandhya Aarti Darshan Salangpur",
    images: [
      { src: "/images/gallery/p-2.jpeg", alt: "Aarti Darshan 1" },
      { src: "/images/gallery/p-3.jpeg", alt: "Aarti Darshan 2" },
    ],
  },
  {
    id: "g3",
    date: "12/02/2026",
    title: "Evening Aarti Celebration",
    images: [
      { src: "/images/gallery/p-9.jpeg", alt: "Aarti 1" },
      { src: "/images/gallery/p-10.jpeg", alt: "Aarti 2" },
      { src: "/images/gallery/p-11.jpeg", alt: "Aarti 3" },
      { src: "/images/gallery/p-12.jpeg", alt: "Aarti 4" },
      { src: "/images/gallery/p-13.jpeg", alt: "Aarti 5" },
      { src: "/images/gallery/p-14.jpeg", alt: "Aarti 6" },
      { src: "/images/gallery/p-15.jpeg", alt: "Aarti 7" },
    ],
  },
];
const CardArch: React.FC = () => (
  <svg
    viewBox="0 0 400 80"
    fill="none"
    className={styles.archOrnament}
    preserveAspectRatio="none"
  >
    <path
      d="M0 80 L0 38 Q200 -22 400 38 L400 80"
      fill="url(#arch-wash)"
      opacity="0.22"
    />
    <path
      d="M0 6 Q200 -26 400 6"
      stroke="url(#arch-line)"
      strokeWidth="2.5"
      fill="none"
    />
    <defs>
      <linearGradient id="arch-wash" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="arch-line" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#FF6B00" />
        <stop offset="0.5" stopColor="#FFD700" />
        <stop offset="1" stopColor="#FF6B00" />
      </linearGradient>
    </defs>
  </svg>
);

const PhotoGalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImages, setActiveImages] = useState<LightboxItem[]>([]);

  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  const openGroup = (group: (typeof groupedGalleryItems)[0]) => {
    const formattedItems: LightboxItem[] = group.images.map((img) => ({
      src: img.src,
      alt: img.alt,
      title: group.title,
      date: group.date,
    }));
    setActiveImages(formattedItems);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  return (
    <>
      <section ref={sectionRef} className={styles.section}>
        <PageBackgroundDecorations />
        <div className={styles.container}>
          <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
            <CommonBadge text="॥ દર્શન ગેલેરી ॥" />
            <CommonTitle text="Photo Gallery" />
            <LotusDivider />
            <p className={styles.subtitle}>
              દેવ દર્શનની પવિત્ર ક્ષણો — ભક્તોની શ્રદ્ધાની અમૂલ્ય યાદો
            </p>
          </div>

          <div className={styles.gallery}>
            {groupedGalleryItems.map((group, index) => (
              <div
                key={group.id}
                className={`${styles.galleryItem} ${visible ? styles.itemVisible : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openGroup(group)}
                role="button"
              >
                <Image
                  src={group.images[0].src} // Use first image as cover
                  alt={group.title}
                  fill
                  className={styles.galleryImage}
                />

                {/* Label Section at Bottom */}
                <div className={styles.groupInfo}>
                  <span className={styles.groupDate}>{group.date}</span>
                  <h3 className={styles.groupTitle}>{group.title}</h3>
                  <span className={styles.groupCount}>
                    {group.images.length} Photos
                  </span>
                </div>

                <div className={styles.vignette} />
                <CardArch />
                <div className={styles.imageOverlay}>
                  <div className={styles.zoomRing}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <RandalSahayate />
        </div>
      </section>

      <Lightbox
        items={activeImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() =>
          setCurrentImageIndex((p) => (p + 1) % activeImages.length)
        }
        onPrev={() =>
          setCurrentImageIndex(
            (p) => (p - 1 + activeImages.length) % activeImages.length,
          )
        }
      />
    </>
  );
};

export default PhotoGalleryPage;
