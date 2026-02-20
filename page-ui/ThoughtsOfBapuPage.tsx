"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "../app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import matajiDarshan from "../app/[locale]/upasna-vidhi/mataji-darshan/MatajiDarshanPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
import CommonDarshanCard from '@/components/CommonDarshanCard/CommonDarshanCard';
import Lightbox, { LightboxItem } from '@/components/Lightbox/Lightbox'; // ← add this
import RandalSahayate from './randalSahayate';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';

export interface DarshanItem {
    id: string;
    image: string;
    date?: string;
    day?: string;
    title?: string;
}

export const darshanList: DarshanItem[] = [
    {
        id: "1",
        image: "/images/thoughts-bapu/d-1.webp",
    },
    {
        id: "2",
        image: "/images/thoughts-bapu/d-2.webp",
    },
    {
        id: "3",
        image: "/images/thoughts-bapu/d-3.webp",
    },
    {
        id: "4",
        image: "/images/thoughts-bapu/d-4.webp",
    },
    {
        id: "5",
        image: "/images/thoughts-bapu/d-5.webp",
    },
    {
        id: "6",
        image: "/images/thoughts-bapu/d-6.webp",
    },
    {
        id: "7",
        image: "/images/thoughts-bapu/d-7.webp",
    },
    {
        id: "8",
        image: "/images/thoughts-bapu/d-8.webp",
    },
    {
        id: "9",
        image: "/images/thoughts-bapu/d-9.webp",
    },
    {
        id: "10",
        image: "/images/thoughts-bapu/d-10.webp",
    },
    {
        id: "11",
        image: "/images/thoughts-bapu/d-11.webp",
    },
    {
        id: "12",
        image: "/images/thoughts-bapu/d-12.webp",
    },
    {
        id: "13",
        image: "/images/thoughts-bapu/d-13.webp",
    },
    {
        id: "14",
        image: "/images/thoughts-bapu/d-14.webp",
    },
    {
        id: "15",
        image: "/images/thoughts-bapu/d-15.webp",
    },
    {
        id: "16",
        image: "/images/thoughts-bapu/d-16.webp",
    },
    {
        id: "17",
        image: "/images/thoughts-bapu/d-17.webp",
    },
    {
        id: "18",
        image: "/images/thoughts-bapu/d-18.webp",
    },
];

// Map darshanList → LightboxItem shape once
const lightboxItems: LightboxItem[] = darshanList.map((item) => ({
    src: item?.image,
    alt: item.title || item.day || "Darshan Image",
    title: item?.title,
    date: item?.date,
}));

const ThoughtsOfBapuPage = () => {

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };



    return (
        <>
            <section ref={sectionRef} className={styles.section}>
                <PageBackgroundDecorations />
                <div className={matajiDarshan.container}>
                    <div className={visibleClass("header", visible)}>
                        <CommonTitle text="બાપુના વિચારો" />
                        <LotusDivider />

                        <div className={matajiDarshan.grid}>
                            {darshanList.map((item, index) => (
                                // Wrap each card in a clickable div
                                <div
                                    key={item.id}
                                    onClick={() => openLightbox(index)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <CommonDarshanCard
                                        image={item.image}
                                        priority
                                    />
                                </div>
                            ))}
                        </div>
                        <RandalSahayate />
                    </div>
                </div>
            </section>

            {/* Reusable Lightbox */}
            <Lightbox
                items={lightboxItems}
                currentIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNext={() => setCurrentIndex((i) => (i + 1) % lightboxItems.length)}
                onPrev={() => setCurrentIndex((i) => (i - 1 + lightboxItems.length) % lightboxItems.length)}
            />
        </>
    );
};

export default ThoughtsOfBapuPage;