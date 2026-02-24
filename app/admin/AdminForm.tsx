'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { saveSeoData } from '@/lib/api';
import TranslationCMS from './TranslationCMS';
import { AdminButton, Card } from './components/AdminUI';
import { Settings, Globe, LogOut, LayoutDashboard, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

type Tab = 'seo' | 'translations';

export default function AdminForm({ locale }: { locale: string }) {
  const t = useTranslations('Admin');
  const [activeTab, setActiveTab] = useState<Tab>('seo');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    route: '/',
    locale: locale,
    title: '',
    description: '',
    keywords: '',
    ogImage: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      await saveSeoData(formData);
      setStatus('✅ Saved successfully!');
    } catch {
      setStatus('❌ Error saving data.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 bg-[#1A0800] text-orange-50/90 flex flex-col border-r border-orange-900/20 z-[50]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg">
              SR
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">Ravirandaldham</h1>
              <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">Admin Suite</p>
            </div>
          </div>
          <button 
            className="md:hidden p-2 text-orange-200 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => { setActiveTab('seo'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'seo' 
              ? 'bg-orange-500/10 text-orange-400 font-bold' 
              : 'hover:bg-white/5 text-orange-100/60'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-left text-sm">SEO Management</span>
            {activeTab === 'seo' && <ChevronRight className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => { setActiveTab('translations'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'translations' 
              ? 'bg-orange-500/10 text-orange-400 font-bold' 
              : 'hover:bg-white/5 text-orange-100/60'
            }`}
          >
            <Globe className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">Translations</span>
            {activeTab === 'translations' && <ChevronRight className="w-4 h-4" />}
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <Link href="/">
            <AdminButton variant="ghost" className="w-full justify-start text-orange-100/40 hover:text-white" leftIcon={<LogOut className="w-4 h-4" />}>
              Exit to Site
            </AdminButton>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 md:h-20 bg-white border-b border-orange-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[30]">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
              <span className="text-gray-900 font-semibold capitalize truncate">{activeTab}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="w-full">
            {activeTab === 'seo' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">SEO Configuration</h2>
                  <p className="text-sm md:text-base text-gray-500">Customize meta-tags and OpenGraph settings for each page.</p>
                </div>
                
                <Card className="p-4 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Route Path</label>
                        <input
                          type="text"
                          name="route"
                          value={formData.route}
                          onChange={handleChange}
                          placeholder="/page-url"
                          className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Display Locale</label>
                        <select
                          name="locale"
                          value={formData.locale}
                          onChange={handleChange}
                          className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-bold text-orange-600 appearance-none pointer-events-auto"
                        >
                          <option value="en">🇬🇧 English</option>
                          <option value="hi">🇮🇳 Hindi</option>
                          <option value="gu">🇮🇳 Gujarati</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Meta Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Page Title"
                        className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Meta Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none"
                        rows={4}
                        placeholder="Search engine description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Keywords (Comma separated)</label>
                        <input
                          type="text"
                          name="keywords"
                          value={formData.keywords}
                          onChange={handleChange}
                          className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">OG Image URL</label>
                        <input
                          type="text"
                          name="ogImage"
                          value={formData.ogImage}
                          onChange={handleChange}
                          className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-orange-50">
                      <div className="flex items-center gap-3">
                        <AdminButton type="submit" size="lg">
                          Save Changes
                        </AdminButton>
                        {status && (
                          <span className={`text-sm font-bold ${status.includes('✅') ? 'text-green-600' : 'text-orange-600'}`}>
                            {status}
                          </span>
                        )}
                      </div>
                    </div>
                  </form>
                </Card>
              </div>
            )}

            {activeTab === 'translations' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TranslationCMS />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EEDDCC;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #DDCBAA;
        }
      `}</style>
    </div>
  );
}
