"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../app/parichay/ParichayPage.module.css";

// ── Decorative SVG arch frame overlay ──────────────────────────────────────
const ArchFrame = () => (
    <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.archFrame}
        preserveAspectRatio="none"
    >
        {/* Outer arch */}
        <path
            d="M12 500 L12 120 Q12 12 200 12 Q388 12 388 120 L388 500"
            stroke="url(#arch-gold)"
            strokeWidth="3"
            fill="none"
            opacity="0.85"
        />
        {/* Inner arch */}
        <path
            d="M28 500 L28 125 Q28 30 200 30 Q372 30 372 125 L372 500"
            stroke="url(#arch-gold)"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
        />
        {/* Corner diamonds */}
        <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" fill="#FFD700" opacity="0.9" />
        <rect x="382" y="6" width="12" height="12" transform="rotate(45 388 12)" fill="#FFD700" opacity="0.9" />
        {/* Keystone */}
        <circle cx="200" cy="14" r="5" fill="#FFD700" opacity="0.9" />
        <circle cx="200" cy="14" r="3" fill="#FFF" opacity="0.5" />
        {/* Side decorative tick marks */}
        {[0.25, 0.45, 0.65, 0.85].map((t, i) => (
            <g key={i}>
                <line x1="12" y1={120 + t * 380} x2="28" y2={120 + t * 380} stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
                <line x1="372" y1={120 + t * 380} x2="388" y2={120 + t * 380} stroke="#FFD700" strokeWidth="1.2" opacity="0.5" />
            </g>
        ))}
        <defs>
            <linearGradient id="arch-gold" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FF6B00" />
                <stop offset="0.35" stopColor="#FFD700" />
                <stop offset="0.65" stopColor="#FF8C00" />
                <stop offset="1" stopColor="#FF6B00" />
            </linearGradient>
        </defs>
    </svg>
);

// ── Ornamental divider ─────────────────────────────────────────────────────
const OrnamentDivider = () => (
    <div className={styles.ornamentDivider}>
        <div className={`${styles.ornamentLine} ${styles.ornamentLineLeft}`} />
        <div className={styles.ornamentDiamond} />
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <ellipse cx="12" cy="15" rx="2.5" ry="5" fill="url(#od1)" />
            <ellipse cx="7" cy="14" rx="2" ry="4" transform="rotate(-25 7 14)" fill="url(#od2)" opacity="0.8" />
            <ellipse cx="17" cy="14" rx="2" ry="4" transform="rotate(25 17 14)" fill="url(#od2)" opacity="0.8" />
            <ellipse cx="3" cy="13" rx="1.5" ry="3" transform="rotate(-45 3 13)" fill="url(#od3)" opacity="0.6" />
            <ellipse cx="21" cy="13" rx="1.5" ry="3" transform="rotate(45 21 13)" fill="url(#od3)" opacity="0.6" />
            <defs>
                <linearGradient id="od1" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FF8C00" />
                </linearGradient>
                <linearGradient id="od2" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#FFB700" />
                    <stop offset="1" stopColor="#FF6B00" />
                </linearGradient>
                <linearGradient id="od3" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#FFA500" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#FF4500" stopOpacity="0.5" />
                </linearGradient>
            </defs>
        </svg>
        <div className={styles.ornamentDiamond} />
        <div className={`${styles.ornamentLine} ${styles.ornamentLineRight}`} />
    </div>
);

// ── Corner ornament ────────────────────────────────────────────────────────
const CornerOrnament = ({ flip = false }: { flip?: boolean }) => (
    <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        fill="none"
        className={`${styles.cornerOrnament} ${flip ? styles.cornerOrnamentRight : styles.cornerOrnamentLeft}`}
    >
        <path d="M4 66 L4 4 L66 4" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.7" />
        <path d="M4 4 L18 4 M4 4 L4 18" stroke="#FF8C00" strokeWidth="1.2" opacity="0.9" />
        <circle cx="4" cy="4" r="4" fill="#FFD700" />
        <circle cx="4" cy="4" r="2" fill="#FFF" opacity="0.6" />
        <path d="M4 28 Q18 28 18 4" stroke="#F5A623" strokeWidth="0.7" fill="none" opacity="0.4" />
        <path d="M4 42 Q32 42 32 4" stroke="#F5A623" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
);

