"use client";

import { useState, useEffect } from "react";
import styles from "@/app/[locale]/events/upcoming-events/UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import EventCard from "@/components/EventCard/EventCard";
import { useInView } from "@/hooks/useInView";
import { fetchEvents, EventEntry, getImageUrl } from "@/lib/api";
import { useLocale } from "next-intl";

// Hardcoded events removed

const UpcomingEventsPage = ({ 
    initialEvents, 
    isLoading = false 
}: { 
    initialEvents: EventEntry[],
    isLoading?: boolean
}) => {
    const locale = useLocale() as "en" | "hi" | "gu";
    const [events] = useState<EventEntry[]>(initialEvents);

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
                    {isLoading ? (
                         <div className="col-span-full flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a0800]"></div>
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event, index) => (
                            <EventCard
                                key={event._id}
                                id={event._id}
                                date={event.date}
                                title={event.title[locale] || event.title.en}
                                image={event.coverImage || (event.images.length > 0 ? event.images[0] : "")}
                                location={event.location[locale] || event.location.en}
                                time={event.time[locale] || event.time.en}
                                visible={visible}
                                animationDelay={0.1 + index * 0.08}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            No upcoming events found.
                        </div>
                    )}
                </div>

        <RandalSahayate />
      </div>
    </section>
  );
};

export default UpcomingEventsPage;
