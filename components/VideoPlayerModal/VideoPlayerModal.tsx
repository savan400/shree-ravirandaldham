"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Play, Video, Link2 } from "lucide-react";
import { VideoGalleryEntry, getVideoStreamUrl } from "@/services/gallery-service";

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Extract YouTube video ID from common URL formats */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/** Build a YouTube embed URL from ID */
function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

/** Build a YouTube thumbnail URL from ID */
function youtubeThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface Props {
  video: VideoGalleryEntry;
  isOpen: boolean;
  onClose: () => void;
}

// ── VideoPlayerModal ───────────────────────────────────────────────────────────
const VideoPlayerModal = ({ video, isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  const isLink = video.videoType === 'link';
  const ytId   = isLink ? extractYouTubeId(video.videoUrl || '') : null;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current && !isLink) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay was blocked or failed:", err);
      });
    }
  }, [isOpen, isLink]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Close player"
        >
          <X size={18} />
        </button>

        {/* 16:9 aspect wrapper */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          {isLink ? (
            ytId ? (
              /* YouTube embed */
              <iframe
                className="absolute inset-0 w-full h-full border-none"
                src={youtubeEmbedUrl(ytId)}
                title={video.title.en}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* Generic external link in iframe */
              <iframe
                className="absolute inset-0 w-full h-full border-none"
                src={video.videoUrl}
                title={video.title.en}
                allow="autoplay"
                allowFullScreen
              />
            )
          ) : (
            /* Raw video with live buffering via streaming proxy */
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              src={getVideoStreamUrl(video.videoKey)}
              controls
              autoPlay
              muted={false}
              playsInline
              preload="auto"
            />
          )}
        </div>

        {/* Title bar */}
        <div className="px-4 py-3 flex items-center gap-2 bg-[#1a0900]">
          {isLink ? (
            <Link2 size={14} className="text-amber-400 shrink-0" />
          ) : (
            <Video size={14} className="text-amber-400 shrink-0" />
          )}
          <span className="text-white text-sm font-semibold line-clamp-1">{video.title.en}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
export { extractYouTubeId, youtubeThumbnailUrl };
