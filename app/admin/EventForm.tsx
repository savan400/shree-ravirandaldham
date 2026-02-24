'use client';

import { useState, useRef } from 'react';
import { EventEntry, saveEvent, getImageUrl } from '@/lib/api';
import { AdminButton, Card } from './components/AdminUI';
import { X, Upload, Trash2, CheckCircle2, Plus, AlertCircle } from 'lucide-react';

interface EventFormProps {
  event?: EventEntry;
  onClose: () => void;
  onSave: () => void;
}

type Locale = 'en' | 'hi' | 'gu';

export default function EventForm({ event, onClose, onSave }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>('en');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: event?.title || { en: '', hi: '', gu: '' },
    description: event?.description || { en: '', hi: '', gu: '' },
    location: event?.location || { en: '', hi: '', gu: '' },
    time: event?.time || { en: '', hi: '', gu: '' },
    date: event?.date || '',
    coverImage: event?.coverImage || ''
  });

  const [existingImages, setExistingImages] = useState(event?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleTranslationChange = (field: 'title' | 'description' | 'location' | 'time', lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
    if (errors.length > 0) setErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeExistingImage = (img: string) => {
    setExistingImages(prev => prev.filter(i => i !== img));
    if (formData.coverImage === img) {
      setFormData(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const setAsCoverImage = (img: string) => {
    setFormData(prev => ({ ...prev, coverImage: img }));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.date) newErrors.push("Event Date is required");
    if (!formData.time.en) newErrors.push("Event Time is required");
    if (!formData.title.en.trim()) newErrors.push("English Title is required");
    if (!formData.title.gu.trim()) newErrors.push("Gujarati Title is required");
    if (!formData.title.hi.trim()) newErrors.push("Hindi Title is required");
    
    if (existingImages.length === 0 && newImages.length === 0) {
      newErrors.push("At least one event image is required");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const data = new FormData();
      data.append('data', JSON.stringify({
        ...formData,
        images: existingImages
      }));

      newImages.forEach(file => {
        data.append('images', file);
      });

      await saveEvent(data, event?._id);
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
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
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <p className="text-sm text-gray-500">Fill in the details below to publish an event.</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Validation Errors</span>
          </div>
          <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-6">
            <Card className="p-0 overflow-hidden">
               {/* Common Info Section */}
               <div className="p-6 space-y-4 bg-orange-50/20 border-b border-orange-100">
                  <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Common Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Event Date *</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
                      />
                    </div>
                     <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Event Time *</label>
                      <input 
                        type="time" 
                        value={formData.time.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            time: { en: val, hi: val, gu: val }
                          }));
                          if (errors.length > 0) setErrors([]);
                        }}
                        className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
               </div>

               {/* Tabs for Localized Content */}
               <div className="bg-orange-50/50 border-b border-orange-100 p-1 flex items-center">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2 text-xs font-bold transition-all rounded-lg ${
                        activeTab === tab.id 
                        ? 'bg-white text-orange-600 shadow-sm' 
                        : 'text-gray-500 hover:text-orange-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
               </div>

              <div className="p-6 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Title ({activeTab.toUpperCase()}) *</label>
                    <input 
                      type="text" 
                      value={formData.title[activeTab]}
                      onChange={(e) => handleTranslationChange('title', activeTab, e.target.value)}
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium"
                      placeholder={`Enter ${activeTab} title...`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Location ({activeTab.toUpperCase()})</label>
                    <input 
                      type="text" 
                      value={formData.location[activeTab]}
                      onChange={(e) => handleTranslationChange('location', activeTab, e.target.value)}
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      placeholder="e.g. Temple Ground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Description ({activeTab.toUpperCase()})</label>
                    <textarea 
                      rows={8}
                      value={formData.description[activeTab]}
                      onChange={(e) => handleTranslationChange('description', activeTab, e.target.value)}
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
                      placeholder={`Tell us more about the event in ${activeTab}...`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Image Uploads */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900">Event Gallery</h3>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  Upload Images
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  multiple 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-orange-100 bg-orange-50">
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setAsCoverImage(img)}
                        className={`p-2 rounded-full ${formData.coverImage === img ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(img)}
                        className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {newImages.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-orange-100 bg-orange-50 shadow-inner">
                    <div className="w-full h-full flex flex-col items-center justify-center text-orange-300 text-[10px] text-center p-2">
                      <Upload className="w-6 h-6 mb-1 opacity-50" />
                      <span className="truncate w-full">{file.name}</span>
                      <span className="text-green-600 font-bold mt-1">Pending</span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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

              {formData.coverImage && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Cover photo selected
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-orange-100">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <AdminButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Event'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
