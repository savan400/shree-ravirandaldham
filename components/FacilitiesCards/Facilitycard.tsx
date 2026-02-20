"use client";

import Image from "next/image";
import styles from "./FacilitiesCards.module.css";
import { Link } from "@/i18n/routing";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FacilityCardData {

    image: string;
    title: string;
    description: string;
    icon: string;
    tag: string;
    accentColor: string;
    navigateTo?: string; 
}

export interface FacilityCardProps {
    facility: FacilityCardData;
    index?: number;
    visible?: boolean;
}

// ─── Arch ornament (internal) ────────────────────────────────────────────────

interface CardArchProps {
    color?: string;
}

const CardArch: React.FC<CardArchProps> = ({ color = "#FFD700" }) => {
    // Unique gradient id per colour so multiple cards don't clash
    const gradId = `cag-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

    return (
        <svg
            viewBox="0 0 400 60"
            fill="none"
            className={styles.cardArch}
            aria-hidden="true"
        >
            <path
                d="M0 60 L0 30 Q200 -20 400 30 L400 60"
                fill={`url(#${gradId})`}
                opacity="0.15"
            />
            <path
                d="M0 4 Q200 -18 400 4"
                stroke={color}
                strokeWidth="2"
                fill="none"
                opacity="0.7"
            />
            <circle cx="200" cy="-2" r="4" fill={color} opacity="0.8" />
            <circle cx="0" cy="4" r="4" fill={color} opacity="0.6" />
            <circle cx="400" cy="4" r="4" fill={color} opacity="0.6" />
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor={color} />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

const FacilityCard: React.FC<FacilityCardProps> = ({
    facility,
    index = 0,
    visible = false,
}) => {
    const staggerDelay = `${0.2 + index * 0.18}s`;

    return (
        <div
            className={`${styles.card} ${visible ? styles["card--visible"] : ""}`}
            style={{ transitionDelay: staggerDelay }}
        >
            {/* Top arch ornament */}
            <CardArch color={facility.accentColor} />

            {/* Background image */}
            <Image
                src={facility.image}
                alt={facility.title}
                fill
                className={styles.cardImage}
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Gradient overlay */}
            <div className={styles.cardGradient} aria-hidden="true" />

            {/* Accent glow — dynamic per card */}
            <div
                className={styles.cardAccentGlow}
                style={{
                    background: `radial-gradient(ellipse 80% 40% at 50% 100%, ${facility.accentColor}22, transparent)`,
                }}
                aria-hidden="true"
            />

            {/* Corner ornament */}
            <svg
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                className={styles.cornerOrnament}
                aria-hidden="true"
            >
                <path
                    d="M48 2 L48 48 L2 48"
                    stroke="#FFD700"
                    strokeWidth="1.5"
                    fill="none"
                />
                <circle cx="48" cy="2" r="3" fill="#FFD700" />
            </svg>

            {/* Content */}
            <div className={styles.cardContent}>
                {/* Tag badge */}
                <div
                    className={styles.cardTag}
                    style={{
                        background: `linear-gradient(135deg, ${facility.accentColor}33, ${facility.accentColor}18)`,
                        border: `1px solid ${facility.accentColor}55`,
                    }}
                >
                    <span className={styles.cardTagEmoji} aria-hidden="true">
                        {facility.icon}
                    </span>
                    <span className={styles.cardTagText}>{facility.tag}</span>
                </div>

                {/* Title */}
                <h3 className={styles.cardTitle}>{facility.title}</h3>

                {/* Divider */}
                <div
                    className={styles.cardDivider}
                    style={{
                        background: `linear-gradient(to right, ${facility.accentColor}80, transparent)`,
                    }}
                    aria-hidden="true"
                />

                {/* Description */}
                <p className={styles.cardDescription}>{facility.description}</p>

                {/* View details row */}
                <Link href={facility.navigateTo || "#"} className={styles.cardViewDetails}>
                    <div className={styles.cardViewDetails}>
                        <span
                            className={styles.cardViewDetailsText}
                            style={{ color: facility.accentColor }}
                        >
                            VIEW DETAILS
                        </span>
                        <div
                            className={styles.cardViewDetailsLine}
                            style={{ background: facility.accentColor }}
                            aria-hidden="true"
                        />
                        <div
                            className={styles.cardViewDetailsDot}
                            style={{ background: facility.accentColor }}
                            aria-hidden="true"
                        />
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default FacilityCard;