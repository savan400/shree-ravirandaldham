import React from "react";
import styles from "./CommonButton.module.css";

type ButtonVariant = "primary" | "outline";

interface CommonButtonProps {
    text: string;
    variant?: ButtonVariant;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    className?: string;
    icon?: boolean;
}

const CommonButton: React.FC<CommonButtonProps> = ({
    text,
    variant = "primary",
    type = "button",
    onClick,
    className,
    icon = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.btn} ${styles[`btn--${variant}`]} ${className || ""}`}
        >
            {text}
            {icon && <span className={styles.ctaArrow} aria-hidden="true">→</span>}

        </button>
    );
};

export default CommonButton;
