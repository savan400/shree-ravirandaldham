'use client';

import { useState, useCallback } from 'react';
import { GalleryEntry, saveGallery } from '@/lib/api';
import { AdminButton, Card } from './components/AdminUI';
import { X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import ImageUploadGrid, { GridImage } from './components/ImageUploadGrid';

interface GalleryFormProps {
  gallery?: GalleryEntry;
  onClose: () => void;
  onSave: () => void;
}

type Locale = 'en' | 'hi' | 'gu';

export default function GalleryForm({ gallery, onClose, onSave }: GalleryFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>('en');
  const [errors, setErrors] = useState<string[]>([]);

  const [title, setTitle] = useState(gallery?.title || { en: '', hi: '', gu: '' });
  const [isEnabled, setIsEnabled] = useState(gallery?.isEnabled !== false);
  const [coverId, setCoverId] = useState<string>(
    gallery?.images.find(img => img.url === gallery.coverImage)?._id ?? ''
  );

  // Unified image list (existing + new uploads)
  const [images, setImages] = useState<GridImage[]>(
    (gallery?.images || []).map(img => ({
      id: img._id,
      isNew: false,
      url: img.url,
      description: {
        en: img.description?.en || '',
        hi: img.description?.hi || '',
        gu: img.description?.gu || '',
      },
    }))
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = useCallback((files: File[]) => {
    const newItems: GridImage[] = files.map(file => ({
      id: `new-${Date.now()}-${Math.random()}`,
      isNew: true,
      url: URL.createObjectURL(file),
      file,
      description: { en: '', hi: '', gu: '' },
    }));
    setImages(prev => [...prev, ...newItems]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (coverId === id) setCoverId('');
  }, [coverId]);

  const handleDescriptionChange = useCallback((id: string, lang: Locale, value: string) => {
    setImages(prev => prev.map(img =>
      img.id === id ? { ...img, description: { ...img.description!, [lang]: value } } : img
    ));
  }, []);

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const errs: string[] = [];
    if (!title.en.trim()) errs.push('English title is required');
    if (!title.gu.trim()) errs.push('Gujarati title is required');
    if (!title.hi.trim()) errs.push('Hindi title is required');
    if (images.length === 0) errs.push('At least one image is required');
    setErrors(errs);
    return errs.length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const fd = new FormData();

      const keepImageIds = images.filter(img => !img.isNew).map(img => img.id);
      const imageDescriptions: Record<string, { en: string; hi: string; gu: string }> = {};
      images.filter(img => !img.isNew).forEach(img => {
        imageDescriptions[img.id] = img.description!;
      });
      const newImageDescriptions = images.filter(img => img.isNew).map(img => img.description);

      // coverId is a MongoDB _id — backend resolves it to a Wasabi key
      const coverImgEntry = images.find(img => img.id === coverId && !img.isNew);
      const coverImageIdToSend = coverImgEntry?.id || '';

      fd.append('data', JSON.stringify({
        title,
        isEnabled,
        keepImageIds,
        imageDescriptions,
        imageDescriptions_new: newImageDescriptions,
        coverImageId: coverImageIdToSend,
      }));

      images.filter(img => img.isNew && img.file).forEach(img => {
        fd.append('images', img.file!);
      });

      await saveGallery(fd, gallery?._id);
      onSave();
    } catch (err) {
      console.error(err);
      alert('Failed to save gallery');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Locale; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'gu', label: 'Gujarati' },
    { id: 'hi', label: 'Hindi' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{gallery ? 'Edit Gallery' : 'New Gallery'}</h2>
          <p className="text-sm text-gray-500">Fill in details and upload photos.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
            <AlertCircle className="w-4 h-4" /> Validation Errors
          </div>
          <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Title + Settings */}
          <div className="space-y-6">
            <Card className="p-0 overflow-hidden">
              {/* Settings row */}
              <div className="p-6 bg-orange-50/20 border-b border-orange-100 flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Gallery Settings</span>
                <button
                  type="button"
                  onClick={() => setIsEnabled(v => !v)}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    isEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {isEnabled ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {/* Language tabs */}
              <div className="bg-orange-50/50 border-b border-orange-100 p-1 flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-orange-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <label className="text-sm font-bold text-gray-700">
                  Gallery Title ({activeTab.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  value={title[activeTab]}
                  onChange={e => setTitle(prev => ({ ...prev, [activeTab]: e.target.value }))}
                  className="mt-2 w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium"
                  placeholder={`Enter ${activeTab} title…`}
                />
              </div>
            </Card>

            {/* Cover info */}
            {coverId && (
              <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-amber-100">
                ✅ Cover photo selected
              </div>
            )}
          </div>

          {/* Right — Images */}
          <div className="space-y-6">
            <Card className="p-6">
              <ImageUploadGrid
                images={images}
                coverId={coverId}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onSetCover={setCoverId}
                onDescriptionChange={handleDescriptionChange}
                title="Gallery Photos"
              />
              <p className="text-[10px] text-gray-400 mt-3">
                ✅ Click <b>Set Cover</b> on a photo to use it as the gallery thumbnail.
              </p>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-orange-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Saving…' : gallery ? 'Update Gallery' : 'Create Gallery'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
