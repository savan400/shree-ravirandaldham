"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../app/akshaypari-bapu/AdaypatiBapuPage.module.css";

const AdaypatiBapuPage = () => {
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
            {/* Background elements */}
            <div className={styles.bgGrid} />
            <div className={styles.bgGlow} />
            <div className={styles.bgOm}>ॐ</div>
            <div className={styles.topBar} />

            <div className={styles.container}>
                {/* ── Header ── */}
                <div className={visibleClass("header")}>
                    <div className={styles.badge}>
                        <div className={styles.badgeDot} />
                        <span className={styles.badgeText}>॥ મહંત શ્રી રવિ રાંદલધામદડવા ॥</span>
                    </div>

                    <h1 className={styles.title}>ધર્મ સાંસદ શ્રી 1008 અક્ષયપરી બાપુ</h1>

                    <div className={styles.divider}>
                        <div className={styles.dividerLine} />
                        <div className={styles.dividerDiamond} />
                        <LotusSvg />
                        <div className={styles.dividerDiamond} />
                        <div className={styles.dividerLine} />
                    </div>
                </div>

                {/* ── Content Grid ── */}
                <div className={styles.grid}>
                    {/* Left: Image Card */}
                    <div className={visibleClass("imageWrapper")} style={{ position: 'sticky', top: '150px' }}>
                        <div className={styles.imageCard} >
                            <svg
                                className={styles.imageFrameTop}
                                viewBox="0 0 300 40"
                                fill="none"
                            >
                                <path
                                    d="M10 40 L10 20 Q150 -10 290 20 L290 40"
                                    fill="url(#frameGradTop)"
                                    opacity="0.15"
                                />
                                <path
                                    d="M0 4 Q150 -10 300 4"
                                    stroke="#FFD700"
                                    strokeWidth="2"
                                    opacity="0.7"
                                />
                                <circle cx="150" cy="-2" r="4" fill="#FFD700" opacity="0.8" />
                                <defs>
                                    <linearGradient id="frameGradTop" x1="0" y1="0" x2="0" y2="1">
                                        <stop stopColor="#FFD700" />
                                        <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className={`${styles.cornerOrnament} ${styles.cornerTl}`} />
                            <div className={`${styles.cornerOrnament} ${styles.cornerTr}`} />

                            <div className={styles.imageContainer}>
                                {imageLoaded && <div className={styles.imageShine} />}
                                <Image
                                    src="/images/akshaypari-bapu.jpeg"
                                    alt="akshaypari-bapu"
                                    width={400}
                                    height={520}
                                    className={styles.saintImage}
                                    onLoad={() => setImageLoaded(true)}
                                    priority
                                />
                            </div>

                            <div className={styles.imageCaption}>
                                <span className={styles.captionText}>
                                    શ્રી 1008 અક્ષયપરી બાપુ
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className={visibleClass("content")}>
                        <div className={styles.contentIntro}>
                            <p className={styles.introText}>
                                અનંત જીવોનાં કલ્યાણ કરવાનાં ભગવાન શ્રી સ્વામિનારાયણનાં
                                સંકલ્પને સિદ્ધ કરવા અનેક મુકતાઓએ જન્મ ધારણ કર્યો હતો.
                            </p>
                            <p className={styles.introText}>
                                પાંચસો પરમહંસોમાં સૂર્યની જેમ ચમકતા યોગીરાજ ગોપાળાનંદ
                                સ્વામીમાં જન્મસિદ્ધ યોગકળા હતી. અનેક ઐશ્વર્ય અને સામર્થ્યનાં
                                સ્વામી હોવા છતાં ભગવાન પ્રત્યે દાસભાવપણે અને તેમની આજ્ઞાવી
                                આળખ હતી.
                            </p>
                        </div>

                        <div className={styles.contentCard}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.contentSection}>
                                <h2 className={styles.sectionTitle}>જીવનવૃતાંત</h2>
                                <div className={styles.sectionText}>
                                    <p>
                                        ભગવાન સ્વામિનારાયણુ પ્રતિનિધિત્વ કરતાં આ અનાદિ મુકતરાજને
                                        જન્મ વિકમ સંવત 1837માં મહારાષ્ટ્ર હનાં સોમવારે ગુજરાતનાં
                                        સાબરકાંઠા જિલ્લાનાં ભિલોડા તાલુકાનાં ટોડરા ગામે થયો હતો.
                                        બાળપણ પરિવાર પિતા મોતીરામ ભટ્ટ અને માતા ધુળાદાઈને ત્યાં
                                        તેમનો જન્મ થયો અને બાળપણનું નામ શંખવામાં આવ્યું – ખુશાલ.
                                        ગૌર વર્ણ અને તેજસ્વી મુખમુક્તિ ધરાવતાં આ બાળકનાં
                                        જન્મજાત લક્ષણો પ્રચલિત દિરણો ફૂટે તેમ એક પછી એક
                                        પ્રકાશવા લાગ્યાં.
                                    </p>
                                    <p>
                                        પૂર્વનાં યોગાભ્યાસી ખુશાલ સદાય ટોડરા ગામનાં પાદરે
                                        વહેતી નદીનાં કિનારે આવેલાં મહાદેવનાં દેશ પાસે
                                        ધ્યાનમગ્ન બેસી રહેતાં. તો કયારેક સોસામાણી પર્વતમાળાનો
                                        કેદરામાં જઈને તપ કરતાં. ભક્તિ અને યોગની કાંતિ તેમનાં
                                        મુખમંડિત ઉપર સહેજ કરવાતી.
                                    </p>
                                    <p>
                                        અસાધારણ બુદ્ધિપ્રતિભા ધરાવતાં ખુશાલ ભટ્ટ શિક્ષા ગ્રહણ
                                        પછી ટોડરા ગામમાં પાઠશાળા શરૂ કરી. અહીં તેઓ બાળકોને
                                        જ્ઞાન પહંચાનાં સાથે ભગવદ્ભક્તિનાં પાઠો પણ ભણાવતાં. ધુન,
                                        કીર્તન, શાસ્ત્રમાં નિત્યનિમિત ભગવાનનાં ચરિત્રોનું
                                        અધ્યયન પણ કરાવતાં.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className={visibleClass("footer")}>
                    <div className={styles.footerOrnament}>
                        <div className={styles.footerLine} />
                        <div className={styles.footerDiamond} />
                        <div className={styles.footerDiamondLarge} />
                        <div className={styles.footerDiamond} />
                        <div className={styles.footerLine} />
                    </div>
                    <p className={styles.footerBlessing}>
                        ॥ જય સદગુરુ શ્રી ગોપાળાનંદ સ્વામી ॥
                    </p>
                </div>
            </div>
        </section>
    );
};

/* ── Lotus SVG (extracted to keep JSX clean) ── */
const LotusSvg = () => (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
        <ellipse cx="12" cy="15" rx="2.5" ry="5" fill="url(#lotus1)" />
        <ellipse
            cx="7" cy="14" rx="2" ry="4"
            transform="rotate(-25 7 14)"
            fill="url(#lotus2)"
            opacity="0.8"
        />
        <ellipse
            cx="17" cy="14" rx="2" ry="4"
            transform="rotate(25 17 14)"
            fill="url(#lotus2)"
            opacity="0.8"
        />
        <defs>
            <linearGradient id="lotus1" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFD700" />
                <stop offset="1" stopColor="#FF8C00" />
            </linearGradient>
            <linearGradient id="lotus2" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FFB700" />
                <stop offset="1" stopColor="#FF6B00" />
            </linearGradient>
        </defs>
    </svg>
);

export default AdaypatiBapuPage;