// ── Page component ─────────────────────────────────────────────────────────
const ParichayPage = () => {
    const [visible, setVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>

            {/* Background decorations */}
            <div className={styles.dotGrid} />
            <div className={styles.radialGlow} />
            <div className={styles.omWatermark}>ॐ</div>
            <div className={styles.topGoldBar} />

            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                    <div className={styles.badge}>
                        <div className={styles.badgeDot} />
                        <span className={styles.badgeText}>॥ મંદિર વિશે ॥</span>
                    </div>

                    <h1 className={styles.title}>પરિચય</h1>

                    <OrnamentDivider />
                </div>

                {/* ── Content grid ── */}
                <div className={styles.grid}>

                    {/* Left: image */}
                    <div className={`${styles.imageCol} ${visible ? styles.visible : ""}`}>
                        <div className={styles.imageFrame}>
                            <ArchFrame />
                            <CornerOrnament />
                            <CornerOrnament flip />
                            <div className={styles.halo} />

                            <div className={styles.imageContainer}>
                                {imageLoaded && <div className={styles.imageShine} />}
                                <Image
                                    src="/images/banner-1.webp"
                                    alt="Shree Ravirandaldham Deity"
                                    width={500}
                                    height={650}
                                    className={styles.deityImage}
                                    onLoad={() => setImageLoaded(true)}
                                    priority
                                />
                            </div>

                            <div className={styles.frameBottomGradient} />
                        </div>

                        <p className={styles.imageCaption}>॥ દિવ્ય દર્શન ॥</p>
                    </div>

                    {/* Right: text */}
                    <div className={`${styles.textCol} ${visible ? styles.visible : ""}`}>
                        <div className={styles.contentCard}>
                            <div className={styles.contentCardAccentBar} />

                            <p className={styles.contentText}>
                                ભારતનાં ગુજરાત રાજ્યમાં અમદાવાદથી આશરે 140 કિલોમીટરનાં અંતરે બોટાદ જિલ્લાનાં બરવાળા
                                તાલુકામાં આવેલું તીર્થધામ સાળંગપુરધામ. ભગવાન સ્વામિનારાયણની પદરજ્થી પવિત્ર થયેલા
                                સાળંગપુરધામમાં સદગુરુ સંત ગોપાળાનંદ સ્વામીએ સંવત 1905માં શ્રીકષ્ટભંજનદેવ હનુમાનજી
                                મહારાજની મૂર્તિમાં પ્રાણ પ્રતિષ્ઠા કરી હતી. ગોપાળાનંદ સ્વામીએ યોગિક શક્તિઓની
                                મૂર્તિમાં હનુમાનદાદાનાં પ્રશક્ત તેજ અને થાપોનો આશિર્વાદ કર્યો કે તે મૂર્તિ કષ્ટણ
                                કરવા લાગો હતી. ત્યારથી આજ દિન પર્યંત સાળંગપુરધામમાં વિરાજતા શ્રીકષ્ટભંજનદેવ
                                હનુમાનજી સૌ કાંઇની આર્શિ, વ્યાધિ અને ઉપાધિ તમામ કષ્ટ દૂર કરે છે. શ્રી
                                સ્વામિનારાયણ મંદિર વડતાલધામ દ્વારા શ્રીકષ્ટભંજનદેવ હનુમાનજી મંદિર,
                                સાળંગપુરધામનું સંચાલન થાય છે.
                            </p>

                            <div className={styles.contentCardFooter}>
                                <div className={styles.footerDiamond} />
                                <div className={styles.footerLine} />
                            </div>

                            <p className={styles.blessing}>
                                ॥ જય શ્રી કષ્ટભંજનદેવ હનુમાનજી મહારાજ ॥
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ParichayPage;