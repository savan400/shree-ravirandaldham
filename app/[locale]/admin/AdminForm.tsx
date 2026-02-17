'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { saveSeoData } from '@/lib/api';

export default function AdminForm({ locale }: { locale: string }) {
    const t = useTranslations('Admin');
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
            setStatus('Saved successfully!');
        } catch (error) {
            setStatus('Error saving data.');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Route</label>
                    <input type="text" name="route" value={formData.route} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Locale</label>
                    <select name="locale" value={formData.locale} onChange={handleChange} className="w-full border p-2 rounded">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="gu">Gujarati</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Keywords</label>
                    <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium">OG Image URL</label>
                    <input type="text" name="ogImage" value={formData.ogImage} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {t('save')}
                </button>
            </form>
            {status && <p className="mt-4 text-sm font-bold">{status}</p>}
        </div>
    );
}
