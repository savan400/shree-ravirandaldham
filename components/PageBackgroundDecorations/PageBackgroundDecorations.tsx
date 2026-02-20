import React from 'react'
import styles from "./PageBackgroundDecorations.module.css";
const PageBackgroundDecorations = () => {
    return (
        <>
            <div className={styles.dotGrid} />
            <div className={styles.radialGlow} />
            <div className={styles.omWatermark}>ॐ</div>
            <div className={styles.topGoldBar} />
        </>
    )
}

export default PageBackgroundDecorations