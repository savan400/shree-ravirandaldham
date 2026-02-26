"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./WhatsAppSection.module.css";

const WHATSAPP_LINK =
  "https://wa.me/919825835304?text=Jai%20Randal%20Maa!%20Please%20add%20me%20to%20Daily%20Darshan%20group";
const WHATSAPP_NUMBER = "+91 98258 35304";
const GROUP_MEMBERS = "24,500+";

// WhatsApp Icon SVG
const WhatsAppIcon = ({ size = 64 }: { size?: number }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path
      d="M33.6 14.3C31.1 11.8 27.7 10.4 24.1 10.4c-7.5 0-13.6 6.1-13.6 13.6 0 2.4.6 4.7 1.8 6.8L10 38l7.4-1.9c2 1.1 4.2 1.7 6.5 1.7h.1c7.5 0 13.6-6.1 13.6-13.6 0-3.6-1.4-7-3.9-9.5l-.1-.4zm-9.5 20.9h-.1c-2 0-4-.5-5.8-1.5l-.4-.2-4.4 1.2 1.2-4.3-.3-.5c-1.1-1.8-1.7-3.9-1.7-6 0-6.3 5.1-11.4 11.4-11.4 3 0 5.9 1.2 8 3.3 2.1 2.1 3.3 5 3.3 8-.1 6.3-5.2 11.4-11.2 11.4zm6.2-8.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.1-.8.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.3-.5s0-.4-.1-.5c-.1-.2-.8-1.9-1.1-2.6-.3-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.3 1.4 3.5c.1.2 2.3 3.7 5.7 5.1.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.2-.4-.4-.5-.7-.6z"
      fill="white"
    />
  </svg>
);

// Decorative QR for WhatsApp (green themed)
const WhatsAppQR = () => {
  const size = 9;
  const seed = 17;
  const cells = Array.from({ length: size * size }, (_, i) => {
    const row = Math.floor(i / size);
    const col = i % size;
    if (
      (row < 3 && col < 3) ||
      (row < 3 && col >= size - 3) ||
      (row >= size - 3 && col < 3)
    )
      return true;
    return (i * seed + row * 5 + col * 13) % 3 !== 0;
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
            fill="#25D366"
            rx="0.1"
          />
        ) : null;
      })}
    </svg>
  );
};

