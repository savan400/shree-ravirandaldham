import React from 'react'
import styles from "./LotusDivider.module.css";
import LotusSvg from '../LotusSvg';
const LotusDivider = () => {
    return (
        <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <div className={styles.dividerDiamond} />
            <LotusSvg />
            <div className={styles.dividerDiamond} />
            <div className={styles.dividerLine} />
        </div>
    )
}

export default LotusDivider