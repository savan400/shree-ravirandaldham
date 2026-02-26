'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchSeoList, saveSeoData, deleteSeoData, uploadSeoImage } from '@/services/seo-service';
import { AdminButton, Card } from './components/AdminUI';
import SingleImageUpload from './components/SingleImageUpload';
import TagInput from './components/TagInput';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';

type SEORecord = {
  _id: string;
  route: string;
  title: { en: string; hi: string; gu: string };
  description: { en: string; hi: string; gu: string };
  keywords: { en: string; hi: string; gu: string };
  canonicalUrl: { en: string; hi: string; gu: string };
  ogImage: string;
  noIndex: boolean;
  noFollow: boolean;
  updatedAt: string;
};

export default function SeoCMS() {
  const [records, setRecords] = useState<SEORecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    route: '',
    title: { en: '', hi: '', gu: '' },
    description: { en: '', hi: '', gu: '' },
    keywords: { en: '', hi: '', gu: '' },
    canonicalUrl: { en: '', hi: '', gu: '' },
    ogImage: '',
    noIndex: false,
    noFollow: false
  });
  
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'gu'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const data = await fetchSeoList(search);
    setRecords(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleEdit = (record: any) => {
    // Helper to ensure we have an object with all 3 languages
    const normalize = (val: any) => {
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        return { en: val.en || '', hi: val.hi || '', gu: val.gu || '' };
      }
      // If it's a string (legacy) or missing, put it in English and leave others empty
      return { en: typeof val === 'string' ? val : '', hi: '', gu: '' };
    };

    setFormData({
      route: record.route || '',
      title: normalize(record.title),
      description: normalize(record.description),
      keywords: normalize(record.keywords),
      canonicalUrl: normalize(record.canonicalUrl),
      ogImage: record.ogImage || '',
      noIndex: !!record.noIndex,
      noFollow: !!record.noFollow
    });
    setEditingId(record._id);
    setView('form');
    setError('');
  };

  const handleAddNew = () => {
    setFormData({
      route: '',
      title: { en: '', hi: '', gu: '' },
      description: { en: '', hi: '', gu: '' },
      keywords: { en: '', hi: '', gu: '' },
      canonicalUrl: { en: '', hi: '', gu: '' },
      ogImage: '',
      noIndex: false,
      noFollow: false
    });
    setEditingId(null);
    setView('form');
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this SEO configuration?')) {
      await deleteSeoData(id);
      loadRecords();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveSeoData(formData);
      setView('list');
      loadRecords();
    } catch (err: any) {
      setError(err.message || 'Failed to save SEO meta');
    } finally {
      setSaving(false);
    }
  };

  const updateLocalizedField = (field: 'title' | 'description' | 'keywords' | 'canonicalUrl', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field] as any), [activeLang]: value }
    }));
  };

  if (view === 'form') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Edit SEO Meta' : 'Add New SEO Meta'}
            </h2>
            <p className="text-sm text-gray-500">Configure search indexing and social sharing defaults.</p>
          </div>
          <AdminButton variant="ghost" onClick={() => setView('list')} leftIcon={<X className="w-4 h-4" />}>
            Cancel
          </AdminButton>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Route Path (Unique)</label>
                  <input
                    type="text"
                    value={formData.route}
                    onChange={e => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="/ravirandaldham/parichay"
                    className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-mono"
                    required
                  />
                  <p className="text-xs text-gray-400">The relative URL of the page (e.g. / , /events/list)</p>
                </div>

                <div className="border-t border-orange-50 pt-6">
                  {/* Language Tabs */}
                  <div className="flex bg-orange-50/50 p-1 rounded-xl w-fit mb-6">
                    {(['en', 'hi', 'gu'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                          activeLang === lang 
                            ? 'bg-white text-orange-600 shadow-sm' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {lang === 'en' ? '🇬🇧 English' : lang === 'hi' ? '🇮🇳 Hindi' : '🇮🇳 Gujarati'}
                      </button>
                    ))}
                  </div>

                  {/* Localized Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Meta Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title[activeLang]}
                        onChange={e => updateLocalizedField('title', e.target.value)}
                        placeholder="Page Title"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Meta Description</label>
                      <textarea
                        value={formData.description[activeLang]}
                        onChange={e => updateLocalizedField('description', e.target.value)}
                        rows={3}
                        placeholder="Snippet for search results..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Keywords (Enter or Comma to separate)</label>
                      <TagInput
                        tags={formData.keywords[activeLang] ? formData.keywords[activeLang].split(',').map(s => s.trim()).filter(s => s !== '') : []}
                        onChange={(tags) => updateLocalizedField('keywords', tags.join(', '))}
                        placeholder="Add keywords..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Canonical URL Override</label>
                      <input
                        type="text"
                        value={formData.canonicalUrl[activeLang]}
                        onChange={e => updateLocalizedField('canonicalUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <Card className="p-6">
              <SingleImageUpload
                value={formData.ogImage}
                onChange={(url) => setFormData(prev => ({ ...prev, ogImage: url }))}
                onUpload={(file) => uploadSeoImage(file).then(res => res.url)}
                label="OG Image"
                helperText="Recommended: 1200x630px. This image will appear when sharing links on Social Media."
              />
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                Search Indexing
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.noIndex}
                    onChange={e => setFormData(prev => ({ ...prev, noIndex: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-700">NoIndex</span>
                    <span className="block text-[10px] text-gray-400 italic">Prevent this page from appearing in search results.</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.noFollow}
                    onChange={e => setFormData(prev => ({ ...prev, noFollow: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <span className="block text-sm font-bold text-gray-700">NoFollow</span>
                    <span className="block text-[10px] text-gray-400 italic">Do not pass authority (link juice) to any links on this page.</span>
                  </div>
                </label>
              </div>
            </Card>

            <AdminButton 
              className="w-full py-4 text-base" 
              onClick={handleSave} 
              disabled={saving}
              leftIcon={saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </AdminButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">SEO Management</h2>
          <p className="text-sm md:text-base text-gray-500">
            Advanced multi-language indexing control.
            {records.length > 0 && <span className="ml-2 font-semibold text-orange-500">{records.length} records</span>}
          </p>
        </div>
        <AdminButton
          onClick={handleAddNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New SEO Meta
        </AdminButton>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by route or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-orange-50/30 border border-orange-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : records.length === 0 ? (
        <Card className="p-16 text-center text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
          <p>No SEO records found. Start by adding one!</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400 font-bold px-4">
                <th className="px-6 py-4">Page Route</th>
                <th className="px-6 py-4">Title (EN)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="group transition-all">
                  <td className="px-6 py-4 bg-white first:rounded-l-2xl border-y border-l border-orange-50 group-hover:border-orange-200">
                    <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                      {r.route}
                    </span>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-orange-50 group-hover:border-orange-200 font-medium text-gray-900">
                    {r.title.en}
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-orange-50 group-hover:border-orange-200">
                     <div className="flex items-center gap-2">
                        {r.noIndex ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase">
                            <X className="w-2.5 h-2.5" /> NoIndex
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle className="w-2.5 h-2.5" /> Indexed
                          </span>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 bg-white border-y border-orange-50 group-hover:border-orange-200 text-xs text-gray-400">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 bg-white last:rounded-r-2xl border-y border-r border-orange-50 group-hover:border-orange-200 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(r)}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(r._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
