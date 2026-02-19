"use client";
import { useRef, useState } from "react";
import { Play, Pause, Volume2, ChevronDown } from "lucide-react";
import styles from "./AartiCard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AartiData {
    id: string;
    title: string;
    subtitle: string;
    audioUrl: string;
    duration: string;
    lyrics: string[];
}

export interface AartiCardProps {
    aarti: AartiData;
    /** Zero-based index — drives staggered entrance animation delay */
    index?: number;
    /** Controlled by parent so only one card plays at a time */
    isPlaying: boolean;
    onPlayToggle: (id: string) => void;
    onEnded: () => void;
    visible?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AartiCard: React.FC<AartiCardProps> = ({
    aarti,
    index = 0,
    isPlaying,
    onPlayToggle,
    onEnded,
    visible = false,
}) => {
    const [expanded, setExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlayToggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        onPlayToggle(aarti.id);
    };

    return (
        <div
            className={`${styles.aartiCard} ${visible ? styles.cardVisible : ""}`}
            style={{ animationDelay: `${index * 0.15}s` }}
        >
            {/* Animated flowing top border */}
            <div className={styles.cardTopBorder} />

            {/* ── Header ── */}
            <div className={styles.cardHeader}>
                <div className={styles.aartiIcon}>
                    <div className={styles.iconGlow} />
                    🪔
                </div>
                <div className={styles.aartiInfo}>
                    <h3 className={styles.aartiTitle}>{aarti.title}</h3>
                    <p className={styles.aartiSubtitle}>{aarti.subtitle}</p>
                </div>
                <div className={styles.duration}>
                    <Volume2 size={14} />
                    <span>{aarti.duration}</span>
                </div>
            </div>

            {/* ── Audio Player ── */}
            <div className={styles.audioPlayer}>
                <button
                    className={styles.playButton}
                    onClick={handlePlayToggle}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    <div className={styles.playButtonGlow} />
                    {isPlaying
                        ? <Pause className={styles.playIcon} />
                        : <Play className={styles.playIcon} />
                    }
                </button>

                {/* Waveform visualiser */}
                <div className={styles.waveform} aria-hidden="true">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.wavebar} ${isPlaying ? styles.wavebarActive : ""}`}
                            style={{
                                height: `${20 + ((i * 37 + 13) % 60)}%`,
                                animationDelay: `${i * 0.05}s`,
                            }}
                        />
                    ))}
                </div>

                <audio
                    ref={audioRef}
                    src={aarti.audioUrl}
                    onEnded={onEnded}
                />
            </div>

            {/* ── Lyrics toggle ── */}
            <button
                className={styles.lyricsToggle}
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
            >
                <span>બોલ દર્શાવો</span>
                <ChevronDown
                    className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ""}`}
                />
            </button>

            {/* ── Lyrics content ── */}
            <div className={`${styles.lyricsContent} ${expanded ? styles.lyricsExpanded : ""}`}>
                <div className={styles.lyricsInner}>
                    <div className={styles.lyricsDivider} aria-hidden="true">
                        <div className={styles.dividerLine} />
                        <span className={styles.dividerDiamond}>◆</span>
                        <div className={styles.dividerLine} />
                    </div>
                    {aarti.lyrics.map((line, i) => (
                        <p key={i} className={styles.lyricLine}>{line}</p>
                    ))}
                </div>
            </div>

            {/* ── Corner ornaments ── */}
            <div className={styles.cornerOrnament} style={{ top: 8, left: 8 }} aria-hidden="true" />
            <div className={styles.cornerOrnament} style={{ top: 8, right: 8, transform: "scaleX(-1)" }} aria-hidden="true" />
        </div>
    );
};

export default AartiCard;