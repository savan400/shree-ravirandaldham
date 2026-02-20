import React from 'react'
import styles from "./DiamondDivider.module.css";
const DiamondDivider = () => {
    return (
        <div className={styles.bottomOrnament}>
            <div className={styles.bottomOrnamentLineLeft} />
            <div className={styles.bottomDiamondSm} />
            <div className={styles.bottomDiamondLg} />
            <div className={styles.bottomDiamondSm} />
            <div className={styles.bottomOrnamentLineRight} />
        </div>
    )
}

export default DiamondDivider