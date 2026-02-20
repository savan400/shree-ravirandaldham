"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';
const RandalBookingPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });
    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="રાંદલ તેડવાનું બૂકિંગ" />
                    <LotusDivider />

                    <>
                        {/* page content */}
                    </>
                    <div className={visibleClass("footer", visible)}>
                        <DiamondDivider />
                        <p className={styles.footerBlessing} style={{ marginTop: '20px' }}>
                            ॥ શ્રી રવિ રાંદલ સદા સહાયતે  ॥
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RandalBookingPage