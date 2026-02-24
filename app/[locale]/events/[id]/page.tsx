// app/[locale]/events/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  Tag,
  CheckCircle2,
  Radio,
} from "lucide-react";
import styles from "./EventDetailPage.module.css";
import { getAllEventIds, getEventById } from "@/lib/events.data";

// ── SSR: pre-generate all event detail routes at build time ─────────
export async function generateStaticParams() {
  return getAllEventIds().map((id) => ({ id }));
}

// ── SSR: per-event <head> metadata for SEO ───────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} | Salangpur Dham`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.image }],
    },
  };
}

// ── Date utilities (pure, no browser APIs — safe for SSR) ────────────
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
  | { type: "future" };

function getDateStatus(dateStr?: string): DateStatus {
  if (!dateStr) return { type: "past" };
  const eventDate = parseEventDate(dateStr);
  if (!eventDate) return { type: "future" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return { type: "live" };
  if (diffDays > 0 && diffDays <= 7)
    return { type: "upcoming", daysLeft: diffDays };
  if (diffDays < 0) return { type: "past" };
  return { type: "future" };
}

function formatDisplayDate(dateStr: string): string {
  const d = parseEventDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── SSR Server Component ─────────────────────────────────────────────
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const event = getEventById(id);

  if (!event) notFound();

  const status = getDateStatus(event.date);
  const isPast = status.type === "past";

  return (
    <main className={`${styles.page} ${isPast ? styles.pagePast : ""}`}>
      {/* ── Background decoration ── */}
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />
      <div className={styles.bgPattern} aria-hidden="true" />

      {/* ── Back nav ── */}
      <nav className={styles.navBar}>
        <Link
          href={`/${locale}/events/upcoming-events`}
          className={styles.backLink}
        >
          <ArrowLeft className={styles.backIcon} />
          <span>All Events</span>
        </Link>
      </nav>

      <div className={styles.container}>
        {/* ════════════════════════════
            HERO
        ════════════════════════════ */}
        <section className={styles.hero}>
          <div className={styles.heroImageWrapper}>
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className={`${styles.heroImage} ${isPast ? styles.heroImagePast : ""}`}
            />
            <div className={styles.heroOverlay} />

            {/* Status badge */}
            <div className={styles.heroBadgeWrapper}>
              {status.type === "live" && (
                <span className={`${styles.statusBadge} ${styles.statusLive}`}>
                  <Radio size={14} />
                  LIVE TODAY
                  <span className={styles.liveDot} aria-hidden="true" />
                </span>
              )}
              {status.type === "upcoming" && (
                <span
                  className={`${styles.statusBadge} ${styles.statusCountdown}`}
                >
                  <Calendar size={14} />
                  {status.daysLeft === 1
                    ? "TOMORROW"
                    : `IN ${status.daysLeft} DAYS`}
                </span>
              )}
              {status.type === "past" && (
                <span className={`${styles.statusBadge} ${styles.statusDone}`}>
                  <CheckCircle2 size={14} />
                  EVENT DONE
                </span>
              )}
              {status.type === "future" && (
                <span
                  className={`${styles.statusBadge} ${styles.statusFuture}`}
                >
                  <Calendar size={14} />
                  {event.date}
                </span>
              )}
            </div>

            {/* Overlaid title */}
            <div className={styles.heroTitleBlock}>
              {event.titleGuj && (
                <p className={styles.heroTitleGuj}>{event.titleGuj}</p>
              )}
              <h1 className={styles.heroTitle}>{event.title}</h1>
              <div className={styles.heroDivider} aria-hidden="true">
                <span className={styles.heroDividerLine} />
                <span className={styles.heroDividerSymbol}>✦</span>
                <span className={styles.heroDividerLine} />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════
            BODY  (main + sidebar)
        ════════════════════════════ */}
        <div className={styles.body}>
          {/* ── Main content ── */}
          <div className={styles.main}>
            {/* Meta strip */}
            <div className={styles.metaStrip}>
              <span className={styles.metaChip}>
                <Calendar className={styles.metaChipIcon} />
                {formatDisplayDate(event.date)}
              </span>
              <span className={styles.metaChip}>
                <Clock className={styles.metaChipIcon} />
                {event.time}
              </span>
              <span className={styles.metaChip}>
                <MapPin className={styles.metaChipIcon} />
                {event.location}
              </span>
            </div>

            {/* About */}
            {event.description && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionAccent}>॥</span>
                  About this Event
                  <span className={styles.sectionAccent}>॥</span>
                </h2>
                <p className={styles.description}>{event.description}</p>
              </div>
            )}

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionAccent}>॥</span>
                  Programme Highlights
                  <span className={styles.sectionAccent}>॥</span>
                </h2>
                <ul className={styles.highlightList}>
                  {event.highlights.map((h, i) => (
                    <li key={i} className={styles.highlightItem}>
                      <span
                        className={styles.highlightDot}
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className={styles.tagsRow}>
                <Tag className={styles.tagsIcon} />
                {event.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            {/* Details card */}
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Event Details</h3>

              <div className={styles.sideRow}>
                <Calendar className={styles.sideIcon} />
                <div>
                  <p className={styles.sideLabel}>Date</p>
                  <p className={styles.sideValue}>
                    {formatDisplayDate(event.date)}
                  </p>
                </div>
              </div>
              <div className={styles.sideDivider} />

              <div className={styles.sideRow}>
                <Clock className={styles.sideIcon} />
                <div>
                  <p className={styles.sideLabel}>Time</p>
                  <p className={styles.sideValue}>{event.time}</p>
                </div>
              </div>
              <div className={styles.sideDivider} />

              <div className={styles.sideRow}>
                <MapPin className={styles.sideIcon} />
                <div>
                  <p className={styles.sideLabel}>Venue</p>
                  <p className={styles.sideValue}>{event.location}</p>
                </div>
              </div>

              {event.organizer && (
                <>
                  <div className={styles.sideDivider} />
                  <div className={styles.sideRow}>
                    <span className={styles.sideIconEmoji}>🏛</span>
                    <div>
                      <p className={styles.sideLabel}>Organizer</p>
                      <p className={styles.sideValue}>{event.organizer}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Contact card */}
            {(event.contactPhone || event.contactEmail) && (
              <div className={`${styles.sideCard} ${styles.sideCardContact}`}>
                <h3 className={styles.sideCardTitle}>Contact</h3>
                {event.contactPhone && (
                  <a
                    href={`tel:${event.contactPhone}`}
                    className={styles.contactLink}
                  >
                    <Phone className={styles.sideIcon} />
                    <span>{event.contactPhone}</span>
                  </a>
                )}
                {event.contactEmail && (
                  <a
                    href={`mailto:${event.contactEmail}`}
                    className={styles.contactLink}
                  >
                    <Mail className={styles.sideIcon} />
                    <span>{event.contactEmail}</span>
                  </a>
                )}
              </div>
            )}

            {/* CTA — only for upcoming / live events */}
            {!isPast && (
              <div className={styles.ctaCard}>
                <div className={styles.ctaGlow} aria-hidden="true" />
                <p className={styles.ctaTagline}>જય કષ્ટભંજનદેવ</p>
                <p className={styles.ctaSubline}>
                  All are welcome. Entry free.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
