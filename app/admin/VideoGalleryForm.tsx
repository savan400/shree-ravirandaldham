'use client';
import { useState, useRef, useEffect } from 'react';
import { VideoGalleryEntry, saveVideoGallery, API_URL, getPresignedUploadUrls, saveVideoGalleryJson } from '@/lib/api';
import { AdminButton } from './components/AdminUI';
import { X, Link2, Video, Image as ImageIcon } from 'lucide-react';

type Lang = 'en' | 'hi' | 'gu';
const LANGS: { key: Lang; label: string }[] = [
    { key: 'en', label: 'English' },
    { key: 'hi', label: 'Hindi' },
    { key: 'gu', label: 'Gujarati' },
];

interface Props {
    initial?: VideoGalleryEntry | null;
    onSave: () => void;
    onCancel: () => void;
}

export default function VideoGalleryForm({ initial, onSave, onCancel }: Props) {
    const isEdit = !!initial;

    const [titleLang, setTitleLang] = useState<Lang>('en');
    const [title, setTitle] = useState<Record<Lang, string>>({
        en: initial?.title.en ?? '',
        hi: initial?.title.hi ?? '',
        gu: initial?.title.gu ?? '',
    });
    const [videoType, setVideoType] = useState<'link' | 'file'>(initial?.videoType ?? 'link');
    const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? '');
    const [isEnabled, setIsEnabled] = useState(initial?.isEnabled ?? true);

    const videoFileRef = useRef<HTMLInputElement>(null);
    const thumbFileRef = useRef<HTMLInputElement>(null);
    const [videoFileName, setVideoFileName] = useState('');
    const [thumbFileName, setThumbFileName] = useState('');

    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (initial?.videoType === 'file' && initial.videoKey) {
            setPreviewUrl(`${API_URL}/video-galleries/stream/${initial.videoKey}`);
        } else if (initial?.videoType === 'link' && initial.videoUrl) {
            setPreviewUrl(initial.videoUrl);
        }
    }, [initial]);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.name.toLowerCase().endsWith('.avi')) {
                setError('Warning: AVI files may not play directly in all browsers. MP4 is recommended.');
            } else {
                setError('');
            }
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setVideoUrl(url);
        setPreviewUrl(url);
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const renderPreview = () => {
        if (!previewUrl) return null;

        if (videoType === 'link') {
            const ytId = getYouTubeId(previewUrl);
            if (ytId) {
                return (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-inner border border-stone-200">
                        <iframe 
                            src={`https://www.youtube.com/embed/${ytId}`}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                );
            }
            return (
                <div className="p-4 bg-stone-50 rounded-lg border border-dashed border-stone-300 text-center text-xs text-stone-500">
                    Preview not available for this link type, but it will be saved.
                </div>
            );
        }

        return (
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-inner border border-stone-200">
                <video 
                    src={previewUrl} 
                    controls 
                    className="w-full h-full"
                />
            </div>
        );
    };

    const captureVideoFrame = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;
            video.src = URL.createObjectURL(file);
            
            video.onloadedmetadata = () => {
                video.currentTime = Math.min(1, video.duration / 2);
            };

            video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const thumbFile = new File([blob], 'thumb.jpg', { type: 'image/jpeg' });
                        resolve(thumbFile);
                    } else reject(new Error('Canvas toBlob failed'));
                    URL.revokeObjectURL(video.src);
                }, 'image/jpeg', 0.8);
            };

            video.onerror = () => reject(new Error('Video load failed'));
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Strict Validations
        if (!title.en.trim()) { setError('English title is required'); return; }
        if (!title.hi.trim()) { setError('Hindi title is required'); return; }
        if (!title.gu.trim()) { setError('Gujarati title is required'); return; }

        if (videoType === 'link') {
            if (!videoUrl.trim()) { setError('Video URL is required'); return; }
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*(\?.*)?(#.*)?$/i;
            if (!urlRegex.test(videoUrl)) { setError('Please enter a valid URL'); return; }
        }

        if (videoType === 'file' && !isEdit && !videoFileRef.current?.files?.[0]) {
            setError('Please select a video file'); return;
        }

        setSaving(true);
        setProgress(0);
        try {
            const videoFile = videoFileRef.current?.files?.[0];
            const thumbFile = thumbFileRef.current?.files?.[0];
            let autoThumb: File | null = null;

            // 1. Generate auto-thumbnail if needed
            if (videoType === 'file' && videoFile && !thumbFile && !isEdit) {
                try {
                    autoThumb = await captureVideoFrame(videoFile);
                } catch (e) {
                    console.error('Frame capture failed', e);
                }
            }

            let finalVideoKey = initial?.videoKey || '';
            let finalThumbKey = initial?.thumbnailKey || '';

            // 2. Direct Upload Flow to Wasabi (for true progress)
            if ((videoType === 'file' && videoFile) || thumbFile || autoThumb) {
                const videoExt = videoFile?.name.split('.').pop()?.toLowerCase();
                const thumbExt = (thumbFile || autoThumb) ? (thumbFile?.name.split('.').pop()?.toLowerCase() || 'jpg') : undefined;

                const presign = await getPresignedUploadUrls({
                    videoType: videoType,
                    videoExt,
                    thumbExt
                });

                const uploadToWasabi = (url: string, file: File, weight: number, offset: number) => {
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('PUT', url);
                        xhr.setRequestHeader('Content-Type', file.type);
                        xhr.upload.onprogress = (ev) => {
                            if (ev.lengthComputable) {
                                const individualPercent = (ev.loaded / ev.total) * 100;
                                setProgress(Math.round(offset + (individualPercent * weight / 100)));
                            }
                        };
                        xhr.onload = () => (xhr.status === 200 ? resolve(null) : reject(new Error('Upload failed')));
                        xhr.onerror = () => reject(new Error('Network error during upload'));
                        xhr.send(file);
                    });
                };

                const uploads = [];
                // Video weighted 90%, Thumb 10%
                if (videoFile && presign.video) {
                    uploads.push(uploadToWasabi(presign.video.url, videoFile, (thumbFile || autoThumb) ? 90 : 100, 0));
                    finalVideoKey = presign.video.key;
                }
                if ((thumbFile || autoThumb) && presign.thumbnail) {
                    const weight = videoFile ? 10 : 100;
                    const offset = videoFile ? 90 : 0;
                    uploads.push(uploadToWasabi(presign.thumbnail.url, (thumbFile || autoThumb)!, weight, offset));
                    finalThumbKey = presign.thumbnail.key;
                }

                await Promise.all(uploads);
            }

            // 3. Finalize metadata in DB
            const finalData = {
                title,
                videoType,
                videoUrl: videoType === 'link' ? videoUrl : '',
                videoKey: videoType === 'file' ? finalVideoKey : '',
                thumbnailKey: finalThumbKey,
                isEnabled
            };

            await saveVideoGalleryJson(finalData, initial?._id);
            onSave();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setSaving(false);
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-5 my-4"
            >
                <button type="button" onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-gray-900">
                    {isEdit ? 'Edit Video' : 'Add Video'}
                </h2>

                {/* ... (rest of the form fields title, type etc) ... */}

                {/* Title */}
                <div>
                    <div className="flex gap-2 mb-2">
                        {LANGS.map(l => (
                            <button
                                key={l.key}
                                type="button"
                                onClick={() => setTitleLang(l.key)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${titleLang === l.key ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                    <input
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder={`Title (${titleLang.toUpperCase()})`}
                        value={title[titleLang]}
                        onChange={e => setTitle(prev => ({ ...prev, [titleLang]: e.target.value }))}
                        disabled={saving}
                    />
                </div>

                {/* Video Type Toggle */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Video Source</p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                setVideoType('link');
                                setPreviewUrl(videoUrl);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${videoType === 'link' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'} disabled:opacity-50`}
                        >
                            <Link2 size={15} /> YouTube / URL
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                                setVideoType('file');
                                if (isEdit && initial?.videoKey) {
                                    setPreviewUrl(`${API_URL}/video-galleries/stream/${initial.videoKey}`);
                                } else {
                                    setPreviewUrl(null);
                                }
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${videoType === 'file' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'} disabled:opacity-50`}
                        >
                            <Video size={15} /> Upload File
                        </button>
                    </div>
                </div>

                {/* Link input or file input */}
                {videoType === 'link' ? (
                    <input
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={handleUrlChange}
                        disabled={saving}
                    />
                ) : (
                    <div>
                        <div className="mb-4">
                            {renderPreview()}
                        </div>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => videoFileRef.current?.click()}
                            className="w-full border-2 border-dashed border-orange-200 rounded-xl py-4 text-sm text-orange-500 font-semibold hover:border-orange-400 transition-colors flex flex-col items-center gap-1 disabled:opacity-50"
                        >
                            <Video size={20} />
                            {videoFileName || (isEdit ? 'Replace video file (optional)' : 'Select video file')}
                        </button>
                        <input
                            ref={videoFileRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                                setVideoFileName(e.target.files?.[0]?.name || '');
                                handleVideoChange(e);
                            }}
                        />
                    </div>
                )}

                {/* Thumbnail (optional) */}
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Thumbnail <span className="font-normal normal-case text-gray-400">(optional — YouTube auto-detected)</span></p>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => thumbFileRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-orange-200 hover:text-orange-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <ImageIcon size={16} />
                        {thumbFileName || (isEdit && initial?.thumbnailKey ? 'Replace thumbnail' : 'Upload thumbnail image')}
                    </button>
                    <input
                        ref={thumbFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setThumbFileName(e.target.files?.[0]?.name || '')}
                    />
                </div>

                {/* Enabled toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <div
                        className={`relative w-11 h-6 rounded-full transition-colors ${isEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}
                        onClick={() => !saving && setIsEnabled(v => !v)}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isEnabled ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Show on public site</span>
                </label>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {saving && videoType === 'file' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-orange-600 uppercase tracking-tighter">
                            <span>Uploading Video...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-1">
                    <AdminButton type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={saving}>Cancel</AdminButton>
                    <AdminButton type="submit" disabled={saving} className="flex-1">
                        {saving ? (videoType === 'file' ? 'Uploading...' : 'Saving...') : isEdit ? 'Save Changes' : 'Add Video'}
                    </AdminButton>
                </div>

            </form>
        </div>
    );
}
