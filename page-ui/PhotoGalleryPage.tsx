"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/events/photo-gallery/PhotoGalleryPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox"; // ← import
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";

interface GalleryItem {
    id: string;
    date: string;
    title: string;
    image: string;
}

const galleryItems: GalleryItem[] = [
    { id: "1", date: "17/02/2026", title: "Maruti yagna 17-02-2026", image: "/images/gallery/p-1.jpeg" },
    { id: "2", date: "16/02/2026", title: "16-02-2026 Sandhya Aarti Darshan Salangpur", image: "/images/gallery/p-2.jpeg" },
    { id: "3", date: "16/02/2026", title: "Maruti yagna 16-02-2026", image: "/images/gallery/p-3.jpeg" },
    { id: "4", date: "16/02/2026", title: "15-02-2026 Laghu Rudra Yagna & Abhishek (Maha Shivratri)", image: "/images/gallery/p-4.jpeg" },
    { id: "5", date: "15/02/2026", title: "15-02-2026 Divyang Sanman Samaroh", image: "/images/gallery/p-5.jpeg" },
    { id: "6", date: "15/02/2026", title: "15-02-2026 MAHA SHIVRATRI", image: "/images/gallery/p-6.jpeg" },
    { id: "7", date: "14/02/2026", title: "14-02-2026 Shivratri Preparations", image: "/images/gallery/p-7.jpeg" },
    { id: "8", date: "13/02/2026", title: "13-02-2026 Daily Darshan", image: "/images/gallery/p-8.jpeg" },
    { id: "9", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-9.jpeg" },
    { id: "10", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-10.jpeg" },
    { id: "11", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-11.jpeg" },
    { id: "12", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-12.jpeg" },
    { id: "13", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-13.jpeg" },
    { id: "14", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-14.jpeg" },
    { id: "15", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-15.jpeg" },
    { id: "16", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-16.png" },
    { id: "17", date: "12/02/2026", title: "12-02-2026 Evening Aarti", image: "/images/gallery/p-17.png" },
];

// Map gallery items → LightboxItem shape
const lightboxItems: LightboxItem[] = galleryItems.map((item) => ({
    src: item.image,
    alt: item.title,
    title: item.title,
    date: item.date,
}));

// ── Arch SVG ornament ──────────────────────────────────────────────────────────
const CardArch: React.FC = () => (
    <svg
        viewBox="0 0 400 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.archOrnament}
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <path d="M0 80 L0 38 Q200 -22 400 38 L400 80" fill="url(#arch-wash)" opacity="0.22" />
        <path d="M0 6 Q200 -26 400 6" stroke="url(#arch-line)" strokeWidth="2.5" fill="none" opacity="0.9" />
        <path d="M20 10 Q200 -14 380 10" stroke="url(#arch-line)" strokeWidth="1" fill="none" opacity="0.35" />
        <circle cx="200" cy="-2" r="5" fill="#FFD700" opacity="0.95" />
        <circle cx="200" cy="-2" r="2.5" fill="#FFF" opacity="0.7" />
        <circle cx="0" cy="6" r="3.5" fill="#FF8C00" opacity="0.8" />
        <circle cx="400" cy="6" r="3.5" fill="#FF8C00" opacity="0.8" />
        <line x1="0" y1="6" x2="14" y2="6" stroke="#FFD700" strokeWidth="1.2" opacity="0.6" />
        <line x1="400" y1="6" x2="386" y2="6" stroke="#FFD700" strokeWidth="1.2" opacity="0.6" />
        <defs>
            <linearGradient id="arch-wash" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFD700" />
                <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="arch-line" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#FF6B00" />
                <stop offset="0.35" stopColor="#FFD700" />
                <stop offset="0.65" stopColor="#FF8C00" />
                <stop offset="1" stopColor="#FF6B00" />
            </linearGradient>
        </defs>
    </svg>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const PhotoGalleryPage = () => {

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const nextImage = () =>
        setCurrentImageIndex((p) => (p + 1) % lightboxItems.length);

    const prevImage = () =>
        setCurrentImageIndex((p) => (p - 1 + lightboxItems.length) % lightboxItems.length);

    return (
        <>
            <section ref={sectionRef} className={styles.section}>
                <PageBackgroundDecorations />
                <div className={styles.container}>

                    {/* Header */}
                    <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                        <CommonBadge text="॥ દર્શન ગેલેરી ॥" />
                        <CommonTitle text="Photo Gallery" />
                        <LotusDivider />
                        <p className={styles.subtitle}>
                            દેવ દર્શનની પવિત્ર ક્ષણો — ભક્તોની શ્રદ્ધાની અમૂલ્ય યાદો
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className={styles.gallery}>
                        {galleryItems.map((item, index) => (
                            <div
                                key={item.id + "-" + index}
                                className={`${styles.galleryItem} ${visible ? styles.itemVisible : ""}`}
                                style={{ animationDelay: `${0.05 + index * 0.04}s` }}
                                onClick={() => openLightbox(index)}
                                role="button"
                                aria-label={`View ${item.title}`}
                            >
                                <div className={styles.sacredHalo} aria-hidden="true" />
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className={styles.galleryImage}
                                />
                                <div className={styles.vignette} aria-hidden="true" />
                                <CardArch />
                                <div className={styles.shimmer} aria-hidden="true" />
                                <div className={styles.imageOverlay} aria-hidden="true">
                                    <div className={styles.overlayContent}>
                                        <div className={styles.zoomRing}>
                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.35-4.35" />
                                                <line x1="11" y1="8" x2="11" y2="14" />
                                                <line x1="8" y1="11" x2="14" y2="11" />
                                            </svg>
                                        </div>
                                        <span className={styles.overlayOm} aria-hidden="true">ॐ</span>
                                    </div>
                                </div>
                                <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
                                <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
                                <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
                                <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
                            </div>
                        ))}
                    </div>
                    <RandalSahayate />
                </div>
            </section>

            {/* ── Reusable Lightbox ─────────────────────────────────────────── */}
            <Lightbox
                items={lightboxItems}
                currentIndex={currentImageIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={nextImage}
                onPrev={prevImage}
            />
        </>
    );
};

export default PhotoGalleryPage;