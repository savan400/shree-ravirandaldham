"use client";
import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import styles from "./EventCard.module.css";
import Link from "next/link";

export interface EventCardProps {
    id: string;
    date?: string;
    title: string;
    image: string;
    location?: string;
    time?: string;
    animationDelay?: number;
    visible?: boolean;
    navigateLink?: string;
}

const EventCard = ({
    id,
    date,
    title,
    image,
    location,
    time,
    animationDelay = 0,
    visible = true,
    navigateLink
}: EventCardProps) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
            style={{ animationDelay: `${animationDelay}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Date badge */}
            <div className={styles.dateBadge}>
                <Calendar className={styles.dateIcon} />
                <span className={styles.dateText}>{date}</span>
            </div>

            {/* Image container */}
            <div className={styles.imageWrapper}>
                <div className={styles.imageGlow} />
                {hovered && <div className={styles.imageShine} />}

                <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={500}
                    className={styles.eventImage}
                />

                {/* Overlay gradient */}
                <div className={styles.imageOverlay} />
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>

                {(location || time) && (
                    <div className={styles.cardMeta}>
                        {location && (
                            <div className={styles.metaItem}>
                                <MapPin className={styles.metaIcon} />
                                <span>{location}</span>
                            </div>
                        )}
                        {time && (
                            <div className={styles.metaItem}>
                                <Clock className={styles.metaIcon} />
                                <span>{time}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {navigateLink &&
                <Link href={navigateLink || "#"} className={styles.cardViewDetails}>
                    <div className={styles.cardViewDetails}>
                        <span
                            className={styles.cardViewDetailsText}
                        >
                            VIEW DETAILS
                        </span>
                        <div
                            className={styles.cardViewDetailsLine}
                            aria-hidden="true"
                        />
                        <div
                            className={styles.cardViewDetailsDot}
                            aria-hidden="true"
                        />
                    </div>
                </Link>
            }
            {/* Corner ornaments */}
            <div className={styles.cornerOrnament} style={{ top: 8, left: 8 }} />
            <div
                className={styles.cornerOrnament}
                style={{ top: 8, right: 8, transform: "scaleX(-1)" }}
            />
        </div>
    );
};

export default EventCard;