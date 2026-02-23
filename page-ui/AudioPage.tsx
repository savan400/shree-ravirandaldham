"use client";
import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import cardStyles from "@/app/[locale]/upasna-vidhi/aarti/Aartipage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import AartiCard, { AartiData } from "@/components/AartiCard/AartiCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";
import RandalSahayate from "./randalSahayate";

// ─── Data ─────────────────────────────────────────────────────────────────────

const aartis: AartiData[] = [
    {
        id: "1",
        title: "Swaminarayan Dhun",
        audioUrl: "/audio/SWAMINARAYAN-DHUN-1.mp3",
        duration: "00:28",
        downloadUrl: "/audio/SWAMINARAYAN-DHUN-1.mp3"
    },
    {
        id: "2",
        title: "Niti Pravin Shlok",
        audioUrl: "/audio/Salangpur-Niti-Pravin-Shlok.mp3",
        duration: "00:28",
        downloadUrl: "/audio/Salangpur-Niti-Pravin-Shlok.mp3"
    },
    {
        id: "3",
        title: "Harikrushna Maharaj Stuti Shlok",
        audioUrl: "/audio/Harikrushna-maharaj-Stuti-Shlok.mp3",
        duration: "00:22",
        downloadUrl: "/audio/Harikrushna-maharaj-Stuti-Shlok.mp3"
    },
    {
        id: "4",
        title: "Harikrushna Maharaj Stuti Shlok",
        audioUrl: "/audio/Harikrushna-maharaj-Stuti-Shlok (1).mp3",
        duration: "00:22",
        downloadUrl: "/audio/Harikrushna-maharaj-Stuti-Shlok (1).mp3"
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AudioPage = () => {

    const [playingAarti, setPlayingAarti] = useState<string | null>(null);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });
    // Lifting play state — only one card plays at a time
    const handlePlayToggle = (id: string) => {
        setPlayingAarti((prev) => (prev === id ? null : id));
    };

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

                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="Audio" />
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
                    <RandalSahayate />
                </div>
            </div>
        </section>
    );
};

export default AudioPage;