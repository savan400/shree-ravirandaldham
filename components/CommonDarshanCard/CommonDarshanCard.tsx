"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./CommonDarshanCard.module.css";

interface CommonDarshanCardProps {
    image: string;
    date?: string;
    day?: string;
    priority?: boolean;
}

const ArchFrame: React.FC = () => (
    <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.archFrame}
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <path
            d="M12 320 L12 120 Q12 12 200 12 Q388 12 388 120 L388 320"
            stroke="url(#arch-gold)"
            strokeWidth="3"
            fill="none"
            opacity="0.85"
        />
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

const CommonDarshanCard: React.FC<CommonDarshanCardProps> = ({
    image,
    date,
    day,
    priority = false,
}) => {
    const [imgHovered, setImgHovered] = useState(false);

    return (
        <div
            className={styles.card}
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
        >
            <ArchFrame />

            {/* Glow halo */}
            <div className={styles.glowHalo} aria-hidden="true" />

            {/* Shine sweep */}
            <div className={styles.shineSweepWrap} aria-hidden="true">
                <div
                    className={`${styles.shineSweep} ${imgHovered ? styles["shineSweep--active"] : ""
                        }`}
                />
            </div>

            {/* Image */}
            <Image
                src={image}
                alt={
                    date && day
                        ? `Daily Darshan ${date} (${day})`
                        : "Darshan Image"
                }
                width={520}
                height={390}
                className={`${styles.darshanImage} ${imgHovered
                    ? styles["darshanImage--hovered"]
                    : styles["darshanImage--idle"]
                    }`}
                priority={priority}
            />

            {/* Bottom overlay */}
            {date &&
                <div className={styles.cardOverlay}>
                    <p className={styles.cardDate}>
                        Daily Darshan — {date} ({day})
                    </p>
                </div>
            }
        </div>
    );
};

export default CommonDarshanCard;