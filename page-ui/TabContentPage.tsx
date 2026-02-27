"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import sevaPunjanStyles from "@/app/[locale]/upasna-vidhi/seva-punjan/SevaPunjanPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import RandalSahayate from "./randalSahayate";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabData {
  id: string;
  label: string;
  icon: string;
  title: string;
  images: { src: string; alt: string }[];
  bullets: string[];
  highlight?: string;
}

interface TabContentPageProps {
  pageTitle: string;
  tabs: TabData[];
  defaultTab?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const FloatingParticle = ({
  delay,
  duration,
  left,
}: {
  delay: number;
  duration: number;
  left: string;
}) => (
  <div
    className={sevaPunjanStyles.floatingParticle}
    style={{
      left,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

const MandalaIcon = () => (
  <svg
    className={sevaPunjanStyles.mandala}
    width="50"
    height="50"
    viewBox="0 0 50 50"
  >
    <circle
      cx="25"
      cy="25"
      r="23"
      stroke="url(#mandala-grad)"
      strokeWidth="0.5"
      fill="none"
      opacity="0.6"
    />
    <circle
      cx="25"
      cy="25"
      r="18"
      stroke="url(#mandala-grad)"
      strokeWidth="0.5"
      fill="none"
      opacity="0.4"
    />
    <circle
      cx="25"
      cy="25"
      r="13"
      stroke="url(#mandala-grad)"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
    {[...Array(12)].map((_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={25 + 13 * Math.cos(a)}
          y1={25 + 13 * Math.sin(a)}
          x2={25 + 23 * Math.cos(a)}
          y2={25 + 23 * Math.sin(a)}
          stroke="#FFD700"
          strokeWidth="0.3"
          opacity="0.5"
        />
      );
    })}
    <defs>
      <linearGradient id="mandala-grad">
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FFD700" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Main Shared Component ────────────────────────────────────────────────────

const TabContentPage = ({
  pageTitle,
  tabs,
  defaultTab,
}: TabContentPageProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % currentTabData.images.length);
  const prevSlide = () =>
    setCurrentSlide(
      (p) =>
        (p - 1 + currentTabData.images.length) % currentTabData.images.length,
    );

  return (
    <section ref={sectionRef} className={styles.section}>
      <PageBackgroundDecorations />

      {[...Array(12)].map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.8}
          duration={8 + i * 0.5}
          left={`${10 + i * 8}%`}
        />
      ))}

      <div className={sevaPunjanStyles.container}>
        <div className={visibleClass("header", visible)}>
          <CommonTitle text={pageTitle} />
          <LotusDivider />

          <div className={sevaPunjanStyles.sacredSubtitle}>
            <Flame className={sevaPunjanStyles.flameIcon} />
            <span>॥ ભક્તિમાર્ગ — સેવાનો મહિમા ॥</span>
            <Flame className={sevaPunjanStyles.flameIcon} />
          </div>

          {/* Tabs */}
          <div className={sevaPunjanStyles.tabsContainer}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`${sevaPunjanStyles.tab} ${activeTab === tab.id ? sevaPunjanStyles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className={sevaPunjanStyles.tabIcon}>{tab.icon}</span>
                <span className={sevaPunjanStyles.tabLabel}>
                  {tab.label.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i === 0 && <br />}
                    </React.Fragment>
                  ))}
                </span>
                {activeTab === tab.id && (
                  <div className={sevaPunjanStyles.tabGlow} />
                )}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className={sevaPunjanStyles.contentCard}>
            <div className={sevaPunjanStyles.cardTopBorder} />

            <div className={sevaPunjanStyles.titleContainer}>
              <MandalaIcon />
              <h2 className={sevaPunjanStyles.contentTitle}>
                {currentTabData.title}
              </h2>
              <MandalaIcon />
            </div>

            {/* Carousel */}
            <div className={sevaPunjanStyles.carousel}>
              <button
                className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowPrev}`}
                onClick={prevSlide}
              >
                <div className={sevaPunjanStyles.arrowGlow} />
                <ChevronLeft />
              </button>
              <button
                className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowNext}`}
                onClick={nextSlide}
              >
                <div className={sevaPunjanStyles.arrowGlow} />
                <ChevronRight />
              </button>

              <div className={sevaPunjanStyles.carouselInner}>
                <div className={sevaPunjanStyles.carouselTrack}>
                  {currentTabData.images.map((img, index) => (
                    <div
                      key={index}
                      className={sevaPunjanStyles.carouselSlide}
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      <div className={sevaPunjanStyles.imageGlow} />
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={800}
                        height={500}
                        className={sevaPunjanStyles.carouselImage}
                      />
                    </div>
                  ))}
                </div>

                <div className={sevaPunjanStyles.carouselIndicators}>
                  {currentTabData.images.map((_, index) => (
                    <button
                      key={index}
                      className={`${sevaPunjanStyles.indicator} ${currentSlide === index ? sevaPunjanStyles.indicatorActive : ""}`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      {currentSlide === index && (
                        <div className={sevaPunjanStyles.indicatorRing} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bullet content */}
            <div className={sevaPunjanStyles.contentList}>
              <ul className={sevaPunjanStyles.bulletList}>
                {currentTabData.bullets.map((bullet, i) => (
                  <li key={i} className={sevaPunjanStyles.bulletItem}>
                    {bullet}
                  </li>
                ))}
              </ul>

              {currentTabData.highlight && (
                <div className={sevaPunjanStyles.highlightBox}>
                  <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                  <div className={sevaPunjanStyles.highlightContent}>
                    <div className={sevaPunjanStyles.highlightOrnamentTop} />
                    <p className={sevaPunjanStyles.highlightText}>
                      {currentTabData.highlight}
                    </p>
                    <div className={sevaPunjanStyles.highlightOrnamentBottom} />
                  </div>
                  <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                </div>
              )}
            </div>
          </div>

          <RandalSahayate />
        </div>
      </div>
    </section>
  );
};

export default TabContentPage;
