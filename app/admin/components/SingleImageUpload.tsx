'use client';

import { useState, useRef } from 'react';
import { Upload, ImageIcon, Trash2, Loader2, AlertCircle } from 'lucide-react';

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  label?: string;
  helperText?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'any';
}

export default function SingleImageUpload({
  value,
  onChange,
  onUpload,
  label,
  helperText,
  className = '',
  aspectRatio = 'video'
}: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    any: 'min-h-[200px]'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <h3 className="font-bold text-gray-900 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-orange-500" />
        {label}
      </h3>}
      
      <div className="space-y-4">
        {/* Preview Area */}
        <div className={`
          relative group ${aspectClass[aspectRatio]} bg-orange-50 rounded-xl overflow-hidden border border-orange-100 
          flex items-center justify-center transition-all
        `}>
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                  title="Remove Image"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-6 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-orange-100/50 flex items-center justify-center mb-1">
                <ImageIcon className="w-6 h-6 text-orange-200" />
              </div>
              <p className="text-xs font-medium text-orange-300">No image selected</p>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Uploading...</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`
              flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-dashed border-orange-200 
              bg-orange-50/30 text-orange-500 font-bold text-sm hover:border-orange-400 hover:text-orange-600 
              hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Processing...' : value ? 'Replace Image' : 'Select & Upload Image'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {helperText && !error && (
          <p className="text-[10px] text-gray-400 leading-relaxed text-center italic">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
