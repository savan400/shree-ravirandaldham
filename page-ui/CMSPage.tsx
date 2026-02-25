"use client";
import { useState } from "react";
import Image from "next/image";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonImageProfileCard from "@/components/CommonImageProfileCard/CommonImageProfileCard";
import RandalSahayate from "./randalSahayate";
import ClickableImage from "@/components/ClickableImage";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";
import { useLocale } from "next-intl";
import styles from "@/app/[locale]/ravirandaldham/parichay/ParichayPage.module.css";
import itihasStyles from "@/app/[locale]/ravirandaldham/itihas/Itihaspage.module.css";
import bapuStyles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";

export type Locale = "en" | "hi" | "gu";

/**
 * layoutType values:
 *  "text-only"     → Itihas style  (full-width text card, no image, paragraphs list)
 *  "profile"       → DineshpuriBapu style (left profile image + right content card)
 *  "temple"        → Parichay/ShanidevTemple style (left arch-framed image + right content)
 */
export interface CMSPageEntry {
  layoutType: "text-only" | "profile" | "temple";
  title: { en?: string; hi?: string; gu?: string };
  badgeText: { en?: string; hi?: string; gu?: string };
  description?: { en?: string; hi?: string; gu?: string };
  /** For text-only layout: array of paragraph strings per locale */
  paragraphs?: { en?: string[]; hi?: string[]; gu?: string[] };
  /** For profile layout: intro paragraphs shown above the card */
  introTexts?: { en?: string[]; hi?: string[]; gu?: string[] };
  /** Section title inside the card (profile layout) */
  sectionTitle?: { en?: string; hi?: string; gu?: string };
  /** Rich HTML description inside the card (profile layout) */
  cardContent?: { en?: string; hi?: string; gu?: string };
  /** Optional blockquote injected via {quote} placeholder in description */
  quote?: { en?: string; hi?: string; gu?: string };
  images?: string[];
  imageCaption?: { en?: string; hi?: string; gu?: string };
}

// ── Decorative SVGs ────────────────────────────────────────────────────────

const QuoteMark = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="32"
    height="28"
    viewBox="0 0 32 28"
    fill="none"
    className={flip ? itihasStyles.quoteMarkFlipped : itihasStyles.quoteMark}
  >
    <path
      d="M2 24 Q2 4 14 4 L14 12 Q7 12 7 20 L14 20 L14 24 Z"
      fill="url(#qm1)"
    />
    <path
      d="M18 24 Q18 4 30 4 L30 12 Q23 12 23 20 L30 20 L30 24 Z"
      fill="url(#qm1)"
    />
    <defs>
      <linearGradient id="qm1" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FFD700" />
      </linearGradient>
    </defs>
  </svg>
);

const ArchFrame = () => (
  <svg
    viewBox="0 0 400 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.archFrame}
    preserveAspectRatio="none"
  >
    <path
      d="M12 500 L12 120 Q12 12 200 12 Q388 12 388 120 L388 500"
      stroke="url(#arch-gold)"
      strokeWidth="3"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M28 500 L28 125 Q28 30 200 30 Q372 30 372 125 L372 500"
      stroke="url(#arch-gold)"
      strokeWidth="1"
      fill="none"
      opacity="0.4"
    />
    <rect
      x="6"
      y="6"
      width="12"
      height="12"
      transform="rotate(45 12 12)"
      fill="#FFD700"
      opacity="0.9"
    />
    <rect
      x="382"
      y="6"
      width="12"
      height="12"
      transform="rotate(45 388 12)"
      fill="#FFD700"
      opacity="0.9"
    />
    <circle cx="200" cy="14" r="5" fill="#FFD700" opacity="0.9" />
    <circle cx="200" cy="14" r="3" fill="#FFF" opacity="0.5" />
    {[0.25, 0.45, 0.65, 0.85].map((t, i) => (
      <g key={i}>
        <line
          x1="12"
          y1={120 + t * 380}
          x2="28"
          y2={120 + t * 380}
          stroke="#FFD700"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <line
          x1="372"
          y1={120 + t * 380}
          x2="388"
          y2={120 + t * 380}
          stroke="#FFD700"
          strokeWidth="1.2"
          opacity="0.5"
        />
      </g>
    ))}
    <defs>
      <linearGradient id="arch-gold" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FF6B00" />
        <stop offset="0.35" stopColor="#FFD700" />
        <stop offset="0.65" stopColor="#FF8C00" />
        <stop offset="1" stopColor="#FF6B00" />
      </linearGradient>
    </defs>
  </svg>
);

