'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from "@/services/events-service";
import { fetchCMSPage, CMSPageEntry } from "@/services/cms-service";
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import CommonBadge from '@/components/CommonBadge/CommonBadge';
import { Card } from '@/app/admin/components/AdminUI';
import { Info, Image as ImageIcon, BarChart3 } from 'lucide-react';

interface CMSContentProps {
  pageKey: string;
  locale: 'en' | 'hi' | 'gu';
  className?: string;
}

export default function CMSContent({ pageKey, locale, className = '' }: CMSContentProps) {
  const [page, setPage] = useState<CMSPageEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchCMSPage(pageKey);
      setPage(data);
      setLoading(false);
    };
    load();
  }, [pageKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center text-gray-500 bg-orange-50/20 rounded-2xl border border-dashed border-orange-200">
        <Info className="w-8 h-8 mx-auto mb-2 text-orange-200" />
        <p>Information for <span className="font-mono font-bold">{pageKey}</span> is currently unavailable.</p>
      </div>
    );
  }

  const title = page.title[locale] || page.title.en;
  let description = page.description[locale] || page.description.en;
  const badge = page.badgeText[locale] || page.badgeText.en;
  const quote = page.quote?.[locale] || page.quote?.en || '';

  if (description && quote) {
    description = description.replace(/{quote}/g, `<blockquote class="cms-quote text-2xl font-black text-orange-600 my-8 pl-6 border-l-4 border-orange-500 italic">"${quote}"</blockquote>`);
  }

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-4">
        {badge && <CommonBadge text={badge} />}
        {title && <CommonTitle text={title} />}
      </div>

      {/* Main Content & Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          {description && (
             <div 
               className="prose prose-orange lg:prose-lg max-w-none text-gray-700 leading-relaxed cms-rich-text"
               dangerouslySetInnerHTML={{ __html: description }}
             />
          )}

          {/* Analytics / Stats Section */}
          {page.analytics && page.analytics.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {page.analytics.map((item, idx) => (
                <div key={idx} className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
                  {item.value && <span className="text-3xl font-black text-orange-600 mb-1">{item.value}</span>}
                  {item.key && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.key}</span>}
                  {(item.title?.[locale] || item.title?.en) && (
                    <p className="mt-2 text-sm font-bold text-gray-800">{item.title?.[locale] || item.title?.en}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Display */}
        {page.images && page.images.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {page.images.map((img, idx) => (
              <div key={idx} className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-orange-900/10">
                <img 
                  src={typeof img === 'string' ? img : img.url} 
                  alt={`${title} - ${idx + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center aspect-video bg-orange-50 rounded-3xl border-2 border-dashed border-orange-100 text-orange-200">
             <ImageIcon className="w-16 h-16" />
          </div>
        )}
      </div>

      <style jsx global>{`
        .cms-rich-text h1 { font-size: 2rem; font-weight: 800; color: #1A0800; margin-bottom: 1.5rem; }
        .cms-rich-text h2 { font-size: 1.5rem; font-weight: 700; color: #1A0800; margin-top: 2rem; margin-bottom: 1rem; }
        .cms-rich-text p { margin-bottom: 1.25rem; }
        .cms-rich-text ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .cms-rich-text li { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
