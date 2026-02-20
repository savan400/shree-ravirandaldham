import DiamondDivider from '@/components/DiamondDivider/DiamondDivider'
import { visibleClass } from '@/lib/utils'
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";

export default function RandalSahayate() {
  return (
    <div className={visibleClass("footer", true)} style={{ marginTop: "4rem" }}>
        <DiamondDivider />
        <p className={styles.footerBlessing} style={{ marginTop: "20px", fontWeight: 'bold' }}>
            ॥ શ્રી રવિ રાંદલ સદા સહાયતે  ॥
        </p>
    </div>
  )
}
