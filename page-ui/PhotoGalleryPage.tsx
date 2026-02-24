"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/events/photo-gallery/PhotoGalleryPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { fetchGalleries, GalleryEntry } from "@/lib/api";
import { useLocale } from "next-intl";
import { Images } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";

const PER_PAGE = 12;

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
    const locale = useLocale() as "en" | "hi" | "gu";

    // Gallery list state
    const [galleries, setGalleries] = useState<GalleryEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Lightbox state
    const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    const load = useCallback(async (p: number) => {
        setLoading(true);
        const result = await fetchGalleries(p, PER_PAGE);
        setGalleries(result.data ?? []);
        setTotal(result.total ?? 0);
        setLoading(false);
    }, []);

    useEffect(() => { load(page); }, [page, load]);

    // Open the lightbox for a specific gallery
    const openGallery = (gallery: GalleryEntry) => {
        const items: LightboxItem[] = gallery.images.map((img) => ({
            src: img.url,
            alt: img.description?.[locale] || img.description?.en || gallery.title[locale] || gallery.title.en,
            title: img.description?.[locale] || img.description?.en || undefined,
        }));

        if (items.length === 0 && gallery.coverImage) {
            items.push({
                src: gallery.coverImage,
                alt: gallery.title[locale] || gallery.title.en,
                title: gallery.title[locale] || gallery.title.en,
            });
        }

        if (items.length === 0) return;
        setLightboxItems(items);
        setLightboxIndex(0);
        setLightboxOpen(true);
    };

    const next = () => setLightboxIndex((i) => (i + 1) % lightboxItems.length);
    const prev = () => setLightboxIndex((i) => (i - 1 + lightboxItems.length) % lightboxItems.length);

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

                    {/* Loading */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                        </div>
                    ) : galleries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <Images className="w-16 h-16 mb-4 opacity-25" />
                            <p className="text-sm font-medium">No galleries available yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Gallery Grid */}
                            <div className={styles.gallery}>
                                {galleries.map((gallery, index) => (
                                    <div
                                        key={gallery._id}
                                        className={`${styles.galleryItem} ${visible ? styles.itemVisible : ""}`}
                                        style={{ animationDelay: `${0.05 + index * 0.04}s` }}
                                        onClick={() => openGallery(gallery)}
                                        role="button"
                                        aria-label={`Open gallery: ${gallery.title[locale] || gallery.title.en}`}
                                    >
                                        <div className={styles.sacredHalo} aria-hidden="true" />

                                        {gallery.coverImage ? (
                                            <Image
                                                src={gallery.coverImage}
                                                alt={gallery.title[locale] || gallery.title.en}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                className={styles.galleryImage}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-amber-950/30">
                                                <Images className="w-10 h-10 text-amber-200/40" />
                                            </div>
                                        )}

                                        {/* Title + count — always visible at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            <p className="text-white text-xs font-bold leading-tight line-clamp-2 drop-shadow">
                                                {gallery.title[locale] || gallery.title.en}
                                            </p>
                                            {gallery.images.length > 0 && (
                                                <p className="text-amber-300/80 text-[10px] mt-0.5">
                                                    {gallery.images.length} photo{gallery.images.length !== 1 ? "s" : ""}
                                                </p>
                                            )}
                                        </div>

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
                                            </div>
                                        </div>

                                        <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
                                        <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
                                        <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
                                        <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                page={page}
                                total={total}
                                perPage={PER_PAGE}
                                onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                                className="mt-8"
                            />
                        </>
                    )}

                    <RandalSahayate />
                </div>
            </section>

            {/* Per-gallery image slideshow lightbox */}
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

export default PhotoGalleryPage;