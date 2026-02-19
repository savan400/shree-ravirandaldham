"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
const RandalBookingPage = () => {
    const [visible, setVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const visibleClass = (base: string) =>
        `${styles[base]} ${visible ? styles.visible : ""}`;
    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>
                <div className={visibleClass("header")}>
                    <CommonTitle text="રાંદલ તેડવાનું બૂકિંગ" />
                    <LotusDivider />

                    <>
                        {/* page content */}
                    </>
                    <div className={visibleClass("footer")}>
                        <DiamondDivider />
                        <p className={styles.footerBlessing} style={{ marginTop: '20px' }}>
                            ॥ જય સદગુરુ શ્રી ગોપાળાનંદ સ્વામી ॥
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RandalBookingPage