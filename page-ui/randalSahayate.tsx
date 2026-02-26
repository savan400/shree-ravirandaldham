import DiamondDivider from '@/components/DiamondDivider/DiamondDivider'
import { visibleClass } from '@/lib/utils'
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import { useTranslations } from 'next-intl';

export default function RandalSahayate() {
  const t = useTranslations('common');
  return (
    <div className={visibleClass("footer", true)} style={{ marginTop: "4rem" }}>
        <DiamondDivider />
        <p className={styles.footerBlessing} style={{ marginTop: "20px", fontWeight: 900 }}>
            ॥ {t('randalSahayate')}  ॥
        </p>
    </div>
  )
}
