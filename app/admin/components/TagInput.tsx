'use client';

import { useState, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({ tags, onChange, placeholder, className = '' }: TagInputProps) {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (tags.length === 0) return;
    const text = tags.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
    }).catch(err => {
      console.error('Failed to copy tags:', err);
    });
  };

  const addTags = (newTags: string[]) => {
    const cleaned = newTags
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const uniqueTags = [...tags];
    cleaned.forEach(tag => {
      const lowerTag = tag.toLowerCase();
      if (!uniqueTags.some(t => t.toLowerCase() === lowerTag)) {
        uniqueTags.push(tag);
      }
    });

    onChange(uniqueTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === 'c' && !input) {
      handleCopy();
      return;
    }

    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      if (input.trim()) {
        addTags([input]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const pastedTags = pasteData.split(/[,\n]/);
    addTags(pastedTags);
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div className={`relative group flex flex-wrap gap-2 p-2 min-h-[44px] bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-400 transition-all ${className}`}>
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200 z-50">
          <Check size={12} className="text-green-400" />
          Keywords Copied!
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        title="Copy all tags"
        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Copy size={14} />
      </button>

      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold border border-orange-100 animate-in zoom-in-95 duration-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="p-0.5 hover:bg-orange-200 rounded-full transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1 placeholder:text-gray-400"
      />
    </div>
  );
}
