'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchGalleriesAdmin, deleteGallery, GalleryEntry } from '@/lib/api';
import { AdminButton, Card } from './components/AdminUI';
import { Plus, Edit2, Trash2, Images, EyeOff } from 'lucide-react';
import GalleryForm from './GalleryForm';
import Pagination from '@/components/Pagination/Pagination';

const PER_PAGE = 9;

export default function GalleryCMS() {
  const [galleries, setGalleries] = useState<GalleryEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryEntry | undefined>();

  const load = useCallback(async (p: number) => {
    setLoading(true);
    const result = await fetchGalleriesAdmin(p, PER_PAGE);
    setGalleries(result.data);
    setTotal(result.total);
    setLoading(false);
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery and all its images?')) return;
    try { await deleteGallery(id); load(page); }
    catch { alert('Failed to delete gallery'); }
  };

  if (isFormOpen) {
    return (
      <GalleryForm
        gallery={editingGallery}
        onClose={() => setIsFormOpen(false)}
        onSave={() => { setIsFormOpen(false); load(page); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Photo Galleries</h2>
          <p className="text-sm text-gray-500">
            Manage photo gallery albums.
            {total > 0 && <span className="ml-2 font-semibold text-orange-500">{total} total</span>}
          </p>
        </div>
        <AdminButton
          onClick={() => { setEditingGallery(undefined); setIsFormOpen(true); }}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Gallery
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : total === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          No galleries yet. Click "New Gallery" to create one.
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <Card key={gallery._id} className="overflow-hidden group">
                <div className="relative h-44 bg-orange-50">
                  {gallery.coverImage ? (
                    <img src={gallery.coverImage} alt={gallery.title.en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-200">
                      <Images className="w-12 h-12" />
                    </div>
                  )}
                  {!gallery.isEnabled && (
                    <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {gallery.images.length} photos
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 truncate">{gallery.title.en}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{gallery.title.gu || gallery.title.hi}</p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => { setEditingGallery(gallery); setIsFormOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gallery._id)}
                      className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
