'use client';

import { useState, useCallback } from 'react';
import { CMSPageEntry, saveCMSPage, getImageUrl } from '@/lib/api';
import { AdminButton, Card } from './components/AdminUI';
import { X, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import ImageUploadGrid, { GridImage } from './components/ImageUploadGrid';

interface CMSPageFormProps {
  page?: CMSPageEntry;
  onClose: () => void;
  onSave: () => void;
}

type Locale = 'en' | 'hi' | 'gu';

export default function CMSPageForm({ page, onClose, onSave }: CMSPageFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>('en');
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    key: page?.key || '',
    title: page?.title || { en: '', hi: '', gu: '' },
    badgeText: page?.badgeText || { en: '', hi: '', gu: '' },
    description: page?.description || { en: '', hi: '', gu: '' },
    quote: page?.quote || { en: '', hi: '', gu: '' },
    analytics: page?.analytics || []
  });

  const [images, setImages] = useState<GridImage[]>(() => [
    ...(page?.images || []).map((url, i) => ({
      id: `existing-${i}-${url.slice(-12)}`,
      isNew: false,
      url: getImageUrl(url),
    })),
  ]);

  const handleTranslationChange = (field: 'title' | 'badgeText' | 'description' | 'quote', lang: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: { ...prev[field as keyof typeof prev], [lang]: value } }));
    if (errors.length > 0) setErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleAddImage = useCallback((files: File[]) => {
    setImages(prev => [
      ...prev,
      ...files.map(file => ({
        id: `new-${Date.now()}-${Math.random()}`,
        isNew: true,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const handleAddAnalytics = () => {
    setFormData(prev => ({
      ...prev,
      analytics: [...prev.analytics, { 
        key: '', 
        value: '', 
        title: { en: '', hi: '', gu: '' }, 
        description: { en: '', hi: '', gu: '' } 
      }]
    }));
  };

  const handleRemoveAnalytics = (index: number) => {
    setFormData(prev => ({
      ...prev,
      analytics: prev.analytics.filter((_, i) => i !== index)
    }));
  };

  const updateAnalyticsField = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newAnalytics = [...prev.analytics];
      newAnalytics[index] = { ...newAnalytics[index], [field]: value };
      return { ...prev, analytics: newAnalytics };
    });
  };

  const updateAnalyticsTranslation = (index: number, field: 'title' | 'description', lang: string, value: string) => {
    setFormData(prev => {
      const newAnalytics = [...prev.analytics];
      const currentField = (newAnalytics[index] as any)[field] || { en: '', hi: '', gu: '' };
      (newAnalytics[index] as any)[field] = { ...currentField, [lang]: value };
      return { ...prev, analytics: newAnalytics };
    });
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.key.trim()) {
      newErrors.push('Page Key is required');
    } else if (!/^[a-z0-9-]+$/.test(formData.key)) {
      newErrors.push('Page Key must be lowercase alphanumeric and hyphens only');
    }

    if (!formData.title.en.trim()) newErrors.push('English Title is required');
    if (!formData.title.hi.trim()) newErrors.push('Hindi Title is required');
    if (!formData.title.gu.trim()) newErrors.push('Gujarati Title is required');

    if (!formData.badgeText.en.trim()) newErrors.push('English Badge Text is required');
    if (!formData.badgeText.hi.trim()) newErrors.push('Hindi Badge Text is required');
    if (!formData.badgeText.gu.trim()) newErrors.push('Gujarati Badge Text is required');

    if (!formData.description.en.trim()) newErrors.push('English Description is required');
    if (!formData.description.hi.trim()) newErrors.push('Hindi Description is required');
    if (!formData.description.gu.trim()) newErrors.push('Gujarati Description is required');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const data = new FormData();
      const existingUrls = images.filter(img => !img.isNew).map(img => img.url);
      
      data.append('data', JSON.stringify({
        ...formData,
        keepImages: existingUrls, // This helps backend know which to preserve
      }));

      images.filter(img => img.isNew && img.file).forEach(img => {
        data.append('images', img.file!);
      });

      await saveCMSPage(data, page?._id);
      onSave();
    } catch (error) {
      console.error('Error saving CMS page:', error);
      alert('Failed to save CMS page');
    } finally {
      setLoading(false);
    }
  };

  const tabs: {id: Locale, label: string}[] = [
    { id: 'en', label: 'English' },
    { id: 'gu', label: 'Gujarati' },
    { id: 'hi', label: 'Hindi' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {page ? 'Edit CMS Page' : 'Add New CMS Page'}
          </h2>
          <p className="text-sm text-gray-500">Define the structure and content for this page key.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <ul className="text-xs text-red-600 list-disc list-inside">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Page Key (Unique Identifier) *</label>
                <input 
                  type="text" 
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 font-mono font-bold text-orange-600"
                  placeholder="e.g. membership-info"
                  disabled={!!page}
                />
              </div>

              <div className="flex bg-orange-100/50 p-1 rounded-xl">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-orange-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Title ({activeTab.toUpperCase()}) *</label>
                  <input 
                    type="text" 
                    value={formData.title[activeTab]}
                    onChange={(e) => handleTranslationChange('title', activeTab, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Page Main Title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Badge Text ({activeTab.toUpperCase()}) *</label>
                  <input 
                    type="text" 
                    value={formData.badgeText[activeTab]}
                    onChange={(e) => handleTranslationChange('badgeText', activeTab, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                    placeholder="Brief badge (required)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Quote ({activeTab.toUpperCase()})</label>
                  <textarea 
                    rows={3}
                    value={formData.quote?.[activeTab] || ''}
                    onChange={(e) => handleTranslationChange('quote', activeTab, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm italic"
                    placeholder={`Enter quote in ${activeTab}...`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description / Rich Text ({activeTab.toUpperCase()}) *</label>
                  <textarea 
                    rows={10}
                    value={formData.description[activeTab]}
                    onChange={(e) => handleTranslationChange('description', activeTab, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono"
                    placeholder="Enter HTML or text content. Use {quote} to inject the quote."
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <ImageUploadGrid
                images={images}
                onAdd={handleAddImage}
                onRemove={handleRemoveImage}
                title="Page Images"
                maxImages={10}
              />
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-700">Analytics Data (Key-Value)</h3>
                <AdminButton type="button" size="sm" variant="ghost" onClick={handleAddAnalytics} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Row
                </AdminButton>
              </div>
              <div className="space-y-4">
                {formData.analytics.map((item, idx) => (
                  <div key={idx} className="p-4 border border-orange-100 rounded-xl bg-orange-50/10 space-y-3 relative group">
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAnalytics(idx)}
                      className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        placeholder="Key (e.g. Label)" 
                        value={item.key} 
                        onChange={(e) => updateAnalyticsField(idx, 'key', e.target.value)}
                        className="bg-white border text-xs px-3 py-2 rounded-lg"
                      />
                      <input 
                        placeholder="Value (e.g. 10k+)" 
                        value={item.value} 
                        onChange={(e) => updateAnalyticsField(idx, 'value', e.target.value)}
                        className="bg-white border text-xs px-3 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <input 
                        placeholder={`Title (${activeTab})`}
                        value={item.title?.[activeTab] || ''} 
                        onChange={(e) => updateAnalyticsTranslation(idx, 'title', activeTab, e.target.value)}
                        className="w-full bg-white border text-xs px-3 py-2 rounded-lg"
                      />
                      <textarea 
                        placeholder={`Description (${activeTab})`}
                        value={item.description?.[activeTab] || ''} 
                        onChange={(e) => updateAnalyticsTranslation(idx, 'description', activeTab, e.target.value)}
                        className="w-full bg-white border text-xs px-3 py-2 rounded-lg"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <AdminButton type="button" variant="ghost" onClick={onClose}>Cancel</AdminButton>
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save CMS Page'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