const CornerOrnament = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    className={`${styles.cornerOrnament} ${flip ? styles.cornerOrnamentRight : styles.cornerOrnamentLeft}`}
  >
    <path
      d="M4 66 L4 4 L66 4"
      stroke="#FFD700"
      strokeWidth="2"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M4 4 L18 4 M4 4 L4 18"
      stroke="#FF8C00"
      strokeWidth="1.2"
      opacity="0.9"
    />
    <circle cx="4" cy="4" r="4" fill="#FFD700" />
    <circle cx="4" cy="4" r="2" fill="#FFF" opacity="0.6" />
    <path
      d="M4 28 Q18 28 18 4"
      stroke="#F5A623"
      strokeWidth="0.7"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M4 42 Q32 42 32 4"
      stroke="#F5A623"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// ── Sub-layouts ────────────────────────────────────────────────────────────

/** Layout 1: Text-only (Itihas style) */
const TextOnlyLayout = ({
  cmsData,
  visible,
  locale,
}: {
  cmsData: CMSPageEntry;
  visible: boolean;
  locale: string;
}) => {
  const paragraphs = cmsData.paragraphs?.[locale as Locale] || [];
  // Index of special quote paragraph — can be driven from CMS later
  const quoteIndex = (cmsData as any).quoteIndex ?? -1;

  return (
    <div
      className={`${itihasStyles.contentCard} ${visible ? itihasStyles.visible : ""}`}
    >
      <div className={itihasStyles.contentCardTopBar} />
      <div>
        {paragraphs.map((para, i) => (
          <div
            key={i}
            className={`${itihasStyles.paraWrapper} ${visible ? itihasStyles.visible : ""}`}
            style={{ "--delay": `${0.4 + i * 0.08}s` } as React.CSSProperties}
          >
            {i === quoteIndex ? (
              <div className={itihasStyles.quoteBlock}>
                <div className={itihasStyles.quoteMarkTopLeft}>
                  <QuoteMark />
                </div>
                <p className={itihasStyles.quoteParagraph}>{para}</p>
                <div className={itihasStyles.quoteMarkBottomRight}>
                  <QuoteMark flip />
                </div>
              </div>
            ) : (
              <p
                className={itihasStyles.paragraph}
                style={{
                  marginBottom: i < paragraphs.length - 1 ? undefined : 0,
                }}
              >
                {para}
              </p>
            )}
          </div>
        ))}
      </div>
      <RandalSahayate />
    </div>
  );
};

/** Layout 2: Profile (DineshpuriBapu style) */
const ProfileLayout = ({
  cmsData,
  visible,
  locale,
}: {
  cmsData: CMSPageEntry;
  visible: boolean;
  locale: string;
}) => {
  const introTexts = cmsData.introTexts?.[locale as Locale] || [];
  const sectionTitle = cmsData.sectionTitle?.[locale as Locale] || "";
  const cardContent = cmsData.cardContent?.[locale as Locale] || "";
  const displayImage = cmsData.images?.[0] || "/images/dineshpari-bapu.png";
  const imageCaption = cmsData.imageCaption?.[locale as Locale] || "";

  return (
    <div className={bapuStyles.grid}>
      {/* Left: Image */}
      <div className="sticky-img-class">
        <ClickableImage
          items={{ src: displayImage, alt: imageCaption, title: imageCaption }}
        >
          <div className={visibleClass("imageWrapper", visible)}>
            <CommonImageProfileCard
              src={displayImage}
              alt={imageCaption}
              caption={imageCaption}
              priority
            />
          </div>
        </ClickableImage>
      </div>

      {/* Right: Text */}
      <div className={visibleClass("content", visible)}>
        {introTexts.length > 0 && (
          <div className={bapuStyles.contentIntro}>
            {introTexts.map((text, i) => (
              <p key={i} className={bapuStyles.introText}>
                {text}
              </p>
            ))}
          </div>
        )}
        <div className={bapuStyles.contentCard}>
          <div className={bapuStyles.cardAccentBar} />
          <div className={bapuStyles.contentSection}>
            {sectionTitle && (
              <h2 className={bapuStyles.sectionTitle}>{sectionTitle}</h2>
            )}
            <div
              className={bapuStyles.sectionText}
              dangerouslySetInnerHTML={{ __html: cardContent }}
            />
          </div>
        </div>
        <RandalSahayate />
      </div>
    </div>
  );
};