// Animated notification bell
const DarshanBenefit = ({
  icon,
  text,
  delay,
}: {
  icon: string;
  text: string;
  delay: number;
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${styles.benefit} ${visible ? styles.benefitVisible : ""}`}
    >
      <span className={styles.benefitIcon}>{icon}</span>
      <span className={styles.benefitText}>{text}</span>
    </div>
  );
};

const benefits = [
  { icon: "🌅", text: "Morning Darshan every day", delay: 100 },
  { icon: "🌆", text: "Evening Aarti updates", delay: 200 },
  { icon: "📿", text: "Divine blessings & mantras", delay: 300 },
  { icon: "🎉", text: "Festival & event notifications", delay: 400 },
  { icon: "📸", text: "Exclusive temple photos", delay: 500 },
  { icon: "🙏", text: "Bapu's spiritual messages", delay: 600 },
];

export default function WhatsAppSection() {
  const [sectionVisible, setSectionVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setSectionVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${sectionVisible ? styles.sectionVisible : ""}`}
    >
      {/* Background */}
      <div className={styles.bg}>
        <div className={styles.bgBase} />
        <div className={styles.bgGlow} />
        <div className={styles.wavesContainer} aria-hidden="true">
          <div
            className={styles.wave}
            style={{ "--d": "0" } as React.CSSProperties}
          />
          <div
            className={styles.wave}
            style={{ "--d": "1" } as React.CSSProperties}
          />
          <div
            className={styles.wave}
            style={{ "--d": "2" } as React.CSSProperties}
          />
        </div>
        <div className={styles.diyas} aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className={styles.diya}
              style={{ "--i": i } as React.CSSProperties}
            >
              🪔
            </span>
          ))}
        </div>
      </div>

      <div className={styles.container}>
        {/* Header ornament */}
        <div className={styles.headerOrnament}>
          <span className={styles.ornLine} />
          <span className={styles.florette}>✿</span>
          <span className={styles.ornLine} />
        </div>

        <div className={styles.subLabel}>ભગવાનનાં દરરોજ દર્શન</div>

        <h2 className={styles.title}>
          Join Our Daily
          <br />
          <span className={styles.titleAccent}>Darshan</span>{" "}
          <span className={styles.titleWa}>WhatsApp</span>
        </h2>

        <p className={styles.subDesc}>
          Begin your day with divine blessings — receive daily darshan of Shree
          Ravirandal Maa directly on WhatsApp
        </p>

        {/* Main content area */}
        <div className={styles.content}>
          {/* Left — benefits */}
          <div className={styles.benefitsColumn}>
            <h3 className={styles.benefitsTitle}>What you'll receive:</h3>
            <div className={styles.benefitsList}>
              {benefits.map((b) => (
                <DarshanBenefit key={b.text} {...b} />
              ))}
            </div>

            <div className={styles.memberCount}>
              <span className={styles.memberNum}>{GROUP_MEMBERS}</span>
              <span className={styles.memberLabel}>
                devotees already joined
              </span>
            </div>
          </div>

          {/* Center — WhatsApp card */}
          <div className={styles.centerCard}>
            {/* Pulsing ring */}
            <div
              className={`${styles.pulseRing} ${pulse ? styles.pulseActive : ""}`}
            />
            <div
              className={`${styles.pulseRing} ${styles.pulseRing2} ${pulse ? styles.pulseActive2 : ""}`}
            />

            <div className={styles.waCard}>
              <div className={styles.waCardTop}>
                <div className={styles.waIconWrap}>
                  <WhatsAppIcon size={72} />
                </div>
                <p className={styles.waCardTitle}>Daily Darshan Group</p>
                <p className={styles.waCardNumber}>{WHATSAPP_NUMBER}</p>
              </div>

              {/* QR code */}
              <div className={styles.qrSection}>
                <p className={styles.qrLabel}>📷 Scan to Join</p>
                <div className={styles.qrBox}>
                  <div className={styles.qrCorner} data-pos="tl" />
                  <div className={styles.qrCorner} data-pos="tr" />
                  <div className={styles.qrCorner} data-pos="bl" />
                  <div className={styles.qrCorner} data-pos="br" />
                  <div className={styles.qrInner}>
                    <WhatsAppQR />
                  </div>
                </div>
                <p className={styles.qrOr}>— or —</p>
              </div>

              {/* CTA button */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.joinBtn}
              >
                <WhatsAppIcon size={22} />
                <span>Join on WhatsApp</span>
              </a>

              <p className={styles.joinNote}>
                Free to join · No spam · Only divine updates
              </p>
            </div>
          </div>

          {/* Right — preview */}
          <div className={styles.previewColumn}>
            <h3 className={styles.previewTitle}>Daily message preview:</h3>

            <div className={styles.chatPreview}>
              <div className={styles.chatHeader}>
                <div className={styles.chatAvatar}>🙏</div>
                <div>
                  <p className={styles.chatName}>Shree Ravirandaldham</p>
                  <p className={styles.chatStatus}>🟢 Daily Darshan Group</p>
                </div>
              </div>

              <div className={styles.chatMessages}>
                <div className={styles.chatMsg}>
                  <span className={styles.chatTime}>6:00 AM</span>
                  <p>
                    🌅 <strong>Mangala Aarti</strong> — Jai Randal Maa!
                  </p>
                  <p className={styles.chatSub}>📸 Today's Morning Darshan</p>
                </div>
                <div className={`${styles.chatMsg} ${styles.chatMsgAlt}`}>
                  <span className={styles.chatTime}>7:30 AM</span>
                  <p>
                    🪷 <em>Shree Ravirandal Maa Ni Jai!</em>
                  </p>
                  <p className={styles.chatSub}>3 photos attached</p>
                </div>
                <div className={styles.chatMsg}>
                  <span className={styles.chatTime}>6:30 PM</span>
                  <p>
                    🌆 <strong>Sandhya Aarti</strong> Time
                  </p>
                  <p className={styles.chatSub}>🎶 Aarti video · 2:34</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className={styles.bottomBanner}>
          <div className={styles.bannerContent}>
            <span className={styles.bannerIcon}>🔔</span>
            <p className={styles.bannerText}>
              Never miss a darshan — Join free and receive blessings every
              morning
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bannerBtn}
            >
              Join Now — Free
            </a>
          </div>
        </div>

        <div className={styles.footerOrnament}>
          <span className={styles.ornLine} />
          <span className={styles.florette}>🪔</span>
          <span className={styles.ornLine} />
          <span className={styles.ornFootText}>॥ जय माँ रांदल ॥</span>
          <span className={styles.ornLine} />
          <span className={styles.florette}>🪔</span>
          <span className={styles.ornLine} />
        </div>
      </div>
    </section>
  );
}
