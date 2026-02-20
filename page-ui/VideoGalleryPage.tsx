"use client"
import React from 'react'
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import galleryStyles from "@/app/[locale]/events/video-gallery/VideoGalleryPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';
import RandalSahayate from './randalSahayate';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoItem {
    id: string;
    title: string;
    youtubeId: string;
    category: 'aarti' | 'sandhya';
}

// ─── Sample Data ──────────────────────────────────────────────────────────────
const VIDEO_DATA: VideoItem[] = [
    { id: '1', title: 'Aarti Darshan Salangpur', youtubeId: 'dRNhVR4srZY?si=cxbtTYUJXfp0BoB7', category: 'aarti' },
    { id: '2', title: 'Sandhya Aarti Darshan Salangpur', youtubeId: 'jLmgUBe7NpY?si=I1J4qoq31B0_marw', category: 'sandhya' },
    { id: '3', title: 'Aarti Darshan Salangpur', youtubeId: 'RlYcw3a8beQ?si=qbp0CNwE-tFds0EC', category: 'aarti' },
    { id: '4', title: 'Sandhya Aarti Darshan Salangpur', youtubeId: 'RqWt9Kcqid4?si=tsFIIFj2pPnmAoZD', category: 'sandhya' },
    { id: '5', title: 'Aarti Darshan Salangpur', youtubeId: 'nHWm64GdFo4?si=vPXjU8b67SRS2tcg', category: 'aarti' },
    { id: '6', title: 'Sandhya Aarti Darshan Salangpur', youtubeId: 'K3wVUV-vcoI?si=KJBrY37U957-qHsd', category: 'sandhya' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const OmSymbol = () => (
    <svg viewBox="0 0 100 100" className={galleryStyles.omSvg} aria-hidden="true">
        <text x="50" y="72" textAnchor="middle" fontSize="70" fontFamily="serif" fill="currentColor">ॐ</text>
    </svg>
);

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard: React.FC<{ video: VideoItem; index: number; isVisible: boolean }> = ({
    video, index, isVisible
}) => (
    <div
        className={`${galleryStyles.card} ${isVisible ? galleryStyles.cardVisible : ''}`}
        style={{ animationDelay: `${index * 120}ms` }}
    >
        {/* Decorative corner mandala */}
        <div className={galleryStyles.cardCorner} aria-hidden="true">
            <OmSymbol />
        </div>

        {/* Player */}
        <div className={galleryStyles.thumbnailWrap}>
            <iframe
                className={galleryStyles.iframe}
                src={`https://www.youtube.com/embed/${video.youtubeId}&autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>

        {/* Card body */}
        <div className={galleryStyles.cardBody}>
            <div className={galleryStyles.cardDivider} />
            <h3 className={galleryStyles.cardTitle}>{video.title}</h3>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const VideoGalleryPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            {/* Sacred particle emitters */}
            <div className={galleryStyles.particles} aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                    <span key={i} className={galleryStyles.particle} style={{ '--i': i } as React.CSSProperties} />
                ))}
            </div>

            <div className={galleryStyles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="Video Gallery" />
                    <LotusDivider />

                    <div className={galleryStyles.grid}>
                        {VIDEO_DATA.map((video, idx) => (
                            <VideoCard key={video.id} video={video} index={idx} isVisible={visible} />
                        ))}
                    </div>

                    <RandalSahayate />
                </div>
            </div>
        </section>
    );
};

export default VideoGalleryPage;