"use client";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/[locale]/ravirandaldham/itihas/Itihaspage.module.css";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";


// ── Decorative quote mark SVG ──────────────────────────────────────────────
const QuoteMark = ({ flip = false }: { flip?: boolean }) => (
    <svg
        width="32"
        height="28"
        viewBox="0 0 32 28"
        fill="none"
        className={flip ? styles.quoteMarkFlipped : styles.quoteMark}
    >
        <path d="M2 24 Q2 4 14 4 L14 12 Q7 12 7 20 L14 20 L14 24 Z" fill="url(#qm1)" />
        <path d="M18 24 Q18 4 30 4 L30 12 Q23 12 23 20 L30 20 L30 24 Z" fill="url(#qm1)" />
        <defs>
            <linearGradient id="qm1" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FF6B00" />
                <stop offset="1" stopColor="#FFD700" />
            </linearGradient>
        </defs>
    </svg>
);

// ── Section number badge ───────────────────────────────────────────────────
const SectionBadge = ({ number }: { number: string }) => (
    <div className={styles.sectionBadge}>{number}</div>
);

// ── Page component ─────────────────────────────────────────────────────────
const MahimaPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    const paragraphs = [
        "175 વર્ષથી શ્રીકષ્ટભંજનદેવ હનુમાનજી અહીં સાળંગપુરધામમાં પ્રત્યક્ષ બિરાજે છે.",
        "શ્રી કષ્ટભંજનદેવની શરણમાં આવેલો જીવ ક્યારેય ખાલી હાથે પાછો ગયો નથી. તેમની મનોકામના સદૈવ પૂર્ણ થઈ છે. દાદાનાં દર્શન, સાધના અને સેવાથી એવા એક નહીં પણ અસંખ્ય માનવીઓ અને પરિવારોએ શાંતિ, સુરક્ષા અને સુખ મેળવ્યાં છે. દેશ-વિદેશની અગણિત પેઢીઓ હનુમાનજીનાં આશીર્વાદ થકી સમૃદ્ધ થઈ છે.",
        "સંપૂર્ણ સંસારમાં સાળંગપુરનિવાસી કષ્ટભંજનદેવનો મહિમા સુવિદિત છે. આ મહિમાને કર્ણ પરંપરાથી સાંભળીને અનેક જાત-પાતનાં લોકો અહીં આવે છે અને સુખી થાય છે. જે કોઈ દીનદુઃખી અહીં આવે છે તેમની પીડા દૂર કરે છે હનુમાનદાદા. અહીં મનુષ્યો રોતા રોતા આવે છે પણ ભગવાન શ્રીસ્વામિનારાયણ અને હનુમાનજી મહારાજનાં પ્રતાપથી હસતા હસતા જાય છે. અહીં કોઈ પણ પ્રકારનાં ભેદભાવ વિના સૌનાં કષ્ટોનું નિવારણ થાય છે.",
        "અહીં આવતાં શ્રદ્ધાળુ યાત્રિકો માટે રોકાવાની અને ભોજનની સુવિધા દરેક વર્ગનાં લોકોને અનુકુળ આવે તે રીતે આયોજિત કરવામાં આવી છે. જીવનમાં પ્રારબ્ધવશ અથવા અન્ય કોઈ કારણોસર આવેલું દુઃખ અહીં શ્રીહનુમાનજી મહારાજનાં દર્શન માત્રથી નિવૃત્ત થાય છે.",
        "શ્રીકષ્ટભંજનદેવનાં મહિમાનું જેટલું ગાન કરીએ તેટલું અલ્પ જ રહેશે. આથી પોતાના જીવનમાં, પોતાનાં પરિવારમાં, સંબંધીઓ કે મિત્રમંડળમાં જ્યારે કોઈપણ પ્રકારનું કષ્ટ આવે ત્યારે સંકોચ વિના શ્રીકષ્ટભંજનદેવનાં શરણમાં આવી આ પ્રત્યક્ષ દેવનો સ્વંય અનુભવ કરી શાંતિ, સલામતી અને સુખની અનુભૂતિ મેળવો.",
        "“શ્રદ્ધા કા દૂસરા નામ શ્રી રવિરાંદલધામ.”.",
    ];

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                    <CommonBadge text="ઐતિહાસિક પૃષ્ઠભૂમિ" />
                    <CommonTitle text="મહિમા" />
                    <LotusDivider />
                </div>

                {/* ── Content card ── */}
                <div className={`${styles.contentCard} ${visible ? styles.visible : ""}`}>
                    <div className={styles.contentCardTopBar} />

                    {/* Paragraphs */}
                    <div>
                        {paragraphs.map((para, i) => (
                            <div
                                key={i}
                                className={`${styles.paraWrapper} ${visible ? styles.visible : ""}`}
                                style={{ "--delay": `${0.4 + i * 0.08}s` } as React.CSSProperties}
                            >
                                {i === 5 ? (
                                    /* Special highlighted quote paragraph */
                                    <div className={styles.quoteBlock}>
                                        <div className={styles.quoteMarkTopLeft}>
                                            <QuoteMark />
                                        </div>
                                        <p className={styles.quoteParagraph}>{para}</p>
                                        <div className={styles.quoteMarkBottomRight}>
                                            <QuoteMark flip />
                                        </div>
                                    </div>
                                ) : (
                                    <p
                                        className={styles.paragraph}
                                        style={{ marginBottom: i < paragraphs.length - 1 ? undefined : 0 }}
                                    >
                                        {para}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    <RandalSahayate />
                </div>

            </div>
        </section>
    );
};

export default MahimaPage;