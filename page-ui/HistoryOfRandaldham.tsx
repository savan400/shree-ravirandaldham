"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../app/[locale]/ravirandaldham/parichay/ParichayPage.module.css";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";


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
const HistoryOfRandaldham = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    return (
        <>
            <section ref={sectionRef} className={styles.section}>
                <PageBackgroundDecorations />
                <div className={styles.container}>
                    {/* ── Header ── */}
                    <div className={visibleClass("header", visible)}>
                        <CommonBadge text="દડવામાં બિરાજમાન રવિરાંદલ માતાનો મહિમા અનેરો" />
                        <CommonTitle text="History Of Randaldham" />
                        <LotusDivider />
                    </div>
                    {/* ── Content grid ── */}
                    <div className={styles.grid}>

                        {/* Left: image */}
                        <div className="sticky-img-class">
                            <div className={`${styles.imageCol} ${visible ? styles.visible : ""}`}>
                                <div className={styles.imageFrame}>
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
                            </div>
                        </div>

                        {/* Right: text */}
                        <div className={`${styles.textCol} ${visible ? styles.visible : ""}`}>
                            <div className={styles.contentCard}>
                                <div className={styles.contentCardAccentBar} />

                                <p className={styles.contentText}>
                                    ભારત વર્ષ ના ઇતિહાસ માં ભગવાન શ્રી રવિરાંદલ એવી દેવી છે, કે જે 18 જાતી (વરણ) ના દેવી માનવમા આવે છે. તે સ્વંભુ શ્રી ભગવાન સૂર્યનારાયણ ના ધર્મ પત્ની છે. આપણી ભારતીય સંસ્કૃતિમાં દેવીઓનો ખુબ મહિમા શાસ્ત્રોમાં પણ ગવાયો છે. આથી શ્રી રવિરાંદલ માતાજી નુ મંદિર ભાવનગર જીલ્લા મા, ધોળા જંકશન નજીક દડવા ગામે આવલુ છે. એ રાંદલના દડવા તરીકે ઓળખાય છે. જ્યા સાક્ષાત રાંદલમા સ્વયંભુ બિરાજમાન છે.
                                </p>
                                <p className={styles.contentText}>દડવા માતાજીનું મૂળ સ્થાન છે અને કેવી રીતે બિરાજમાન થયા માતા રાંદલ દડવા ગામમાં,</p>
                                <p className={styles.contentText}>રાંદલ માતા એ સાક્ષાત સૂર્યનારાયણના ધર્મપત્ની એટલે જ તે રન્નાદે દે તરીકે પણ ઓળખાય છે  સાથોસાથ યજ્ઞ શિલ્પી ભગવાન વિશ્વકર્માના પુત્રી છે તથા યમ અને યમુનાના માતા છે. વિશ્વકર્માએપોતાની પુત્રી રાંદલના વિવાહ સૂર્યનારાયણ સાથે કરાવ્યા હતા. સૂર્યનારાયણ ભગવાને રાંદલ માતાજી ને પૃથ્વી લોકમા જવાનુ કહિ ને અધર્મી વાળા મનુષ્ય ને ધર્મ પર લાવવાનું કામ સોપ્યુ રાંદલ માતા એક નાની બાળકી સ્વરૂપે રણ માં આવ્યા ત્યારે ગુજરાત માં ભયંકર દુષ્કાળ હતો માલધારીઓ દુકાળ ઉતારવા કાઠિયાવાડ ભણી જતા હતા રસ્તામા રાંદલ માતાજી બાળકી સ્વરૂપે મળે છે માલધારીઓ બાળા ને ભાગ્યશાળી માની ને પોતાની સાથે રાખે છે રાંદલ માતાજી ની કૃપા થી ખુબ જ વરસાદ થાય છે માલધારીઓ આ બાળાને રણમાથી મળી હોવાથી તેનુ નામ રાંદલ રાખે છે જ્યારથી આં બાળા માલધારીઓ સાથે આવી છે ત્યાર થી નેહડામાં ચમત્કાર થાય છે અપંગ,આંધળા ,કોઢિયા , રક્તપિત જેવા રોગ થી પીડાતા લોકો સાવ સાજા સારા થઈ જાય છે છતાં પણ માલધારીઓ આં દિવ્યતા ને ઓળખી શકતા નથી પોતાના સાચા સ્વરૂપથી પરિચિત કરવાનો માતાજી નિશ્ર્ય કરે છે આવા નિશ્ર્ય થી માતાજી બાજુના ગામમા જાય છે ત્યારે તેવો જુએ છે કે રાજા રોજ પોતાના સિપાહીઓને આ ગામમા જ દૂધ તથા દહી ની વસૂલી કરવા મોકલે છે આ બધુ જોઈ ને માતાજી એ સોળવર્ષ ની સુંદર કન્યા નું રૂપ લીધુ સિપાહીઓ એ આ કન્યા ને જોઈ એના વિશે ની વાત રાજા ને કરી રાજાએ સિપાહીઓને સુંદર કન્યા ને રાજ માં લહી આવવાનો આદેશ આપ્યો આ સુંદર કન્યા ને શોધવા સિપાહીઓ નીકળી પડ્યા પણ આખાય ગામમા એ સુંદરી જોવા મળી નહિ જેથી રાજા ક્રોધિત થઈ ને આ ગામ પર ચડાઈ કરે છે ત્યારે માલધારીઓ ની વારે માતાજી આવ્યા તેમણે ધૂળનો એક મોટો વંટોળ ઊભો કર્યો જેમાં રાજા ની સેના દળાય ગઈ આદ્યશક્તિ જગદંબા માતા એક વિકરાળ સ્વરૂપે પ્રગટ થયા અહી રાજા ની સેના દળાય ગઈ હોવાથી આ ગામનું નામ દડવા પડયુ લોકો માં આં જોઈ ને ખુશી ની લાગણી શવાઈ ગઈ તેવો માતાજી ને પોતાની સાથે જ રહી જવા વિનંતી કરે છે અને માતા માલધારીઓ ને દડવા માં પોતાનુ મંદિર સ્થાપવાનું કહે છે અને વરદાન આપે છે જે કોઈ વ્યક્તિ સાચી શ્રદ્ધા અને વિશ્વાસ થી મારી ભક્તિ કરશે તેમના દુ:ખડા દૂર કરીશ ત્યાર થી દડવા ગામ માં ભગવતી રાંદલ માતાજી નુ મંદિર સ્થાપિત છે</p>
                                <p className={styles.contentText}>અહી રાંદલ માતાના મંદિર સામે જ સૂર્યનારાયણ અશ્વરૂપે બિરાજમાન છે દંતકથા અનુસાર સૂર્યદેવના પત્ની રાંદલ છે પણ પતિના તાપને સહન ન કરી શકતા હોવાથી, માતાએ પોતાની તપસ્યાથી પોતાના જ રૂપવાળી છાયા બનાવી, છાયા નામ આપી સૂર્યદેવ, યમ અને યમુનાની જવાબદારી છાયાને સોપી તપ કરવા માટે જંગલમાં નીકળી જાય છે અને તપની જાણ સૂર્યદેવને થતા તેઓ પણ અશ્વ સ્વરૂપે માતાની પાસે આવી તપ ભંગ કરાવે છે અને કારણ પુછે છે ત્યારે સૂર્યદેવ પોતાની ૧૬ કળામાંથીએક કળા ઓછી કરે છે ત્યારે ત્રીદેવો સાથે સર્વ દેવો ત્યાં આવી રાંદલમાતાને વરદાન આપે છે હે દેવી તમે સર્વ જગત માટે આ કાર્ય કર્યું છે માટે અમારી પૂજા થશે તેની પહેલા તમારી પૂજા થશે, આ સમયે છાયા પણ ત્યાં આવી! રાંદલ માતાજી ને વિનંતિ કરે છે મારે શું કરવું, ત્યારે રાંદલ માતા કહે છે હે દેવી તમે મને મદદરૂપ બન્યા છો માટે મારી સાથે તમારી પણ પૂજા થશે એટલે જ રાંદલમાતાના ૨ લોટા તેડવામાં આવે છે. એમાં એક લોટો રાંદલમાતાનો અને બીજો લોટો છાયાનો, સાથે સૂર્ય નારાયણે પણ દેવીને વચન આપ્યું કે જે કોઈ રાંદલના લોટા તેડશે ત્યારે હું તેના કાર્યને સિધ્ધ કરવા ઘોડો ખૂંદતો આવીશ એટલે જ તો શુંભ અવસરે રાંદલ માતાના લોટા તેડી ઘોડો પણ ખૂંદવામાં આવે છે.</p>
                                <p className={styles.contentText}>ભક્તોની મનોકામના પૂર્ણ કરતા હોવાથી દડવાની દાતાર તરીકે જગપ્રસિધ્ધ થયા, અહી મંદિરમાં પણ ભક્તો લોટા તેડવા આવે છે, ધજા ચડાવવાની વિધિ, બાળકોની બાબરીની વિધિ તથા કુવારીકા તેમજ બટુક ભોજન પણ અહી કરાવવામાં આવે છે, નવરાત્રીના દરમ્યાન નવચંડી યજ્ઞ થાય છે, ભક્તિથી માતાજીને નૈવૈધ ધરાવે છે સાથે મહાપ્રસાદનું આયોજન થાય છે સાથોસાથ સૌ ભક્તો પ્રસાદ આરોગે છે, ભક્તિભાવ સાથે ચુંદડી, શ્રીફળનો પ્રસાદ ધરાવી રાંદલમાતાના શીશ નમાવી અઢળક આશીર્વાદની પ્રાપ્તિ કરે છે, અહી માતાજીના આ મૂળ સ્થાનમાં રાંદલ માતાજીના મંદિરમાં સવાર તથા સાંજે દીવાની ઝળહળતી જ્યોત સાથે ઢોલ, નગારા અને નોબતની ઝાલરોથી ભક્તિમય માહોલમાં આરતી થાય છે. જે કોઈ ભક્તો પવિત્ર મનથી રાંદલમાતાને પ્રાર્થના કરે છે તેની સઘળી મનોકામના પૂર્ણ થાય છે, જે દંપતિ નિ:સંતાન હોય તેના ઘરે પારણા પણ બંધાઈ જાય છે, અનેક કષ્ટોનું નિવારણ પણ મળે છે, અહી માતાજીની ભક્તિ સાથે થાય છે માતા રાંદલના કરૂણામયી રૂપના દર્શન કરી સુખ, શાંતિ, સમૃદ્ધિ, ધન, વૈભવ તથા એશ્ચર્યની પ્રાપ્તિ કરે છે. રાંદલમાતાના આ મૂળ સ્થાનકે ભક્તો તથા શ્રદ્ધાળુઓ દુર દુર થી પોતાના પરિવારજનો સાથે આવી શીશ નમાવે છે,</p>
                                <RandalSahayate />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default HistoryOfRandaldham;