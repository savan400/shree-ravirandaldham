import React from "react";
import styles from "./CommonBadge.module.css";

interface CommonBadgeProps {
    text: string;
    className?: string;
}

const CommonBadge: React.FC<CommonBadgeProps> = ({ text, className }) => {
    return (
        <div className={`${styles.badge} ${className || ""}`}>
            <div className={styles.badgeDot} />
            <span className={styles.badgeText}>{text}</span>
        </div>
    );
};

export default CommonBadge;
