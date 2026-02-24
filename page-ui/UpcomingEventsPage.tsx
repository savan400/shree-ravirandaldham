"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import styles from "@/app/[locale]/events/upcoming-events/UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import EventCard from "@/components/EventCard/EventCard";
import { useInView } from "@/hooks/useInView";
import { fetchEvents, EventEntry } from "@/lib/api";
import { useLocale } from "next-intl";
import Pagination from "@/components/Pagination/Pagination";

// Load all events to sort them client-side into Today / Upcoming / Past.
// Each section paginates independently with ITEMS_PER_PAGE rows.
const ITEMS_PER_PAGE = 6;
// Fetch a large page so we get everything at once for client-side sorting
const FETCH_LIMIT = 200;

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function normDate(raw: string) { return raw?.slice(0, 10) ?? ""; }

function SectionLabel({ emoji, text, count }: { emoji: string; text: string; count?: number }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <span className="text-lg">{emoji}</span>
            <h3 className="text-base font-bold text-[#3d1f00]">{text}</h3>
            {count !== undefined && (
                <span className="bg-[#c8902c]/15 text-[#c8902c] text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
            <div className="flex-1 h-px bg-[#e9bc47]/30" />
        </div>
    );
}

const UpcomingEventsPage = () => {
    const locale = useLocale() as "en" | "hi" | "gu";
    const [allEvents, setAllEvents] = useState<EventEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPast, setShowPast] = useState(false);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [pastPage, setPastPage] = useState(1);

    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    const load = useCallback(async () => {
        setLoading(true);
        const result = await fetchEvents(1, FETCH_LIMIT);
        setAllEvents(result.data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const { todayEvents, upcomingEvents, pastEvents } = useMemo(() => {
        const today = todayStr();
        return {
            todayEvents: allEvents.filter((e) => normDate(e.date) === today),
            upcomingEvents: allEvents
                .filter((e) => normDate(e.date) > today)
                .sort((a, b) => normDate(a.date).localeCompare(normDate(b.date))),
            pastEvents: allEvents
                .filter((e) => normDate(e.date) < today)
                .sort((a, b) => normDate(b.date).localeCompare(normDate(a.date))),
        };
    }, [allEvents]);

    const upcomingSlice = upcomingEvents.slice((upcomingPage - 1) * ITEMS_PER_PAGE, upcomingPage * ITEMS_PER_PAGE);
    const pastSlice = pastEvents.slice((pastPage - 1) * ITEMS_PER_PAGE, pastPage * ITEMS_PER_PAGE);

    const renderCards = (list: EventEntry[], indexOffset = 0) =>
        list.map((event, i) => (
            <EventCard
                key={event._id}
                id={event._id}
                date={event.date}
                title={event.title[locale] || event.title.en}
                image={event.coverImage || (event.images.length > 0 ? event.images[0] : "")}
                location={event.location[locale] || event.location.en}
                time={event.time[locale] || event.time.en}
                visible={visible}
                animationDelay={0.1 + (indexOffset + i) * 0.08}
            />
        ));

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />
            <div className={styles.container}>
                <div className={`${styles.header} ${visible ? styles.visible : ""}`}>
                    <CommonBadge text="॥ આગામી કાર્યક્રમો ॥" />
                    <CommonTitle text="Upcoming Events" />
                    <LotusDivider />
                    <p className={styles.subtitle}>
                        જય શ્રી ravi randal — આગામી ઉત્સવો અને કાર્યક્રમો
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a0800]" />
                    </div>
                ) : (
                    <>
                        {todayEvents.length > 0 && (
                            <div className="mb-10">
                                <SectionLabel emoji="🔴" text="Happening Today" count={todayEvents.length} />
                                <div className={styles.grid}>{renderCards(todayEvents, 0)}</div>
                            </div>
                        )}

                        {upcomingEvents.length > 0 && (
                            <div className="mb-10">
                                {todayEvents.length > 0 && (
                                    <SectionLabel emoji="📅" text="Upcoming Events" count={upcomingEvents.length} />
                                )}
                                <div className={styles.grid}>{renderCards(upcomingSlice, todayEvents.length)}</div>
                                <Pagination
                                    page={upcomingPage}
                                    total={upcomingEvents.length}
                                    perPage={ITEMS_PER_PAGE}
                                    onChange={setUpcomingPage}
                                    scrollToTop
                                    className="mt-6"
                                />
                            </div>
                        )}

                        {todayEvents.length === 0 && upcomingEvents.length === 0 && (
                            <div className="text-center py-12 text-gray-400">No upcoming events at the moment.</div>
                        )}

                        {pastEvents.length > 0 && (
                            <div className="mt-4">
                                <button
                                    onClick={() => { setPastPage(1); setShowPast(v => !v); }}
                                    className="mx-auto flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#c8902c]/40 bg-[#FDF8F3] text-sm font-bold text-[#8b6914] hover:bg-orange-50 hover:border-[#c8902c] transition-all"
                                >
                                    <span>{showPast ? "Hide" : "Show"} Past Events</span>
                                    <span className="bg-[#c8902c]/20 text-[#c8902c] text-xs font-bold px-2 py-0.5 rounded-full">{pastEvents.length}</span>
                                    <svg className={`w-4 h-4 transition-transform ${showPast ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showPast && (
                                    <div className="mt-6">
                                        <SectionLabel emoji="📁" text="Past Events" count={pastEvents.length} />
                                        <div className={`${styles.grid} opacity-80`}>
                                            {renderCards(pastSlice, todayEvents.length + upcomingEvents.length)}
                                        </div>
                                        <Pagination
                                            page={pastPage}
                                            total={pastEvents.length}
                                            perPage={ITEMS_PER_PAGE}
                                            onChange={setPastPage}
                                            className="mt-6"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <RandalSahayate />
            </div>
        </section>
    );
};

export default UpcomingEventsPage;
