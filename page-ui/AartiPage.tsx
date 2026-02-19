"use client";
import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import cardStyles from "../app/upasna-vidhi/aarti/Aartipage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import AartiCard, { AartiData } from "@/components/AartiCard/AartiCard";

// ─── Data ─────────────────────────────────────────────────────────────────────

const aartis: AartiData[] = [
    {
        id: "1",
        title: "શ્રી હનુમાન આરતી",
        subtitle: "આરતી કીજે હનુમાન લલા કી",
        audioUrl: "/audio/hanuman-aarti.mp3",
        duration: "3:45",
        lyrics: [
            "આરતી કીજે હનુમાન લલા કી, દુષ્ટ દલન રઘુનાથ કલા કી",
            "જાકે બળ સે ગિરિવર કાંપે, રોગ દોષ જાકે નિકટ ન ઝાંકે",
            "અંજની પુત્ર મહાબળદાયી, સંતન કે પ્રભુ સદા સહાયી",
            "દે બીરા રઘુનાથ પઠાયો, લંકા જારી સિય સુધિ લાયો",
            "લંકા સો કોટ સમુંદ સી ખાઈ, જાત પવનસુત બાર ન લાઈ",
            "લંકા જારી અસુર સંહારે, સિયારામજી કે કાજ સંવારે",
            "લક્ષ્મણ મૂર્છિત પડે સકારે, લઈ સંજીવન પ્રાણ ઉબારે",
            "પૈઠી પાતાળ તોરી જમ કારે, અહિરાવણ કી ભુજા ઉખારે",
            "બાયે ભુજા અસુર દળ મારે, દાહિને ભુજા સંતજન તારે",
            "સુર નર મુનિ આરતી ઉતારે, જય જય જય હનુમાન કૃપાકારે",
            "કંચન થાર કપૂર લૌ છાઈ, આરતી કરત અંજના માઈ",
            "જો હનુમાનજી કી આરતી ગાવે, બસિ બૈકુંઠ પરમપદ પાવે",
        ],
    },
    {
        id: "2",
        title: "સાંધ્ય આરતી",
        subtitle: "જય હનુમાન જ્ઞાન ગુણ સાગર",
        audioUrl: "/audio/sandhya-aarti.mp3",
        duration: "4:20",
        lyrics: [
            "જય હનુમાન જ્ઞાન ગુણ સાગર, જય કપીશ તિહું લોક ઉજાગર",
            "રામદૂત અતુલિત બળ ધામા, અંજનિ પુત્ર પવનસુત નામા",
            "મહાવીર વિક્રમ બજરંગી, કુમતિ નિવાર સુમતિ કે સંગી",
            "કંચન વરણ વિરાજ સુવેશા, કાનન કુંડળ કુંચિત કેશા",
            "હાથ વજ્ર ઔર ધ્વજા વિરાજે, કાંધે મુંજ જનેઉ સાજે",
            "શંકર સુવન કેસરી નંદન, તેજ પ્રતાપ મહા જગ વંદન",
            "વિદ્યાવાન ગુણી અતિ ચાતુર, રામ કાજ કરિબે કો આતુર",
            "પ્રભુ ચરિત્ર સુનિબે કો રસિયા, રામ લખન સીતા મન બસિયા",
            "સૂક્ષ્મ રૂપ ધરિ સિયહિ દિખાવા, વિકટ રૂપ ધરિ લંક જલાવા",
            "ભીમ રૂપ ધરિ અસુર સંહારે, રામચંદ્ર કે કાજ સંવારે",
            "લાય સંજીવન લખન જિયાયે, શ્રી રઘુવીર હરષિ ઉર લાયે",
            "રઘુપતિ કીન્હી બહુત બડાઈ, તુમ મમ પ્રિય ભરત સમ ભાઈ",
        ],
    },
    {
        id: "3",
        title: "મંગલા આરતી",
        subtitle: "આરતી શ્રી હનુમાનજી કી",
        audioUrl: "/audio/mangala-aarti.mp3",
        duration: "3:30",
        lyrics: [
            "આરતી શ્રી હનુમાનજી કી, આરતી શ્રી હનુમાનજી કી",
            "પવનસુત હનુમાન પ્રભુ, સુખદાતા જનજી કી",
            "અંજનિસુત મહાવીર, લંકાદહન કારી",
            "રામ રસાયન તુમ્હરે પાસા, સદા રહો રઘુપતિ કે દાસા",
            "દાસ રામ કો કહલાયો, મનભાવન આરતી ગાયો",
            "અષ્ટસિદ્ધિ નવનિધિ કે દાતા, અસ વર દીન્હ જાનકી માતા",
            "સુનત હો વીરની સકે જકો, નાસત સકલ મનોરથ મકો",
            "અંજની પુત્ર પવનસુત નામા, સંકટ હરણ મંગલ ધામા",
            "તન પર વજ્રપાત લાગત નહીં, લલિત રૂપ છવિ સકત નહીં",
            "પાયોજી મૈં તો રામ રતન ધન પાયો, વસ્તુ અમોલક દી મેરે સતગુરુ",
            "જનમ જનમ કી પૂંજી પાઈ, જગ મે ખાલક ખેવનહાર",
            "અરતી કુંજબિહારી કી, શ્રી ગિરધર કૃષ્ણ મુરારી કી",
        ],
    },
    {
        id: "4",
        title: "શયન આરતી",
        subtitle: "શ્રી હનુમાન શયન આરતી",
        audioUrl: "/audio/shayan-aarti.mp3",
        duration: "2:50",
        lyrics: [
            "ઓમ જય જગદીશ હરે, સ્વામી જય જગદીશ હરે",
            "ભક્ત જનો કે સંકટ, દાસ જનો કે સંકટ",
            "ક્ષણ મે દૂર કરે, ઓમ જય જગદીશ હરે",
            "જો ધ્યાવે ફળ પાવે, દુખ બિનસે મન કા",
            "સ્વામી દુખ બિનસે મન કા, સુખ સંપતિ ઘર આવે",
            "કષ્ટ મિટે તન કા, ઓમ જય જગદીશ હરે",
            "માત પિતા તુમ મેરે, શરણ ગહુ મૈં કિસકી",
            "સ્વામી શરણ ગહુ મૈં કિસકી, તુમ બિન ઔર ન દૂજા",
            "આશ કરુ મૈં જિસકી, ઓમ જય જગદીશ હરે",
            "તુમ પૂરણ પરમાતમા, તુમ અંતર્યામી",
            "સ્વામી તુમ અંતર્યામી, પાર બ્રહ્મ પરમેશ્વર",
            "તુમ સબકે સ્વામી, ઓમ જય જગદીશ હરે",
        ],
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AartiPage = () => {
    const [visible, setVisible] = useState(false);
    const [playingAarti, setPlayingAarti] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Lifting play state — only one card plays at a time
    const handlePlayToggle = (id: string) => {
        setPlayingAarti((prev) => (prev === id ? null : id));
    };

    const visibleClass = (base: string) =>
        `${styles[base]} ${visible ? styles.visible : ""}`;

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            <div className={styles.container}>
                {/* Floating music notes */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={cardStyles.musicNote}
                        style={{
                            left: `${15 + i * 12}%`,
                            animationDelay: `${i * 0.6}s`,
                            animationDuration: `${6 + i * 0.4}s`,
                        }}
                        aria-hidden="true"
                    >
                        ♪
                    </div>
                ))}

                <div className={visibleClass("header")}>
                    <CommonTitle text="આરતી" />
                    <LotusDivider />

                    {/* Sacred subtitle */}
                    <div className={cardStyles.sacredSubtitle}>
                        <Music className={cardStyles.musicIcon} />
                        <span>॥ ભક્તિ સંગીત — દિવ્ય આરતી સંગ્રહ ॥</span>
                        <Music className={cardStyles.musicIcon} />
                    </div>

                    {/* Aarti Cards Grid */}
                    <div className={cardStyles.aartiGrid}>
                        {aartis.map((aarti, index) => (
                            <AartiCard
                                key={aarti.id}
                                aarti={aarti}
                                index={index}
                                isPlaying={playingAarti === aarti.id}
                                onPlayToggle={handlePlayToggle}
                                onEnded={() => setPlayingAarti(null)}
                                visible={visible}
                            />
                        ))}
                    </div>

                    <div className={visibleClass("footer")} style={{ marginTop: "4rem" }}>
                        <DiamondDivider />
                        <p className={styles.footerBlessing} style={{ marginTop: "20px" }}>
                            ॥ જય સદગુરુ શ્રી ગોપાળાનંદ સ્વામી ॥
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AartiPage;