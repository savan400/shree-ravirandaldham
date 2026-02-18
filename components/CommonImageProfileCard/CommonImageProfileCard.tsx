"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./CommonImageProfileCard.module.css";

interface CommonImageCardProps {
    src: string;
    alt: string;
    caption: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
}

const CommonImageProfileCard: React.FC<CommonImageCardProps> = ({
    src,
    alt,
    caption,
    width = 400,
    height = 520,
    priority = false,
    className,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className={`${styles.imageCard} ${className || ""}`}>
            {/* Top SVG Frame */}
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

            {/* Corners */}
            <div className={`${styles.cornerOrnament} ${styles.cornerTl}`} />
            <div className={`${styles.cornerOrnament} ${styles.cornerTr}`} />

            {/* Image */}
            <div className={styles.imageContainer}>
                {imageLoaded && <div className={styles.imageShine} />}
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={styles.saintImage}
                    onLoad={() => setImageLoaded(true)}
                    priority={priority}
                />
            </div>

            {/* Caption */}
            {caption &&
                <div className={styles.imageCaption}>
                    <span className={styles.captionText}>{caption}</span>
                </div>
            }
        </div>
    );
};

export default CommonImageProfileCard;
