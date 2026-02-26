'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { fetchEvents, deleteEvent, EventEntry, getImageUrl } from '@/services/events-service';
import {
    VideoGalleryEntry,
    fetchVideoGalleriesAdmin,
    deleteVideoGallery,
} from '@/services/gallery-service';
import { AdminButton } from './components/AdminUI';
import VideoGalleryForm from './VideoGalleryForm';
import Pagination from '@/components/Pagination/Pagination';
import { Plus, Pencil, Trash2, Link2, Video, Eye, EyeOff } from 'lucide-react';

const PER_PAGE = 8;

export default function VideoGalleryCMS() {
    const [items, setItems] = useState<VideoGalleryEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<VideoGalleryEntry | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const load = useCallback(async (p: number) => {
        setLoading(true);
        const result = await fetchVideoGalleriesAdmin(p, PER_PAGE);
        setItems(result.data ?? []);
        setTotal(result.total ?? 0);
        setLoading(false);
    }, []);

    useEffect(() => { load(page); }, [page, load]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this video? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await deleteVideoGallery(id);
            load(page);
        } catch { /* handled silently */ }
        setDeleting(null);
    };

    const openAdd = () => { setEditItem(null); setShowForm(true); };
    const openEdit = (item: VideoGalleryEntry) => { setEditItem(item); setShowForm(true); };
    const afterSave = () => { setShowForm(false); load(page); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Video Gallery</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{total} video{total !== 1 ? 's' : ''} total</p>
                </div>
                <AdminButton onClick={openAdd} leftIcon={<Plus className="w-4 h-4" />}>
                    Add Video
                </AdminButton>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No videos yet. Add one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Thumbnail */}
                            <div className="relative bg-amber-50" style={{ paddingTop: '56.25%' }}>
                                {item.thumbnailUrl ? (
                                    <Image
                                        src={item.thumbnailUrl}
                                        alt={item.title.en}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                ) : item.videoType === 'link' && item.videoUrl ? (
                                    (() => {
                                        const ytMatch = item.videoUrl.match(/(?:youtu\.be\/|v=|shorts\/)([^?&]+)/);
                                        return ytMatch ? (
                                            <Image
                                                src={`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`}
                                                alt={item.title.en}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Link2 className="w-8 h-8 text-amber-300" />
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Video className="w-8 h-8 text-amber-300" />
                                    </div>
                                )}
                                {/* Type badge */}
                                <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                    {item.videoType === 'link' ? <Link2 size={10} /> : <Video size={10} />}
                                    {item.videoType === 'link' ? 'LINK' : 'FILE'}
                                </span>
                                {/* Enabled badge */}
                                <span className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${item.isEnabled ? 'bg-green-500/90 text-white' : 'bg-gray-400/90 text-white'}`}>
                                    {item.isEnabled ? <Eye size={10} /> : <EyeOff size={10} />}
                                    {item.isEnabled ? 'ON' : 'OFF'}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="p-3">
                                <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-3">
                                    {item.title.en}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-orange-200 text-orange-600 text-xs font-semibold hover:bg-orange-50 transition-colors"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        disabled={deleting === item._id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={12} /> {deleting === item._id ? '…' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                page={page}
                total={total}
                perPage={PER_PAGE}
                onChange={setPage}
            />

            {showForm && (
                <VideoGalleryForm
                    initial={editItem}
                    onSave={afterSave}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
