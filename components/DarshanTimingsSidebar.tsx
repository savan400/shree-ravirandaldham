"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./DarshanTimingsSidebar.module.css";

const timings = [
  {
    label: "મંગળા આરતી",
    labelEn: "Mangala Aarti",
    time: "06:15",
    period: "સવારે",
    periodEn: "Morning",
    icon: "🌅",
  },
  {
    label: "થાળ",
    labelEn: "Thal",
    time: "11:00",
    period: "બપોરે",
    periodEn: "Afternoon",
    icon: "🪔",
  },
  {
    label: "સંધ્યા આરતી",
    labelEn: "Sandhya Aarti",
    time: "06:30",
    period: "સાંજે",
    periodEn: "Evening",
    icon: "🌙",
  },
];

const staggerClasses = [styles.stagger1, styles.stagger2, styles.stagger3];

const DarshanTimingsSidebar = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [diyas, setDiyas] = useState<{ id: number; x: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setDiyas(
        Array.from({ length: 6 }, (_, i) => ({
          id: i,
          x: 10 + i * 15,
          delay: i * 0.3,
          dur: 2 + Math.random() * 1.5,
        }))
      );
    } else {
      setVisible(false);
    }
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={styles.templeBtn}
        aria-label="Open Darshan Timings"
      >
        <span className={styles.templeBtnInner}>
          <span className={styles.bellIcon}>🔔</span>
          <span>Darshan Timings</span>
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div className={`${styles.panel} ${visible ? styles.panelVisible : ""}`}>

          {/* Decorative diya bar at top */}
          <div className={styles.diyaBar}>
            <div className={styles.diyaRow}>
              {diyas.map((d) => (
                <div key={d.id} className={styles.diyaWrap}>
                  <div
                    className={styles.diyaFlame}
                    style={{ "--dur": `${d.dur}s`, animationDelay: `${d.delay}s` } as React.CSSProperties}
                  >
                    <div className={styles.flameShape} />
                  </div>
                  <div className={styles.diyaBase} />
                </div>
              ))}
            </div>
          </div>

          {/* Top divider */}
          <div className={styles.divider} />

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInner}>
              <div className={styles.titleWrap}>
                <h3 className={styles.titleMain}>Darshan</h3>
                <h4 className={styles.titleSub}>Timings</h4>
                <p className={styles.titleGu}>દર્શન સમય</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={styles.dividerBottom} />

          {/* Timing Cards */}
          <div className={styles.cardList}>
            {timings.map((item, i) => (
              <div key={i} className={`${styles.timingCard} ${staggerClasses[i]}`}>

                {/* Floating particles */}
                {[...Array(3)].map((_, p) => (
                  <div
                    key={p}
                    className={styles.particle}
                    style={{
                      left: `${20 + p * 30}%`,
                      bottom: "12px",
                      "--dur": `${2 + p * 0.7}s`,
                      "--delay": `${p * 0.5}s`,
                    } as React.CSSProperties}
                  />
                ))}

                <div className={styles.cardBody}>
                  <div className={styles.cardLeft}>
                    <div className={styles.iconCircle}>{item.icon}</div>
                    <div>
                      <p className={styles.labelGu}>{item.label}</p>
                      <p className={styles.labelEn}>{item.labelEn}</p>
                    </div>
                  </div>

                  <div className={styles.cardRight}>
                    <p className={styles.timeDisplay}>{item.time}</p>
                    <p className={styles.periodLabel}>
                      {item.period} · <span style={{ fontFamily: 'var(--font-cinzel)' }}>{item.periodEn}</span>
                    </p>
                  </div>
                </div>

                <div className={styles.cardDivider} />
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
};

export default DarshanTimingsSidebar;