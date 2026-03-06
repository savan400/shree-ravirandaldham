"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./SocialMediaSection.module.css";

interface SocialPlatform {
  name: string;
  handle: string;
  url: string;
  followers: string;
  color: string;
  icon: React.ReactNode;
  qrData: string;
  description: string;
}

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      ry="5"
      stroke="url(#igGrad)"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="4.5"
      stroke="url(#igGrad)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igGrad)" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
    <polygon points="10,8 10,16 17,12" fill="white" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2" />
    <path
      d="M13.5 8H15V5.5H13C11.3 5.5 10 6.8 10 8.5V10H8V12.5H10V19H12.5V12.5H14.5L15 10H12.5V8.5C12.5 8.2 12.8 8 13.5 8Z"
      fill="white"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="#000000" />
    <path
      d="M5 5.5L10.5 12.5L5 18.5H6.5L11.2 13.5L15 18.5H19L13.2 11.2L18.5 5.5H17L12.5 10.2L9 5.5H5Z"
      fill="white"
    />
  </svg>
);

// Simple SVG QR code pattern (decorative, represents QR for demo)
const QRPattern = ({ seed, color }: { seed: number; color: string }) => {
  const size = 9;
  const cells = Array.from({ length: size * size }, (_, i) => {
    const row = Math.floor(i / size);
    const col = i % size;
    // Corner markers
    if (
      (row < 3 && col < 3) ||
      (row < 3 && col >= size - 3) ||
      (row >= size - 3 && col < 3)
    )
      return true;
    // Pseudo-random interior
    return (i * seed + row * 7 + col * 11) % 3 !== 0;
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      {cells.map((filled, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        return filled ? (
          <rect
            key={i}
            x={col}
            y={row}
            width="0.9"
            height="0.9"
            fill={color}
            rx="0.1"
          />
        ) : null;
      })}
    </svg>
  );
};

const platforms: SocialPlatform[] = [
  {
    name: "Instagram",
    handle: "@shreesalangpurdham",
    url: "https://instagram.com/shreesalangpurdham",
    followers: "12.5K",
    color: "#E1306C",
    icon: <InstagramIcon />,
    qrData: "instagram",
    description: "social_desc_1",
  },
  {
    name: "YouTube",
    handle: "Shree Ravirandaldham",
    url: "https://youtube.com/@shreesalangpurdham",
    followers: "45.2K",
    color: "#FF0000",
    icon: <YouTubeIcon />,
    qrData: "youtube",
    description: "social_desc_2",
  },
  {
    name: "Facebook",
    handle: "Shree Ravirandaldham",
    url: "https://facebook.com/shreesalangpurdham",
    followers: "89.1K",
    color: "#1877F2",
    icon: <FacebookIcon />,
    qrData: "facebook",
    description: "social_desc_3",
  },
  {
    name: "X (Twitter)",
    handle: "@SalangpurDham",
    url: "https://twitter.com/SalangpurDham",
    followers: "8.3K",
    color: "#000000",
    icon: <TwitterIcon />,
    qrData: "twitter",
    description: "social_desc_4",
  },
];

const qrSeeds = [13, 7, 19, 11];

export default function SocialMediaSection() {
  const t = useTranslations("Homepage");
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(platforms.length).fill(false),
  );
  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    new Array(platforms.length).fill(false),
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            platforms.forEach((_, i) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Sacred background */}
      <div className={styles.bg}>
        <div className={styles.bgGradient} />
        <div className={styles.mandalaTop} aria-hidden="true">
          <MandalaDecor opacity={0.07} />
        </div>
        <div className={styles.mandalaBottom} aria-hidden="true">
          <MandalaDecor opacity={0.05} />
        </div>
        <div className={styles.particles} aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className={styles.particle}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.ornamentLine}>
            <span className={styles.ornamentDot} />
            <span className={styles.ornamentLineInner} />
            <span className={styles.om}>🔱</span>
            <span className={styles.ornamentLineInner} />
            <span className={styles.ornamentDot} />
          </div>
          <p className={styles.subTitle}>{t("social_sub_title")}</p>
          <h2 className={styles.title}>
            <span className={styles.titleGold}>{t("social_title_1")}</span>{" "}
            <span className={styles.titleSaffron}>{t("social_title_2")}</span>
          </h2>
          <p className={styles.desc}>
            {t("social_desc")}
          </p>
          <div className={styles.ornamentLine}>
            <span className={styles.ornamentDot} />
            <span className={styles.ornamentLineInner} />
            <span className={styles.lotus}>🪷</span>
            <span className={styles.ornamentLineInner} />
            <span className={styles.ornamentDot} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {platforms.map((platform, i) => (
            <div
              key={platform.name}
              className={`${styles.cardWrapper} ${visibleCards[i] ? styles.cardVisible : ""}`}
              style={{ "--delay": `${i * 0.15}s` } as React.CSSProperties}
              onClick={() => handleFlip(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleFlip(i)}
              aria-label={`${platform.name} - click to see QR code`}
            >
              <div
                className={`${styles.cardInner} ${flippedCards[i] ? styles.flipped : ""}`}
              >
                {/* Front */}
                <div
                  className={styles.cardFront}
                  style={
                    {
                      "--platform-color": platform.color,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={styles.cardGlow}
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${platform.color === "#000000" ? "#ffffff" : platform.color}33, transparent 70%)`,
                    }}
                  />
                  <div className={styles.cardBorder} />

                  <div className={styles.cardIconWrap}>
                    <div className={styles.cardIcon}>{platform.icon}</div>
                    <div
                      className={styles.cardIconRing}
                      style={{
                        borderColor: `${platform.color === "#000000" ? "#ffffff" : platform.color}66`,
                      }}
                    />
                  </div>

                  <h3 className={styles.platformName}>{platform.name}</h3>
                  <p className={styles.platformHandle}>{platform.handle}</p>
                  <p className={styles.platformDesc}>{t(platform.description as any)}</p>

                  <div className={styles.followersRow}>
                    <span
                      className={styles.followersNum}
                      style={{ color: "#fff" }}
                    >
                      {platform.followers}
                    </span>
                    <span className={styles.followersLabel}>{t("social_followers_label")}</span>
                  </div>

                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.followBtn}
                    style={
                      { "--btn-color": platform.color } as React.CSSProperties
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("social_follow_btn")}
                  </a>

                  <div className={styles.flipHint}>
                    <span>{t("social_flip_hint")}</span>
                  </div>
                </div>

                {/* Back — QR */}
                <div
                  className={styles.cardBack}
                  style={
                    {
                      "--platform-color": platform.color,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={styles.cardGlow}
                    style={{
                      background: `radial-gradient(circle at 50% 100%, ${platform.color}33, transparent 70%)`,
                    }}
                  />
                  <div className={styles.cardBorder} />

                  <p className={styles.qrTitle}>{t("social_qr_title")}</p>
                  <p
                    className={styles.qrPlatform}
                    style={{
                      color:
                        platform.color === "#000000" ? "#fff" : platform.color,
                    }}
                  >
                    {platform.name}
                  </p>

                  <div className={styles.qrFrame}>
                    <div className={styles.qrCorner} data-pos="tl" />
                    <div className={styles.qrCorner} data-pos="tr" />
                    <div className={styles.qrCorner} data-pos="bl" />
                    <div className={styles.qrCorner} data-pos="br" />
                    <div className={styles.qrInner}>
                      <QRPattern seed={qrSeeds[i]} color={platform.color} />
                    </div>
                  </div>

                  <p
                    className={styles.qrHandle}
                    style={{
                      color:
                        platform.color === "#000000" ? "#fff" : platform.color,
                    }}
                  >
                    {platform.handle}
                  </p>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.qrLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("social_qr_link")}
                  </a>

                  <div className={styles.flipHint}>
                    <span>{t("social_qr_flip_hint")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MandalaDecor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 400 400" width="400" height="400" style={{ opacity }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30} 200 200)`}>
          <ellipse cx="200" cy="110" rx="8" ry="30" fill="#D4AF37" />
          <ellipse cx="200" cy="80" rx="4" ry="15" fill="#FF6B00" />
        </g>
      ))}
      {[40, 70, 100, 130, 160].map((r, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={r}
          stroke="#D4AF37"
          strokeWidth="0.5"
          fill="none"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 45} 200 200)`}>
          <polygon
            points="200,50 210,190 190,190"
            fill="#D4AF37"
            opacity="0.3"
          />
        </g>
      ))}
    </svg>
  );
}
