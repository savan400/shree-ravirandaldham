"use client"
import React from 'react'
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import wp from "../app/[locale]/downloads/wallpaper/Wallpaper.module.css"
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';
import RandalSahayate from './randalSahayate';

// ── Data ──────────────────────────────────────────────────────────────────────
const desktopWallpapers = [
    { id: 1, label: "Salangpurdham Hanuman", src: "/images/wallpapers/desktop/pc-1.webp", downloadUrl: "/images/wallpapers/desktop/pc-1.webp" },
    { id: 2, label: "Kashtabhanjan Dev", src: "/images/wallpapers/desktop/pc-2.webp", downloadUrl: "/images/wallpapers/desktop/pc-2.webp" },
    { id: 3, label: "Holi Darshan", src: "/images/wallpapers/desktop/pc-3.webp", downloadUrl: "/images/wallpapers/desktop/pc-3.webp" },
    { id: 4, label: "Holi Darshan", src: "/images/wallpapers/desktop/pc-1.webp", downloadUrl: "/images/wallpapers/desktop/pc-1.webp" },
];

const mobileWallpapers = [
    { id: 4, label: "Bapu Blessings", src: "/images/wallpapers/mobile/mb-1.jpg", downloadUrl: "/images/wallpapers/mobile/mb-1.jpg" },
    { id: 5, label: "Temple Spire", src: "/images/wallpapers/mobile/mb-2.jpg", downloadUrl: "/images/wallpapers/mobile/mb-2.jpg" },
    { id: 6, label: "Temple Spire", src: "/images/wallpapers/mobile/mb-1.jpg", downloadUrl: "/images/wallpapers/mobile/mb-1.jpg" },
    { id: 7, label: "Temple Spire", src: "/images/wallpapers/mobile/mb-2.jpg", downloadUrl: "/images/wallpapers/mobile/mb-2.jpg" },
    { id: 8, label: "Temple Spire", src: "/images/wallpapers/mobile/mb-1.jpg", downloadUrl: "/images/wallpapers/mobile/mb-1.jpg" },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
const DownloadIcon = () => (
    <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 12l-4-4h2.5V2h3v6H12L8 12zm-5 2h10v1.5H3V14z" />
    </svg>
);

// ── Card ──────────────────────────────────────────────────────────────────────
interface WallpaperItem { id: number; label: string; src: string; downloadUrl: string }

const WallpaperCard = ({ item, isMobile = false }: { item: WallpaperItem; isMobile?: boolean }) => (
    <div className={wp.card}>
        <div className={`${wp.cardImg} ${isMobile ? wp.cardImgMobile : wp.cardImgDesktop}`}>
            <img src={item.src} alt={item.label} loading="lazy" />
            {/* label revealed on hover */}
            <div className={wp.cardLabel}>{item.label}</div>
        </div>
        <div className={wp.cardFooter}>
            <a
                className={wp.downloadBtn}
                href={item.downloadUrl}
                download
                aria-label={`Download ${item.label}`}
            >
                <DownloadIcon />
                Download
            </a>
        </div>
    </div>
);

// ── Section Heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className={wp.sectionHeading}>
        {children}
        <span className={wp.headingLine} />
    </h2>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const WallpaperPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            <div className={wp.container}>
                <div className={visibleClass("header", visible)}>

                    <CommonTitle text="Wallpapers" />
                    <LotusDivider />

                    {/* ── Desktop ── */}
                    <SectionHeading>Desktop Wallpaper</SectionHeading>
                    <div className={`${wp.grid} ${wp.gridDesktop}`}>
                        {desktopWallpapers.map(item => (
                            <WallpaperCard key={item.id} item={item} />
                        ))}
                    </div>

                    <DiamondDivider />

                    {/* ── Mobile ── */}
                    <SectionHeading>Mobile Wallpaper</SectionHeading>
                    <div className={`${wp.grid} ${wp.gridMobile}`}>
                        {mobileWallpapers.map(item => (
                            <WallpaperCard key={item.id} item={item} isMobile />
                        ))}
                    </div>

                    <RandalSahayate />
                </div>
            </div>
        </section>
    );
};

export default WallpaperPage;