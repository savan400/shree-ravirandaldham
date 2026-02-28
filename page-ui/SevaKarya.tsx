"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/app/[locale]/ravirandaldham/parichay/ParichayPage.module.css";
import FacilityCard, { FacilityCardData } from "@/components/FacilitiesCards/Facilitycard";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";


const FACILITIES: FacilityCardData[] = [

    {
        image: "/images/seva-1.jpg",
        title: "ગૌ શાળા",
        description:
            "7 વિઘાથી વધુ જગ્યામાં શ્રીકષ્ટભંજનદેવ હનુમાનજી મંદિર સાળંગપુરધામ દ્વારા સુંદર ગૌશાળાનું નિર્માણ કરવામાં આવ્યું છે. જેમાં અસલ ગીર ઓલાદની 100થી વધુ ગાયો અને વાછરડાઓનો ઉછેર કરવામાં આવે છે.",
        icon: "🐄",
        tag: "ગૌ સેવા",
        accentColor: "#4CAF50",
        navigateTo: '/seva-karya/gaushala'

    },
    {
        image: "/images/seva-2.jpg",
        title: "યુવા સત્સંગ કેન્દ્ર",
        description:
            "શ્રીકષ્ટભંજનદેવ હનુમાનજી મંદિર સાળંગપુરધામમાં વ્યાપક સંત પૂજ્ય સ્વામીશ્રી હરિપ્રકાશદાસ - અથાણાવાળા દ્વારા યુવાનોમાં સત્સંગ, સંસ્કાર, સંસ્કૃતિ અને સર્વાંગી વિકાસનું મૂળ્યોનું સિંચન થાય તેવા ઉત્તમ નાગરીકો બને તે માટે યુવા સત્સંગ કેન્દ્રની સ્થાપના કરવામાં આવી છે.",
        icon: "🙏",
        tag: "યુવા વિકાસ",
        accentColor: "#9C27B0",
        navigateTo: '/seva-karya/yuva-satsang-kendra'
    },
    {
        image: "/images/seva-3.jpg",
        title: "શૈક્ષણિક કીટ",
        description:
            "વિદ્યાર્થીઓને વિનામૂલ્યે શૈક્ષણિક કીટ વિતરણ કરવામાં આવે છે.",
        icon: "📚",
        tag: "શિક્ષણ સેવા",
        accentColor: "#2196F3",
        navigateTo: '/seva-karya/shaikshanik-kit'
    },
    {
        image: "/images/seva-4.jpg",
        title: "મહત્તવપૂર્ણ સમગ્ર લગ્મ",
        description:
            "આર્થિક રીતે નબળા વર્ગના લોકો માટે મંદિર ટ્રસ્ટ દ્વારા વિનામૂલ્યે ભવ્ય સમૂહ લગ્નનું આયોજન કરવામાં આવે છે.",
        icon: "💍",
        tag: "સામાજિક સેવા",
        accentColor: "#E91E63",
        navigateTo: '/seva-karya/samuh-lagna'
    },
    {
        image: "/images/seva-5.jpg",
        title: "કુદરતી હોનારતમાં રાહતકાર્ય",
        description:
            "કુદરતી હોનારત સમયે સાળંગપુરધામ દ્વારા સદાય સંતો અને સ્વયંસેવકો દ્વારા રાહતકાર્ય કરવામાં આવે છે.",
        icon: "🆘",
        tag: "રાહત સેવા",
        accentColor: "#FF5722",
        navigateTo: '/seva-karya/rahat-karya'
    },
    {
        image: "/images/seva-6.jpg",
        title: "મેડિકલ કેમ્પ",
        description:
            "સ્વાસ્થ્ય રક્ષા માટે સદાય જાગૃત પૂજ્ય સંતો દ્વારા મંદિર પરિસરમાં નિયમિત રીતે નિ:શુલ્ક રોગ નિદાન કેમ્પ તેમજ ફ્રી મેડિકલ ચેક અપ કેમ્પ આયોજિત કરવામાં આવે છે.",
        icon: "🏥",
        tag: "આરોગ્ય સેવા",
        accentColor: "#00BCD4",
        navigateTo: '/seva-karya/medical-camp'
    },
];
// ── Page component ─────────────────────────────────────────────────────────
const SevaKarya = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });
    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={visibleClass("header", visible)}>
                    <CommonBadge text="॥ મંદિર વિશે ॥" />
                    <CommonTitle text="Seva Karya" />

                    <LotusDivider />
                </div>

                {/* ── Content grid ── */}
                <div className={styles.grid}>

                    {FACILITIES.map((facility, i) => (
                        <FacilityCard
                            key={facility.title}
                            facility={facility}
                            index={i}
                            visible={visible}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
};

export default SevaKarya;