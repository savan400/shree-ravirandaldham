'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchCMSPagesAdmin, deleteCMSPage, CMSPageEntry, getImageUrl } from '@/lib/api';
import { AdminButton, Card } from './components/AdminUI';
import { Plus, Edit2, Trash2, FileText, Layout } from 'lucide-react';
import CMSPageForm from './CMSPageForm';
import Pagination from '@/components/Pagination/Pagination';

const PER_PAGE = 10;

export default function PagesCMS() {
  const [pages, setPages] = useState<CMSPageEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPageEntry | undefined>();

  const loadPages = useCallback(async (p: number) => {
    setLoading(true);
    const result = await fetchCMSPagesAdmin(p, PER_PAGE);
    setPages(result.data);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => { loadPages(page); }, [page, loadPages]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this CMS page?')) {
      try {
        await deleteCMSPage(id);
        loadPages(page);
      } catch {
        alert('Failed to delete page');
      }
    }
  };

  if (isFormOpen) {
    return (
      <CMSPageForm
        page={editingPage}
        onClose={() => setIsFormOpen(false)}
        onSave={() => { setIsFormOpen(false); loadPages(page); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">CMS Pages Management</h2>
          <p className="text-sm md:text-base text-gray-500">
            Create and manage dynamic pages.
            {total > 0 && <span className="ml-2 font-semibold text-orange-500">{total} total</span>}
          </p>
        </div>
        <AdminButton
          onClick={() => { setEditingPage(undefined); setIsFormOpen(true); }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Page
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : total === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          No CMS pages found. Click "Add New Page" to create one.
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pages.map((p) => (
              <Card key={p._id} className="overflow-hidden flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-40 h-48 sm:h-auto relative bg-orange-50 flex-shrink-0">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={getImageUrl(p.images[0])}
                      alt={p.title.en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-200">
                      <Layout className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{p.title.en}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FileText className="w-4 h-4" /><span>Key: <span className="font-mono font-bold text-orange-600">{p.key}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingPage(p); setIsFormOpen(true); }}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-orange-50 text-xs text-gray-400">
                    Last updated: {new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            perPage={PER_PAGE}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
