'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { fetchCMSPage } from "@/services/cms-service";
import { fetchGalleries, GalleryEntry } from "@/services/gallery-service";
import styles from './GalleryPage.module.css';
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonBadge from '@/components/CommonBadge/CommonBadge';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import { getImageUrl } from "@/services/events-service";
import { Images } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Pagination from '@/components/Pagination/Pagination';

const PER_PAGE = 9;

export default function GalleryPage() {
  const locale = useLocale() as 'en' | 'hi' | 'gu';
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

  const [galleries, setGalleries] = useState<GalleryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadGalleries = useCallback(async (p: number) => {
    setLoading(true);
    const result = await fetchGalleries(p, PER_PAGE);
    setGalleries(result.data);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => { loadGalleries(page); }, [page, loadGalleries]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <PageBackgroundDecorations />
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${visible ? styles.visible : ''}`}>
          <CommonBadge text="॥ ફોટો ગેલેરી ॥" />
          <CommonTitle text="Photo Gallery" />
          <LotusDivider />
          <p className={styles.subtitle}>
            શ્રી કષ્ટભંજનદેવ — ભક્તિના સ્મૃતિ ચિત્રો
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Images className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-sm font-medium">No galleries available yet.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {galleries.map((gallery, index) => (
                <Link
                  key={gallery._id}
                  href={`/gallery/${gallery._id}`}
                  className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className={styles.imageWrapper}>
                    {gallery.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gallery.coverImage}
                        alt={gallery.title[locale] || gallery.title.en}
                        className={styles.coverImage}
                      />
                    ) : (
                      <div className={styles.coverPlaceholder}>
                        <Images className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    <div className={styles.imageOverlay} />
                    <div className={styles.photoCount}>{gallery.images.length} photos</div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {gallery.title[locale] || gallery.title.en}
                    </h3>
                    {locale !== 'en' && gallery.title.en && (
                      <p className={styles.cardSubtitle}>{gallery.title.en}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              page={page}
              total={total}
              perPage={PER_PAGE}
              onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mt-10"
            />
          </>
        )}
      </div>
    </section>
  );
}
