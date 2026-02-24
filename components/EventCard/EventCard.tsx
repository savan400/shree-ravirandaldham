"use client";
import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Radio, CheckCircle2 } from "lucide-react";
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

// Parses "DD.MM.YYYY" → Date (midnight local)
function parseEventDate(dateStr: string): Date | null {
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

type DateStatus =
  | { type: "live" }
  | { type: "upcoming"; daysLeft: number }
  | { type: "past" }
  | { type: "raw"; label: string };

// Returns status relative to today (within 7 days shows countdown, today shows live)
function getDateStatus(dateStr?: string): DateStatus {
  if (!dateStr) return { type: "past" };

  const eventDate = parseEventDate(dateStr);
  if (!eventDate) return { type: "raw", label: dateStr };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { type: "live" };
  if (diffDays > 0 && diffDays <= 7)
    return { type: "upcoming", daysLeft: diffDays };
  if (diffDays < 0) return { type: "past" };
  return { type: "raw", label: dateStr };
}

interface DateBadgeProps {
  dateStr?: string;
}

const DateBadge = ({ dateStr }: DateBadgeProps) => {
  const status = getDateStatus(dateStr);

  if (status.type === "live") {
    return (
      <div className={`${styles.dateBadge} ${styles.dateBadgeLive}`}>
        <Radio className={styles.dateIcon} />
        <span className={styles.dateText}>LIVE TODAY</span>
        <span className={styles.liveDot} aria-hidden="true" />
      </div>
    );
  }

  if (status.type === "upcoming") {
    const label =
      status.daysLeft === 1 ? "TOMORROW" : `IN ${status.daysLeft} DAYS`;
    return (
      <div className={`${styles.dateBadge} ${styles.dateBadgeCountdown}`}>
        <Calendar className={styles.dateIcon} />
        <span className={styles.dateText}>{label}</span>
      </div>
    );
  }

  if (status.type === "past") {
    return (
      <div className={`${styles.dateBadge} ${styles.dateBadgeDone}`}>
        <CheckCircle2 className={styles.dateIcon} />
        <span className={styles.dateText}>EVENT DONE</span>
      </div>
    );
  }

  // far-future: show raw date string
  return (
    <div className={styles.dateBadge}>
      <Calendar className={styles.dateIcon} />
      <span className={styles.dateText}>
        {status.type === "raw" ? status.label : dateStr}
      </span>
    </div>
  );
};

const EventCard = ({
  id,
  date,
  title,
  image,
  location,
  time,
  animationDelay = 0,
  visible = true,
  navigateLink,
}: EventCardProps) => {
  const [hovered, setHovered] = useState(false);
  const isPast = getDateStatus(date).type === "past";

  return (
    <div
      className={`${styles.card} ${visible ? styles.cardVisible : ""} ${isPast ? styles.cardDone : ""}`}
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Smart Date Badge */}
      <DateBadge dateStr={date} />

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

        {navigateLink && (
          <Link
            href={navigateLink}
            className={styles.cardViewDetails}
            style={{ marginTop: "15px" }}
          >
            <div className={styles.cardViewDetails}>
              <span className={styles.cardViewDetailsText}>VIEW DETAILS</span>
              <div className={styles.cardViewDetailsLine} aria-hidden="true" />
              <div className={styles.cardViewDetailsDot} aria-hidden="true" />
            </div>
          </Link>
        )}
      </div>

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
