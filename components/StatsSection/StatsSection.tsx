"use client";

import styles from "./StatsSection.module.css";
import PageBackgroundDecorations from "../PageBackgroundDecorations/PageBackgroundDecorations";
import CommonStatsSection, { StatItem } from "../CommonStatsSection/CommonStatsSection";

const YATRIK_STATS: StatItem[] = [
  { iconKey: "height", value: 103, suffix: "", label: "ફૂટ ઉંચું", sublabel: "Height" },
  { iconKey: "floors", value: 11, suffix: "", label: "માળ", sublabel: "Floors" },
  { iconKey: "rooms", value: 1050, suffix: "", label: "રૂમો", sublabel: "Rooms", featured: true },
  { iconKey: "sqft", value: 885000, suffix: "", label: "સ્ક્વેર ફૂટ", sublabel: "Under Construction" },
  { iconKey: "people", value: 4000, suffix: "+", label: "લોકો", sublabel: "Capacity" },
];

const StatsSection: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="ss-title">
      <PageBackgroundDecorations />
      <div className={styles.container}>
        <CommonStatsSection
          title="શ્રી ગોપાળાનંદ સ્વામી"
          subtitle="નૂતન યાત્રિક ભુવનની વિશેષતાઓ"
          footerNote="॥ ભારતનું સૌથી મોટું યાત્રિક ભવન ॥"
          stats={YATRIK_STATS}
        />
      </div>
    </section>
  );
};

export default StatsSection;