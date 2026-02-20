'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchTranslationsFlat,
  saveTranslation,
  deleteTranslation,
  TranslationEntry,
} from '@/lib/api';

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
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchTranslationsFlat();
    setRows(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (row: TranslationEntry) => {
    setEditId(row._id);
    setForm({ section: row.section, key: row.key, en: row.en, hi: row.hi, gu: row.gu });
    setStatus('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (row: TranslationEntry) => {
    if (!confirm(`Delete key "${row.section}.${row.key}"?`)) return;
    try {
      await deleteTranslation(row._id);
      setStatus('✅ Deleted successfully');
      await load();
    } catch {
      setStatus('❌ Error deleting translation');
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
      setStatus('✅ Saved successfully!');
      setEditId(null);
      setForm(EMPTY_FORM);
      await load();
    } catch {
      setStatus('❌ Error saving translation');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setStatus('');
  };

  const filteredRows = rows.filter(
    (r) =>
      r.section.toLowerCase().includes(search.toLowerCase()) ||
      r.key.toLowerCase().includes(search.toLowerCase()) ||
      r.en.toLowerCase().includes(search.toLowerCase())
  );

  // Group by section for display
  const grouped: Record<string, TranslationEntry[]> = {};
  for (const row of filteredRows) {
    if (!grouped[row.section]) grouped[row.section] = [];
    grouped[row.section].push(row);
  }

  return (
    <div className="space-y-8">
      {/* ── Form ── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          {editId ? '✏️ Edit Translation' : '➕ Add Translation Key'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. HomePage"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                disabled={!!editId}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. title"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                disabled={!!editId}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Language fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇬🇧 English
              </label>
              <textarea
                rows={3}
                placeholder="English translation"
                value={form.en}
                onChange={(e) => setForm({ ...form, en: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇮🇳 हिंदी (Hindi)
              </label>
              <textarea
                rows={3}
                placeholder="हिंदी अनुवाद"
                value={form.hi}
                onChange={(e) => setForm({ ...form, hi: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🇮🇳 ગુજરાતી (Gujarati)
              </label>
              <textarea
                rows={3}
                placeholder="ગુજરાતી અનુવાદ"
                value={form.gu}
                onChange={(e) => setForm({ ...form, gu: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {editId ? 'Update' : 'Save'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            )}
            {status && (
              <span className="text-sm font-medium text-gray-600">{status}</span>
            )}
          </div>
        </form>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Translation Keys
            <span className="ml-2 text-sm font-normal text-gray-400">({rows.length} total)</span>
          </h2>
          <input
            type="search"
            placeholder="Search section, key or English text…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading translations…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No translations yet. Add your first key above.
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No results match your search.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(grouped).map(([section, entries]) => (
              <div key={section}>
                <div className="px-6 py-2 bg-orange-50 text-xs font-bold text-orange-700 uppercase tracking-wider">
                  {section}
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-32">Key</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">🇬🇧 English</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">🇮🇳 Hindi</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">🇮🇳 Gujarati</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500 w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {entries.map((row) => (
                      <tr
                        key={row._id}
                        className={`hover:bg-orange-50/40 transition-colors ${editId === row._id ? 'bg-orange-50' : ''}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.key}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{row.en || <span className="text-gray-300 italic">—</span>}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{row.hi || <span className="text-gray-300 italic">—</span>}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs truncate">{row.gu || <span className="text-gray-300 italic">—</span>}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(row)}
                              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row)}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note about JSON fallback */}
      <p className="text-xs text-gray-400 text-center">
        💡 DB translations override static JSON files. Delete a key to revert to the JSON default.
      </p>
    </div>
  );
}
