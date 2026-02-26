'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchTranslationsFlat,
  saveTranslation,
  deleteTranslation,
  TranslationEntry,
} from '@/services/translation-service';
import { Modal, AdminButton, Card } from './components/AdminUI';
import { Search, Plus, Edit2, Trash2, Filter, Languages, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const EMPTY_FORM: Omit<TranslationEntry, '_id'> = {
  section: '',
  key: '',
  en: '',
  hi: '',
  gu: '',
};

export default function TranslationCMS() {
  const [rows, setRows] = useState<TranslationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<TranslationEntry, '_id'> & { _id?: string }>(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TranslationEntry | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchTranslationsFlat();
    setRows(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setStatus('');
    setIsModalOpen(true);
  };

  const openEditModal = (row: TranslationEntry) => {
    setSelectedRow(row);
    setForm({ section: row.section, key: row.key, en: row.en, hi: row.hi, gu: row.gu });
    setStatus('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (row: TranslationEntry) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;
    try {
      await deleteTranslation(selectedRow._id);
      setIsDeleteModalOpen(false);
      await load();
    } catch {
      alert('Error deleting translation');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving…');
    try {
      await saveTranslation({
        section: form.section.trim(),
        key: form.key.trim(),
        en: form.en,
        hi: form.hi,
        gu: form.gu,
      });
      setStatus('✅ Success!');
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus('');
      }, 1000);
      await load();
    } catch {
      setStatus('❌ Error');
    }
  };

  const filteredRows = rows.filter(
    (r) => {
      const matchesSearch = 
        r.section.toLowerCase().includes(search.toLowerCase()) ||
        r.key.toLowerCase().includes(search.toLowerCase()) ||
        r.en.toLowerCase().includes(search.toLowerCase());
      const matchesSection = sectionFilter === 'All' || r.section === sectionFilter;
      return matchesSearch && matchesSection;
    }
  );

  const sections = ['All', ...Array.from(new Set(rows.map(r => r.section)))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Translation Library</h2>
          <p className="text-sm md:text-base text-gray-500">Manage all multilingual content across the platform.</p>
        </div>
        <AdminButton leftIcon={<Plus className="w-5 h-5" />} onClick={openAddModal} size="lg" className="w-full md:w-auto">
          Add New Key
        </AdminButton>
      </div>

      <Card>
        <div className="p-4 border-b border-orange-50 bg-orange-50/10 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by key, text or section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-orange-100 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-orange-400" />
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-bold text-orange-600 appearance-none min-w-[140px]"
            >
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="text-sm font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
            {filteredRows.length} Keys
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAF7F4] border-b border-orange-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-orange-900 uppercase tracking-wider">Namespace & Key</th>
                <th className="px-6 py-4 text-xs font-bold text-orange-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2">🇬🇧 English</div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-orange-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2">🇮🇳 Hindi</div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-orange-900 uppercase tracking-wider">
                  <div className="flex items-center gap-2">🇮🇳 Gujarati</div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-orange-900 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                      <span className="text-gray-400 font-medium">Loading Database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic font-medium">
                    No keys found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row._id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-orange-400 uppercase leading-none mb-1">{row.section}</span>
                        <span className="text-sm font-mono text-gray-700 font-bold">{row.key}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-[120px] sm:max-w-xs">{row.en || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-[120px] sm:max-w-xs">{row.hi || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-[120px] sm:max-w-xs">{row.gu || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(row)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(row)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRow && form.key ? 'Update Translation' : 'New Translation Key'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Namespace (Section)</label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                placeholder="e.g. Header"
                required
                disabled={!!selectedRow && !!form.key}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unique Key</label>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="e.g. welcome_msg"
                required
                disabled={!!selectedRow && !!form.key}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                🇬🇧 English Translation
              </label>
              <textarea
                value={form.en}
                onChange={(e) => setForm({ ...form, en: e.target.value })}
                className="w-full bg-blue-50/20 border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all h-24 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                🇮🇳 Hindi Translation
              </label>
              <textarea
                value={form.hi}
                onChange={(e) => setForm({ ...form, hi: e.target.value })}
                className="w-full bg-green-50/20 border border-green-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all h-24 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                🇮🇳 Gujarati Translation
              </label>
              <textarea
                value={form.gu}
                onChange={(e) => setForm({ ...form, gu: e.target.value })}
                className="w-full bg-orange-50/20 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all h-24 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 max-w-[200px]">
              * Namespaces and Keys cannot be modified once created to preserve data integrity.
            </p>
            <div className="flex gap-3 items-center">
              {status && <span className="text-sm font-bold text-orange-600">{status}</span>}
              <AdminButton type="submit">
                {selectedRow && form.key ? 'Update Content' : 'Save Translation'}
              </AdminButton>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="w-10 h-10 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-700">Warning: Irreversible Action</p>
              <p className="text-xs text-red-600">Deleting this key will remove it from all localized versions. Local JSON fallbacks will be used if they exist.</p>
            </div>
          </div>

          <p className="text-gray-700 font-medium">
            Are you sure you want to delete <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm font-bold">{selectedRow?.section}.{selectedRow?.key}</span>?
          </p>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <AdminButton variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              No, Keep it
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
              Yes, Delete Permanently
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
