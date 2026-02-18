import React from "react";
import styles from "./CommonTitle.module.css";

interface CommonTitleProps {
    text: string;
    className?: string;
}

const CommonTitle: React.FC<CommonTitleProps> = ({ text, className }) => {
    return (
        <h1 className={`${styles.title} ${className || ""}`}>
            {text}
        </h1>
    );
};

export default CommonTitle;
