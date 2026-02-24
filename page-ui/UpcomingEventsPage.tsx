"use client";
import styles from "@/app/[locale]/events/upcoming-events/UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import EventCard, { EventCardProps } from "@/components/EventCard/EventCard";
import { useInView } from "@/hooks/useInView";
import { EVENTS } from "@/lib/events.data";
import { useParams } from "next/navigation";

const UpcomingEventsPage = () => {
  const { locale } = useParams();
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
          {EVENTS?.map((event, index) => (
            <EventCard
              key={event.id}
              {...event}
              navigateLink={`/${locale}/events/${event.id}`}
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
