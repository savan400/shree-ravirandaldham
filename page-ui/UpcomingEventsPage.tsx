"use client";
import styles from "@/app/[locale]/events/upcoming-events/UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import EventCard, { EventCardProps } from "@/components/EventCard/EventCard";
import { useInView } from "@/hooks/useInView";

const upcomingEvents: Omit<EventCardProps, "visible" | "animationDelay">[] = [
    {
        id: "1",
        date: "02.04.2026",
        title: "Shri Hanuman Jayanti 2026",
        image: "/images/events/hanuman-jayanti-2026.jpg",
        location: "Salangpur Dham",
        time: "6:00 AM onwards",
    },
    {
        id: "2",
        date: "03.03.2026",
        title: "Maha Shivratri Utsav",
        image: "/images/events/maha-shivratri-2026.jpg",
        location: "Salangpur Dham",
        time: "All Day",
    },
    {
        id: "3",
        date: "15.02.2026",
        title: "Divyang Vrundavana Samgath",
        image: "/images/events/divyang-samgath.jpg",
        location: "Salangpur Dham",
        time: "9:00 AM",
    },
    {
        id: "4",
        date: "15.02.2026",
        title: "Patotsav 2026",
        image: "/images/events/patotsav-2026.jpg",
        location: "Salangpur Dham",
        time: "Morning Session",
    },
    {
        id: "5",
        date: "01.02.2026",
        title: "Murti Pratishtha Mahotsav",
        image: "/images/events/murti-pratishtha.jpg",
        location: "Salangpur Dham",
        time: "10:00 AM",
    },
    {
        id: "6",
        date: "28.01.2026",
        title: "Punam List 2026",
        image: "/images/events/punam-list-2026.jpg",
        location: "Salangpur Dham",
        time: "Monthly Schedule",
    },
];

const UpcomingEventsPage = () => {
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
                        <EventCard
                            key={event.id}
                            {...event}
                            visible={visible}
                            animationDelay={0.1 + index * 0.08}
                        />
                    ))}
                </div>

                <RandalSahayate />
            </div>
        </section>
    );
};

export default UpcomingEventsPage;