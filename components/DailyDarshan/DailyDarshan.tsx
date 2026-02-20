"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./DailyDarshan.module.css";
import LotusDivider from "../LotusDivider/LotusDivider";
import CommonTitle from "../CommonTitle/CommonTitle";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "../CommonBadge/CommonBadge";
import CommonDarshanCard from "../CommonDarshanCard/CommonDarshanCard";
import { useInView } from "@/hooks/useInView";

export interface DarshanItem {
  id: string;
  image: string;
  date: string;
  day: string;
  title?: string;
}

export const darshanList: DarshanItem[] = [
  {
    id: "1",
    image: "/images/salangpurhanumanji.jpg",
    date: "17-02-2026",
    day: "TUESDAY",
    title: "Morning Darshan",
  },
  {
    id: "2",
    image: "/images/salangpurhanumanji.jpg",
    date: "16-02-2026",
    day: "MONDAY",
    title: "Evening Darshan",
  },
  {
    id: "3",
    image: "/images/salangpurhanumanji.jpg",
    date: "15-02-2026",
    day: "SUNDAY",
    title: "Special Shringar",
  },
  {
    id: "4",
    image: "/images/salangpurhanumanji.jpg",
    date: "14-02-2026",
    day: "SATURDAY",
    title: "Festival Darshan",
  },
  {
    id: "5",
    image: "/images/salangpurhanumanji.jpg",
    date: "13-02-2026",
    day: "FRIDAY",
    title: "Mangala Aarti",
  },
];
// ─── Main Component ───────────────────────────────────────────────────────────

const DailyDarshan: React.FC = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  return (
    <section
      ref={sectionRef}
      id="dev-darshan"
      className={styles.section}
      aria-labelledby="dd-title"
    >
      <PageBackgroundDecorations />
      <div className={styles.container}>

        {/* Section header */}
        <div className={`${styles.header} ${visible ? styles["header--visible"] : styles.hidden}`}>
          <div className={styles.tag}>
            <span className={styles.tagEmoji} aria-hidden="true">🪷</span>
            <span className={styles.tagText}>ભગવાનનાં દરરોજ દર્શન</span>
          </div>
          <CommonTitle text="ડેઈલી દર્શન" />
          <LotusDivider />
        </div>

        {/* Darshan card */}
        <div className={`${styles.cardWrap} ${visible ? styles["card--visible"] : styles.hidden}`}>

          {/* Date badge */}
          <div className={styles.dateBadgeWrap}>
            <CommonBadge text="TUESDAY — 17-02-2026" />
          </div>

          {darshanList.slice(0, 1).map((item) => (
            <CommonDarshanCard
              key={item.id}
              image={item.image}
              date={item.date}
              day={item.day}
              priority
            />
          ))}

          {/* View all */}
          <div className={styles.viewAllWrap}>
            <Link href="/upasna-vidhi/mataji-darshan" className={styles.viewAllLink}>
              VIEW ALL DARSHAN
              <ChevronRight className={styles.viewAllIcon} aria-hidden="true" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DailyDarshan;