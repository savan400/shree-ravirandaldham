"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Lightbox, { LightboxItem } from "@/components/Lightbox/Lightbox";

interface ClickableImageProps {
  /** Single image or array of images for a slideshow */
  items: LightboxItem | LightboxItem[];
  /** The image/card to render */
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * ClickableImage
 *
 * Wraps any image or card with a fullscreen lightbox on click.
 * Uses ReactDOM.createPortal to mount the Lightbox directly on
 * document.body — so it always escapes parent overflow/z-index/position.
 *
 * Usage — single image:
 *   <ClickableImage items={{ src: "/img.jpg", alt: "Temple", title: "॥ દિવ્ય દર્શન ॥" }}>
 *     <CommonImageProfileCard ... />
 *   </ClickableImage>
 *
 * Usage — multiple images (slideshow):
 *   <ClickableImage items={darshanImages}>
 *     <CommonDarshanCard ... />
 *   </ClickableImage>
 */
const ClickableImage: React.FC<ClickableImageProps> = ({
  items,
  children,
  className,
  ariaLabel = "View image in full screen",
}) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Ensure portal target is available (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  const lightboxItems: LightboxItem[] = Array.isArray(items) ? items : [items];

  const openLightbox = () => {
    setIndex(0);
    setOpen(true);
  };

  const next = () => setIndex((i) => (i + 1) % lightboxItems.length);
  const prev = () =>
    setIndex((i) => (i - 1 + lightboxItems.length) % lightboxItems.length);

  return (
    <>
      <div
        className={className}
        onClick={openLightbox}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={(e) => e.key === "Enter" && openLightbox()}
        style={{ cursor: "zoom-in" }}
      >
        {children}
      </div>

      {/* Portal: renders Lightbox directly on document.body */}
      {mounted &&
        open &&
        createPortal(
          <Lightbox
            items={lightboxItems}
            currentIndex={index}
            isOpen={open}
            onClose={() => setOpen(false)}
            onNext={next}
            onPrev={prev}
          />,
          document.body,
        )}
    </>
  );
};

export default ClickableImage;
