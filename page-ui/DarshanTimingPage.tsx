"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import dStyles from "@/app/[locale]/upasna-vidhi/darshan-timing/DarshanTimingPage.module.css";
import LotusSvg from "@/components/LotusSvg";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";

const DarshanTimingPage = () => {

    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    const darshanTimings = [
        {
            label: "શણગાર આરતી",
            time: "(સોમ, બુધ, ગુરુ, શુક અને રવિ) સવારે 05:45 કલાકે",
        },
        {
            label: "મંગળા આરતી",
            time: "(શનિ, મંગળ અને પૂનમનાં દિવસે) સવારે 05:30 કલાકે",
        },
        {
            label: "શણગાર આરતી",
            time: "(શનિ, મંગળ અને પૂનમનાં દિવસે) સવારે 07:00 કલાકે",
        },
        {
            label: "રાજભોગ થાળ",
            time: "(દર્શન બંધ) સવારે 10:30 થી 11:15 કલાક",
        },
        {
            label: "દર્શન બંધ:",
            time: "બપોરે 12:00 થી 3:30 કલાક",
        },
        {
            label: "સંધ્યા આરતી:",
            time: "સાંજે 06:30 કલાકે",
        },
        {
            label: "થાળ",
            time: "(દર્શન બંધ) સાંજે 07:15 થી 08:15 કલાક",
        },
        {
            label: "શયન",
            time: "(દર્શન બંધ) રાતે 09:00 થી સવારે 05:30 કલાક",
        },
    ];

    return (
        <>
            <section ref={sectionRef} className={styles.section}>
                <PageBackgroundDecorations />
                <div className={styles.container}>
                    {/* ── Header ── */}
                    <div className={visibleClass("header", visible)}>
                        <CommonTitle text="દિવ્ય દર્શનનો સમય" />
                        <LotusDivider />

                    </div>
                    <div className={dStyles.grid}>
                        {/* Temple Image */}
                        <div className={dStyles.templeImageWrapper}>
                            <div className={dStyles.templeImageCard}>
                                <div className={`${dStyles.cornerOrnament} ${dStyles.cornerTl}`} />
                                <div className={`${dStyles.cornerOrnament} ${dStyles.cornerTr}`} />
                                <div className={`${dStyles.cornerOrnament} ${dStyles.cornerBl}`} />
                                <div className={`${dStyles.cornerOrnament} ${dStyles.cornerBr}`} />
                                <Image
                                    src="/images/banner-2.webp"
                                    alt="શ્રી કષ્ટભંજન હનુમાનજી દાદા"
                                    width={400}
                                    height={440}
                                    className={dStyles.templeImage}
                                    priority
                                />
                            </div>
                        </div>

                        {/* Timing Content */}
                        <div className={dStyles.timingContent}>
                            <div className={dStyles.timingTable}>
                                {darshanTimings.map((item, i) => (
                                    <div key={i} className={dStyles.timingRow}>
                                        <span className={dStyles.timingLabel}>{item.label}</span>
                                        <span className={dStyles.timingValue}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <RandalSahayate />
                </div>
            </section>
        </>
    );
};

export default DarshanTimingPage;