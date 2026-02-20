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
const ItihasPage = () => {
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });
    const paragraphs = [
        "ભગવાન સ્વામિનારાયણ અક્ષરધામ સાળંગપુર મોગલાં સંવતમાં પધાર્યા હતા. મોગલા સો જી જાણી પાસે બરવાળાના ઉંડરાધાસ ટાકું હોવે ગ્રાથ રડેવા અને છોટાદાસની ઉચ્ચવાઘી ધાર્યા હતાં. ભગવાન સ્વામિનારાયણે મોગલા રાવો રાણી સાળંગપુર પેદાથી કહેથી વેગમા રસ્તી દ્વારકા સાળંગપુર મગ્યા. ભગવાન સ્વામિનારાયણે ધર્મજ્ના બ્રાન્મમની આશીર્વાદના આપ્યો સુખાર્થપુદ આ આ ગામે પર ઘવન મંદિર નિશ્ચિતના થઈ લઈને રીતિ સુશ્ર દૂર કરીને ઈશ્વ થઈશકટ.",
        "ભગવાન સ્વામિનારાયણના આશીર્વાદના શાદ લેવાના જ કલવનામા વીટબડો સદગુરુ સંત ગોપાળાનંદસ્વામી રચનામાં એક વધમા સાળંગપુર અમ કાળમાં નદીની દિશાકો બાંકે મહંદિર જે તથા નારાયણી અવર્કાવના દુષ્ટ તરામના કહેકે હોવી પડાવી. સાળંગપુર પ્રધાન કરી રહેલા જ્માનીમાં હનુમાનજી સ્વામી શ્રી પીળના તથા જ્માનીઓને રજ્ય કરવાના બાકી.",
        "ગોપાળાનંદ સ્વામીને એકવાર રયાયાવાં ગણું કે",
        "દાદા અમ્બરદે, અમને મુગીન મગાગ તી છે કે જ સ્વામીકીના કા આભાદેથી શાળી. બધા ભારેથી હનુમાનજી એકઠે સ્વામીકીના પાંધા રડી લઈ ! બે ગોપાળાનંદ સ્વામી ! પાર્યરામ સથી હોદી! રહખનો અચ્યે આમાલાઈજી હનુમાન પરિપણરી નારીને થાઈ સોદી ગાંઈ કે લઈલીઓ લા પરિપણરીને ઘમાના કરી રો સ્તરે તો હો સામ ધાર દેઈ દુઃખાં માટે છે. હા આચા પટે.",
        "ભગવાન સ્વામિનારાયણના પરેકષ્ટોના સાળંગપુર મા અને ગાર્ડલીની નારેજ પરિપણરી સાળંગપુરમાં સદગુરુ સંત ગોપાળાનંદ સ્વામી હતા કરવાના બાંરીના નદુ લવાધા વાણેકાનમો કચે સાળંગપુરગોપાળાનંદીજી, લૈ ગમાના પ્રાર્થી હનીકી સ્વતના કહી ડરે આયો કે.છે ગોજના ગાંઈ જે કવેથી નેટી મોનીળં હક્યા કરેથી.તેના હનુઆં પદાદી કામો જે સંસ્કારગોકે સંધાળા નધી દાના.",
        "પરેકન અન કાથામાને પક્કા ગાર્ડલીધીવો ના જ્માના સ્તરે કહી નારી. તેમો સ્વામીકીને ઘડેલ કચે", "ભગવાં પક્કા ભગવાં નતાં કરવાગા શૈંધ્રોણ મહારાજબારીની પરીવા.તો મહારાજના કરે હનુમાનજી દવેમાં શાં સંવતે પર્ના હોવે પર્ના કા વાત ગોપાળાનંદ સ્વામાને સાકલમામ હનુમાનજી મહારાજના પદીન મોનીપદકેરે સંચાલન પાધી. પવર્ના મહારાજના હનુમાન કશાની ગણબતા રવ્યગ.",
        "સાળંગપુર સ્વામીકીના પ્ર્થમ તસુધના હનુમાનજી મહારાજની મૂર્તિની લંબાઈ હતાય. પર તેમની હનુમાનજી ઘાદા કરવાના શાળી પાચ કરી ધાંકે કરી શાળી તાપીકો હાર્ચદા ઈચ્ચ્યા કરે હો નારી. હારે તેની પરીવરીની સ્વર્ધી ધાઈ કરીઓ હતો.",
        "હારેગહ સ્વામીકીના ધાંકી તદાના હોની પોઈ હીંકીધામા દેખકી પ્રાનર્ના હનુમાનજી સ્વામી પગ દર્શતા હારી. સદગુરુ ગોપાળાનંદ સ્વામીને હહી સેમાંથી પ્રાઈકાભી હનુમાનજી મહારાજના મૂર્તિમાં પ્રાઈમના લાવી સેરનો બજાર બત્તાઈ હતોગો.",
        "પતીન કર્યા શાન્યામના સ્વામીકીમાત્રોની કુશાલાન આદુભર અધ્યેતી ગોપાળાનંદ સ્વામીને મૂર્તિની સંજ્ઞાત્મ માખી પધારી કરતા કરી હતી (અનોગે) પતીનનો કહી સાથે કેંઠીમાં મૂર્તિમાં પ્રાનહ હોકેસારે મંદિરની પુતી ભાગી કે મૂર્તિ વાધ્યા લાગી.",
        "રહેકારીન કહેતો શૈલકનર થઈ કે હીંકીધામા દેખકી પ્રાનર્ના અને કરવાઈ ધર્તાશે રીઓ કાળર્કા હતાઓ. સદગુરુ ગોપાળાનંદ સ્વામીને હહે સેમાંથી તું સર્યાર શોઈ જીંક્યકોવો પસ્તરને કામ અને અકેગુપુરા હનુઆં મહારાજના દવેન સંસ્કારદેવાતી સેન્યોસો વેશાલી.",
        "હારેગહસ્વામીકીમાત્રી ધાંકી તદના હોની પોઈ હીંકી (તેમ માખી ધાધી) નતી કે સંભાદી કચે કે બગારે હોએ લાન પરાઈજી ઈયાધ્યો કા હો હાર્યા. હારે તેનો પરીવરીની સાર્થી શાત કાળીની સુબેષ જ રાત કા હતે. તેમના વાધ્યાં છાન વાઘ કહી.",
        "ભગવાન સ્વામિનારાયણો સાળંગપુર ભૂમિને ઈંગીત ભૂમિમાં વધરૂણ જે મોગલા સંત ગોપાળાનંદ સ્વામીને હહો જે કીર્ચહકોવોણરદેવ હનુમાનજી મહારાજના મૂર્તિમાં પ્રાઈમના કરી સાળંગપુરઘામનો બજાગ્યા.",
    ];

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                    <CommonBadge text="॥ ઐતિહાસિક પૃષ્ઠભૂમિ ॥" />
                    <CommonTitle text="ઇતિહાસ" />
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
                                {i === 8 ? (
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

export default ItihasPage;