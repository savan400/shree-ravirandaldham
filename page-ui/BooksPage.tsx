"use client"
import React from 'react'
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import calendarStyles from "@/app/[locale]/downloads/calendar/Calendarpage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';
import RandalSahayate from './randalSahayate';

const BooksPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            <div className={styles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="Books" />
                    <LotusDivider />

                    <div className={calendarStyles.csWrapper}>
                        <p className={calendarStyles.csLabel}>Upcoming Feature</p>
                        <h2 className={calendarStyles.csTitle}>Coming Soon</h2>
                        <p className={calendarStyles.csSubtitle}>ટૂંક સમયમાં આવી રહ્યું છે</p>

                        <div className={calendarStyles.csCard}>
                            <p className={calendarStyles.csCardText}>
                                Our sacred collection of books — featuring devotional scriptures, spiritual discourses, and divine teachings — is being compiled with reverence. Please visit again soon for holy texts and literary treasures.
                            </p>
                            <div className={calendarStyles.csNotifyRow}>
                                <div className={calendarStyles.csDot} />
                                <div className={calendarStyles.csDot} />
                                <div className={calendarStyles.csDot} />
                                <span className={calendarStyles.csNotifyText}>In Preparation</span>
                                <div className={calendarStyles.csDot} />
                                <div className={calendarStyles.csDot} />
                                <div className={calendarStyles.csDot} />
                            </div>
                        </div>
                    </div>
                    <RandalSahayate />  
                </div>
            </div>
        </section>
    );
};

export default BooksPage;