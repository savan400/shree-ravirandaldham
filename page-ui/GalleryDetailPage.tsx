'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { GalleryEntry } from '@/lib/api';
import styles from './GalleryDetailPage.module.css';
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import { ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';

interface Props {
  gallery: GalleryEntry;
}

export default function GalleryDetailPage({ gallery }: Props) {
  const locale = useLocale() as 'en' | 'hi' | 'gu';
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = gallery.images.length;

  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const activeImage = gallery.images[current];
  const title = gallery.title[locale] || gallery.title.en;
  const description = activeImage?.description?.[locale] || activeImage?.description?.en || '';

  return (
    <section className={styles.section}>
      <PageBackgroundDecorations />

      <div className={styles.container}>
        {/* Back link */}
        <Link href="/gallery" className={styles.backLink}>
          <ArrowLeft className="w-4 h-4" />
          <span>All Galleries</span>
        </Link>

        {/* Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <LotusDivider />
          <p className={styles.photoCount}>{total} Photos</p>
        </div>

        {/* Main Slider */}
        {total > 0 ? (
          <div className={styles.sliderWrapper}>
            {/* Main image */}
            <div className={styles.mainImageContainer} onClick={() => setLightbox(true)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage.url}
                alt={description || title}
                className={styles.mainImage}
              />
              <div className={styles.mainImageOverlay} />
              <div className={styles.expandHint}>Click to view full size</div>
            </div>

            {/* Prev / Next controls */}
            <button className={`${styles.navBtn} ${styles.navBtnPrev}`} onClick={prev} aria-label="Previous">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={next} aria-label="Next">
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Description */}
            {description && (
              <div className={styles.descriptionBox}>
                <p className={styles.descriptionText}>{description}</p>
              </div>
            )}

            {/* Counter */}
            <div className={styles.counter}>
              {current + 1} / {total}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">No images in this gallery.</p>
        )}

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className={styles.thumbnailStrip}>
            {gallery.images.map((img, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <button
                key={img._id}
                onClick={() => setCurrent(idx)}
                className={`${styles.thumbnail} ${idx === current ? styles.thumbnailActive : ''}`}
              >
                <img src={img.url} alt="" className={styles.thumbnailImg} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && activeImage && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(false)}>
            <X className="w-6 h-6" />
          </button>
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.url}
            alt={description || title}
            className={styles.lightboxImage}
            onClick={e => e.stopPropagation()}
          />
          <button
            className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          {description && (
            <div className={styles.lightboxCaption}>{description}</div>
          )}
        </div>
      )}
    </section>
  );
}
