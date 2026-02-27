'use client';

import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function NotFoundContent() {
  const pathname = usePathname();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-cream relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 border-4 border-gold rounded-full animate-float" />
        <div className="absolute bottom-[5%] right-[-5%] w-96 h-96 border-8 border-saffron rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-maroon via-saffron to-gold drop-shadow-sm select-none">
            404
          </h1>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl md:text-3xl font-hindi font-bold text-maroon mb-4">
            {pathname} Is Not Found
          </h2>
          <p className="text-lg text-muted-foreground font-sans mb-10 max-w-lg mx-auto">
            Don't worry, explore our other pages. Even if you're lost, there's always a path back to the temple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/"
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md border-b-4 border-saffron hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron mb-4 group-hover:bg-saffron group-hover:text-white transition-colors">
              <Home size={24} />
            </div>
            <span className="font-hindi font-semibold text-maroon">Home</span>
            <ArrowRight size={16} className="mt-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/events/upcoming-events"
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md border-b-4 border-gold hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
            <span className="font-hindi font-semibold text-maroon">Events</span>
            <ArrowRight size={16} className="mt-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/events/photo-gallery"
            className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-md border-b-4 border-maroon hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mb-4 group-hover:bg-maroon group-hover:text-white transition-colors">
              <ImageIcon size={24} />
            </div>
            <span className="font-hindi font-semibold text-maroon">Gallery</span>
            <ArrowRight size={16} className="mt-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="section-divider mb-8" />
          <p className="text-sm font-hindi text-muted-foreground uppercase tracking-widest">
            Shree Ravirandaldham
          </p>
        </div>
      </div>
    </div>
  );
}
