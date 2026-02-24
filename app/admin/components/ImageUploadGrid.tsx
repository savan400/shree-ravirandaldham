'use client';

import { useRef } from 'react';
import { Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface GridImage {
  id: string;      // existing _id  OR  temp key "new-…" for pending uploads
  isNew: boolean;
  url: string;     // pre-signed URL (existing) or blob URL (new)
  file?: File;
  /** Optional i18n captions — only used by GalleryForm */
  description?: { en: string; hi: string; gu: string };
}

interface Props {
  images: GridImage[];
  coverId?: string;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onSetCover?: (id: string) => void;
  onDescriptionChange?: (id: string, lang: 'en' | 'hi' | 'gu', value: string) => void;
  title?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared photo tile (used by grid layout)
// ─────────────────────────────────────────────────────────────────────────────

function PhotoTile({ img, coverId, onSetCover, onRemove }: {
  img: GridImage;
  coverId?: string;
  onSetCover?: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-orange-100 bg-orange-50">
      <img src={img.url} alt="" className="w-full h-full object-cover" />

      {img.isNew && (
        <div className="absolute top-1.5 left-1.5 bg-green-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          NEW
        </div>
      )}

      {coverId && coverId === img.id && (
        <div className="absolute top-1.5 right-1.5 bg-amber-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <CheckCircle2 className="w-2.5 h-2.5" /> Cover
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {onSetCover && (
          <button
            type="button"
            onClick={() => onSetCover(img.id)}
            title="Set as cover"
            className={`p-2 rounded-full transition-colors ${
              coverId === img.id ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(img.id)}
          title="Remove"
          className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ImageUploadGrid({
  images,
  coverId,
  onAdd,
  onRemove,
  onSetCover,
  onDescriptionChange,
  title = 'Photos',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasCaptions = !!onDescriptionChange;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onAdd(Array.from(e.target.files));
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
        <h3 className="font-bold text-gray-900">
          {title}
          {images.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">({images.length})</span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <Upload className="w-3 h-3" /> Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* ── GALLERY LIST MODE (with captions) ─────────────────────────────── */}
      {hasCaptions ? (
        <div className="space-y-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex gap-4 bg-orange-50/40 rounded-2xl border border-orange-100 p-3"
            >
              {/* Left: square thumbnail with action buttons below */}
              <div className="flex-shrink-0 flex flex-col gap-2">
                <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-orange-100 bg-orange-50">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {img.isNew && (
                    <div className="absolute top-1 left-1 bg-green-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      NEW
                    </div>
                  )}
                  {coverId && coverId === img.id && (
                    <div className="absolute bottom-1 left-1 right-1 bg-amber-500/90 text-white text-[9px] font-bold text-center rounded-full py-0.5 flex items-center justify-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Cover
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-1.5 justify-center">
                  {onSetCover && (
                    <button
                      type="button"
                      onClick={() => onSetCover(img.id)}
                      title="Set as cover"
                      className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1 rounded-lg transition-colors ${
                        coverId === img.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {coverId === img.id ? 'Cover' : 'Set Cover'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(img.id)}
                    title="Remove"
                    className="flex items-center justify-center p-1.5 rounded-lg bg-white border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right: full-width caption fields */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Caption</p>
                {(['en', 'hi', 'gu'] as const).map(lang => (
                  <div key={lang} className="space-y-0.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Gujarati'}
                    </label>
                    <textarea
                      rows={2}
                      value={img.description?.[lang] ?? ''}
                      onChange={e => onDescriptionChange!(img.id, lang, e.target.value)}
                      placeholder={`${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Gujarati'} caption…`}
                      className="w-full bg-white border border-orange-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add more — full-width dashed row */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 flex items-center justify-center gap-2 text-orange-300 hover:border-orange-400 hover:text-orange-400 hover:bg-orange-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-bold">Add More Images</span>
          </button>
        </div>
      ) : (
        // ── EVENTS GRID MODE (no captions) ───────────────────────────────────
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => (
            <PhotoTile
              key={img.id}
              img={img}
              coverId={coverId}
              onSetCover={onSetCover}
              onRemove={onRemove}
            />
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/5] rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/50 flex flex-col items-center justify-center text-orange-300 hover:border-orange-400 hover:text-orange-400 transition-colors"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold">Add Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
