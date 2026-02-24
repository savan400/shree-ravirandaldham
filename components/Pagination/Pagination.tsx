'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
  /** Set true to scroll to top of window on page change (default: false) */
  scrollToTop?: boolean;
  className?: string;
}

export default function Pagination({
  page,
  total,
  perPage,
  onChange,
  scrollToTop = false,
  className = '',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const go = (p: number) => {
    onChange(p);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show max 7 page numbers with ellipsis
  const getPages = (): (number | '…')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
    if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', page - 1, page, page + 1, '…', totalPages];
  };

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Prev */}
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-full border border-[#e9bc47]/40 text-[#8b6914] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {getPages().map((n, i) =>
        n === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-gray-400">…</span>
        ) : (
          <button
            key={n}
            onClick={() => go(n as number)}
            className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
              n === page
                ? 'bg-[#c8902c] text-white shadow-md'
                : 'border border-[#e9bc47]/40 text-[#8b6914] hover:bg-orange-50'
            }`}
          >
            {n}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-full border border-[#e9bc47]/40 text-[#8b6914] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