/** Layout 3: Temple / Parichay style */
const TempleLayout = ({
  cmsData,
  visible,
  locale,
}: {
  cmsData: CMSPageEntry;
  visible: boolean;
  locale: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const displayImage = cmsData.images?.[0] || "/images/banner-1.webp";
  const title = cmsData.title?.[locale as Locale] || "";
  const imageCaption =
    cmsData.imageCaption?.[locale as Locale] || "॥ દિવ્ય દર્શન ॥";
  let content = cmsData.description?.[locale as Locale] || "";
  const quote = cmsData.quote?.[locale as Locale] || cmsData.quote?.en || "";

  if (content && quote) {
    content = content.replace(
      /{quote}/g,
      `<blockquote class="cms-quote text-xl font-bold text-orange-600 my-6 pl-4 border-l-4 border-orange-500 italic">"${quote}"</blockquote>`,
    );
  }

  return (
    <div className={styles.grid}>
      {/* Left: Image */}
      <div className="sticky-img-class">
        <div className={`${styles.imageCol} ${visible ? styles.visible : ""}`}>
          <ClickableImage
            items={{ src: displayImage, alt: title, title: "॥ દિવ્ય દર્શન ॥" }}
          >
            <div className={styles.imageFrame}>
              <ArchFrame />
              <CornerOrnament />
              <CornerOrnament flip />
              <div className={styles.halo} />
              <div className={styles.imageContainer}>
                {imageLoaded && <div className={styles.imageShine} />}
                <Image
                  src={displayImage}
                  alt={title}
                  width={500}
                  height={650}
                  className={styles.deityImage}
                  onLoad={() => setImageLoaded(true)}
                  priority
                />
              </div>
              <div className={styles.frameBottomGradient} />
            </div>
          </ClickableImage>
          <p className={styles.imageCaption}>{imageCaption}</p>
        </div>
      </div>

      {/* Right: Text */}
      <div className={`${styles.textCol} ${visible ? styles.visible : ""}`}>
        <div className={styles.contentCard}>
          <div className={styles.contentCardAccentBar} />
          {content ? (
            <div
              className={`${styles.contentText} cms-rich-content`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className={styles.contentText}>No content available.</p>
          )}
          <RandalSahayate />
        </div>
      </div>
    </div>
  );
};

// ── Main unified component ─────────────────────────────────────────────────

interface CMSPageProps {
  cmsData?: CMSPageEntry | null;
}

const CMSPage = ({ cmsData }: CMSPageProps) => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  const locale = useLocale();

  if (!cmsData) return null;

  const title = cmsData.title?.[locale as Locale] || "";
  const badge = cmsData.badgeText?.[locale as Locale] || "";
  const layoutType = cmsData.layoutType || "temple";

  // Choose section wrapper class based on layout
  const sectionClass =
    layoutType === "text-only"
      ? itihasStyles.section
      : layoutType === "profile"
        ? bapuStyles.section
        : styles.section;

  const containerClass =
    layoutType === "text-only"
      ? itihasStyles.container
      : layoutType === "profile"
        ? bapuStyles.container
        : styles.container;

  return (
    <section ref={sectionRef} className={sectionClass}>
      <PageBackgroundDecorations />
      <div className={containerClass}>
        {/* ── Header (shared across all layouts) ── */}
        <div className={visibleClass("header", visible)}>
          <CommonBadge text={badge} />
          <CommonTitle text={title} />
          <LotusDivider />
        </div>

        {/* ── Layout-specific content ── */}
        {layoutType === "text-only" && (
          <TextOnlyLayout cmsData={cmsData} visible={visible} locale={locale} />
        )}
        {layoutType === "profile" && (
          <ProfileLayout cmsData={cmsData} visible={visible} locale={locale} />
        )}
        {layoutType === "temple" && (
          <TempleLayout cmsData={cmsData} visible={visible} locale={locale} />
        )}
      </div>

      {/* Shared rich-content styles */}
      <style jsx global>{`
        .cms-rich-content h1,
        .cms-rich-content h2,
        .cms-rich-content h3 {
          color: #ff6b00;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .cms-rich-content p {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: #4a5568;
        }
        .cms-rich-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .cms-rich-content blockquote.cms-quote {
          font-family: inherit;
        }
      `}</style>
    </section>
  );
};

export default CMSPage;
