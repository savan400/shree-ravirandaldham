"use client";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import styles from "./Lightbox.module.css";

export interface LightboxItem {
    src: string;
    alt: string;
    title?: string;
    date?: string;
}

interface LightboxProps {
    items: LightboxItem[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const Lightbox = ({
    items,
    currentIndex,
    isOpen,
    onClose,
    onNext,
    onPrev,
}: LightboxProps) => {
    const current = items[currentIndex];

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        },
        [isOpen, onClose, onNext, onPrev]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    if (!isOpen || !current) return null;

    return (
        <div className={styles.lightbox} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image lightbox">
            {/* Close */}
            <button className={styles.lightboxClose} onClick={onClose} aria-label="Close lightbox">
                <X size={20} />
            </button>

            {/* Prev */}
            {items.length > 1 && (
                <button
                    className={`${styles.lightboxNav} ${styles.navPrev}`}
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={22} />
                </button>
            )}

            {/* Next */}
            {items.length > 1 && (
                <button
                    className={`${styles.lightboxNav} ${styles.navNext}`}
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    aria-label="Next image"
                >
                    <ChevronRight size={22} />
                </button>
            )}

            {/* Content */}
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <Image
                    src={current.src}
                    alt={current.alt || "Lightbox image"}
                    width={1200}
                    height={800}
                    className={styles.lightboxImage}
                    priority
                />

                {(current.title || current.date) && (
                    <div className={styles.lightboxInfo}>
                        {current.date && (
                            <div className={styles.lightboxDate}>
                                <Calendar size={14} />
                                {current.date}
                            </div>
                        )}
                        {current.title && (
                            <h3 className={styles.lightboxTitle}>{current.title}</h3>
                        )}
                        {items.length > 1 && (
                            <p className={styles.lightboxCounter}>
                                {currentIndex + 1} / {items.length}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox;