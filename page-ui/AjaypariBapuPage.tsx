"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../app/akshaypari-bapu/AdaypatiBapuPage.module.css";
import LotusSvg from "@/components/LotusSvg";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import CommonImageProfileCard from "@/components/CommonImageProfileCard/CommonImageProfileCard";

const AjaypariBapuPage = () => {
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
                {/* ── Header ── */}
                <div className={visibleClass("header")}>
                    <CommonBadge text="॥ મહંત શ્રી ॥" />
                    <CommonTitle text="અજયપૂરી બાપુ" />
                    <LotusDivider />
                </div>

                {/* ── Content Grid ── */}
                <div className={styles.grid}>
                    {/* Left: Image Card */}
                    <div className={visibleClass("imageWrapper")} style={{ position: 'sticky', top: '150px' }}>
                        <CommonImageProfileCard
                            src="/images/ajaypari-bapu.jpeg"
                            alt="akshaypari-bapu"
                            caption="શ્રી અજયપૂરી બાપુ"
                            priority
                        />
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
                    <DiamondDivider />
                    <p className={styles.footerBlessing} style={{ marginTop: '20px' }}>
                        ॥ જય સદગુરુ શ્રી ગોપાળાનંદ સ્વામી ॥
                    </p>
                </div>
            </div>
        </section>
    );
};


export default AjaypariBapuPage;