"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import styles from "../app/events/upcoming-events/UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";

interface Event {
    id: string;
    date: string;
    title: string;
    image: string;
    location?: string;
    time?: string;
}

const upcomingEvents: Event[] = [
    {
        id: "1",
        date: "02.04.2026",
        title: "Shri Hanuman Jayanti 2026",
        image: "/images/events/hanuman-jayanti-2026.jpg",
        location: "Salangpur Dham",
        time: "6:00 AM onwards"
    },
    {
        id: "2",
        date: "03.03.2026",
        title: "Maha Shivratri Utsav",
        image: "/images/events/maha-shivratri-2026.jpg",
        location: "Salangpur Dham",
        time: "All Day"
    },
    {
        id: "3",
        date: "15.02.2026",
        title: "Divyang Vrundavana Samgath",
        image: "/images/events/divyang-samgath.jpg",
        location: "Salangpur Dham",
        time: "9:00 AM"
    },
    {
        id: "4",
        date: "15.02.2026",
        title: "Patotsav 2026",
        image: "/images/events/patotsav-2026.jpg",
        location: "Salangpur Dham",
        time: "Morning Session"
    },
    {
        id: "5",
        date: "01.02.2026",
        title: "Murti Pratishtha Mahotsav",
        image: "/images/events/murti-pratishtha.jpg",
        location: "Salangpur Dham",
        time: "10:00 AM"
    },
    {
        id: "6",
        date: "28.01.2026",
        title: "Punam List 2026",
        image: "/images/events/punam-list-2026.jpg",
        location: "Salangpur Dham",
        time: "Monthly Schedule"
    },
];

const UpcomingEventsPage = () => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });
    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>
                {/* Header */}
                <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                    <CommonBadge text="॥ આગામી કાર્યક્રમો ॥" />
                    <CommonTitle text="Upcoming Events" />
                    <LotusDivider />
                    <p className={styles.subtitle}>
                        જય શ્રી કષ્ટભંજનદેવ હનુમાનજી મહારાજ — આગામી ઉત્સવો અને કાર્યક્રમો
                    </p>
                </div>

                {/* Events Grid */}
                <div className={styles.grid}>
                    {upcomingEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
                            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                            onMouseEnter={() => setHoveredCard(event.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Date badge */}
                            <div className={styles.dateBadge}>
                                <Calendar className={styles.dateIcon} />
                                <span className={styles.dateText}>{event.date}</span>
                            </div>

                            {/* Image container */}
                            <div className={styles.imageWrapper}>
                                <div className={styles.imageGlow} />
                                {hoveredCard === event.id && <div className={styles.imageShine} />}

                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    width={400}
                                    height={500}
                                    className={styles.eventImage}
                                />

                                {/* Overlay gradient */}
                                <div className={styles.imageOverlay} />
                            </div>

                            {/* Content */}
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{event.title}</h3>

                                {(event.location || event.time) && (
                                    <div className={styles.cardMeta}>
                                        {event.location && (
                                            <div className={styles.metaItem}>
                                                <MapPin className={styles.metaIcon} />
                                                <span>{event.location}</span>
                                            </div>
                                        )}
                                        {event.time && (
                                            <div className={styles.metaItem}>
                                                <Clock className={styles.metaIcon} />
                                                <span>{event.time}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Corner ornaments */}
                            <div className={styles.cornerOrnament} style={{ top: 8, left: 8 }} />
                            <div className={styles.cornerOrnament} style={{ top: 8, right: 8, transform: 'scaleX(-1)' }} />
                        </div>
                    ))}
                </div>
                <RandalSahayate />
            </div>
        </section>
    );
};

export default UpcomingEventsPage;