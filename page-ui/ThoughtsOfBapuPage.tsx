"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import matajiDarshan from "../app/upasna-vidhi/mataji-darshan/MatajiDarshanPage.module.css";
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
    date: string;
    day: string;
    title?: string;
}

export const darshanList: DarshanItem[] = [
    {
        id: "1",
        image: "/images/salangpurhanumanji.jpg",
        date: "17-02-2026",
        day: "TUESDAY",
        title: "Morning Darshan",
    },
    {
        id: "2",
        image: "/images/salangpurhanumanji.jpg",
        date: "16-02-2026",
        day: "MONDAY",
        title: "Evening Darshan",
    },
    {
        id: "3",
        image: "/images/salangpurhanumanji.jpg",
        date: "15-02-2026",
        day: "SUNDAY",
        title: "Special Shringar",
    },
    {
        id: "4",
        image: "/images/salangpurhanumanji.jpg",
        date: "14-02-2026",
        day: "SATURDAY",
        title: "Festival Darshan",
    },
    {
        id: "5",
        image: "/images/salangpurhanumanji.jpg",
        date: "13-02-2026",
        day: "FRIDAY",
        title: "Mangala Aarti",
    },
];

// Map darshanList → LightboxItem shape once
const lightboxItems: LightboxItem[] = darshanList.map((item) => ({
    src: item.image,
    alt: item.title ?? item.day,
    title: item.title,
    date: item.date,
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
                                        date={item.date}
                                        day={item.day}
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