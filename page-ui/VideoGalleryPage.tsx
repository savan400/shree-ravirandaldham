"use client"
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import galleryStyles from "@/app/[locale]/events/video-gallery/VideoGalleryPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';
import RandalSahayate from './randalSahayate';
import { fetchVideoGalleries, VideoGalleryEntry } from "@/services/gallery-service";
import { useLocale } from "next-intl";
import VideoPlayerModal, { youtubeThumbnailUrl, extractYouTubeId } from "@/components/VideoPlayerModal/VideoPlayerModal";
import Pagination from "@/components/Pagination/Pagination";
import { Video as VideoIcon, Play } from "lucide-react";
import Image from "next/image";

const PER_PAGE = 12;

// ─── Sub-components ───────────────────────────────────────────────────────────
const OmSymbol = () => (
    <svg viewBox="0 0 100 100" className={galleryStyles.omSvg} aria-hidden="true">
        <text x="50" y="72" textAnchor="middle" fontSize="70" fontFamily="serif" fill="currentColor">ॐ</text>
    </svg>
);

// ─── Video Card ───────────────────────────────────────────────────────────────
const VideoCard: React.FC<{ 
    video: VideoGalleryEntry; 
    index: number; 
    isVisible: boolean; 
    onOpen: (v: VideoGalleryEntry) => void;
    locale: 'en' | 'hi' | 'gu';
}> = ({
    video, index, isVisible, onOpen, locale
}) => {
    const ytId = video.videoType === 'link' ? extractYouTubeId(video.videoUrl || '') : null;
    const thumbUrl = video.thumbnailUrl || (ytId ? youtubeThumbnailUrl(ytId) : null);

    return (
        <div
            className={`${galleryStyles.card} ${isVisible ? galleryStyles.cardVisible : ''}`}
            style={{ animationDelay: `${index * 80}ms` }}
            onClick={() => onOpen(video)}
            role="button"
            aria-label={`Play video: ${video.title[locale] || video.title.en}`}
        >
            {/* Decorative corner mandala */}
            <div className={galleryStyles.cardCorner} aria-hidden="true">
                <OmSymbol />
            </div>

            {/* Thumbnail */}
            <div className={galleryStyles.thumbnailWrap}>
                {thumbUrl ? (
                    <Image 
                        src={thumbUrl}
                        alt={video.title[locale] || video.title.en}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-950/20">
                        <VideoIcon className="w-12 h-12 text-amber-200/30" />
                    </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl transform transition-transform duration-300 hover:scale-110">
                        <Play className="w-6 h-6 text-white ml-1 fill-white" />
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className={galleryStyles.cardBody}>
                <div className={galleryStyles.cardDivider} />
                <h3 className={galleryStyles.cardTitle}>
                    {video.title[locale] || video.title.en}
                </h3>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const VideoGalleryPage = () => {
    const locale = useLocale() as "en" | "hi" | "gu";
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({ threshold: 0.1 });

    const [items, setItems] = useState<VideoGalleryEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [selectedVideo, setSelectedVideo] = useState<VideoGalleryEntry | null>(null);

    const load = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const result = await fetchVideoGalleries(p, PER_PAGE);
            setItems(result.data ?? []);
            setTotal(result.total ?? 0);
        } catch (err) {
            console.error("Failed to load videos:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(page); }, [page, load]);

    const handlePageChange = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            {/* Sacred particle emitters */}
            <div className={galleryStyles.particles} aria-hidden="true">
                {[...Array(12)].map((_, i) => (
                    <span key={i} className={galleryStyles.particle} style={{ '--i': i } as React.CSSProperties} />
                ))}
            </div>

            <div className={galleryStyles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="Video Gallery" />
                    <LotusDivider />

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <VideoIcon className="w-16 h-16 mb-4 opacity-25" />
                            <p className="text-sm font-medium">No videos available yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className={galleryStyles.grid}>
                                {items.map((video, idx) => (
                                    <VideoCard 
                                        key={video._id} 
                                        video={video} 
                                        index={idx} 
                                        isVisible={visible} 
                                        onOpen={setSelectedVideo}
                                        locale={locale}
                                    />
                                ))}
                            </div>

                            <Pagination
                                page={page}
                                total={total}
                                perPage={PER_PAGE}
                                onChange={handlePageChange}
                                className="mt-12"
                            />
                        </>
                    )}

                    <RandalSahayate />
                </div>
            </div>

            {selectedVideo && (
                <VideoPlayerModal 
                    video={selectedVideo}
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </section>
    );
};

export default VideoGalleryPage;