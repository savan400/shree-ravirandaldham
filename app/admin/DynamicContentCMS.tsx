"use client";

import { useState, useEffect } from "react";
import { AdminButton } from "./components/AdminUI";
import { Trash, Plus, GripVertical, Image as ImageIcon, Loader2, Save } from "lucide-react";
import SingleImageUpload from "./components/SingleImageUpload";
import { uploadDynamicImage } from "@/services/seo-service";
import { API_URL } from "@/services/api-client";
import { revalidateDynamicContent } from "@/app/actions/revalidate";

interface LocalizedString {
    en: string;
    hi: string;
    gu: string;
}

interface BannerSlide {
    image: string;
    title: LocalizedString;
    subtitle: LocalizedString;
    rawFile?: File; // For deferred upload
}

export default function DynamicContentCMS() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [homepageBanners, setHomepageBanners] = useState<BannerSlide[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_URL}/dynamic-content/homepage_banners`);
            if (res.ok) {
                const data = await res.json();
                if (data.value && data.value.length > 0) {
                    const banners = data.value;
                    const urls = banners.map((b: any) => b.image);
                    try {
                        const presignRes = await fetch(`${API_URL}/presign`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ urls })
                        });
                        if (presignRes.ok) {
                            const presigned = await presignRes.json();
                            if (presigned.urls) {
                                banners.forEach((b: any, index: number) => {
                                    if (presigned.urls[index]) {
                                        b.image = presigned.urls[index];
                                    }
                                });
                            }
                        }
                    } catch (e) {
                        console.error("Presign fetch failed", e);
                    }
                    setHomepageBanners(banners);
                    return;
                }
            }

            // If not found or empty, set default
            setHomepageBanners([
                {
                    image: "/images/banner-1.webp",
                    title: { en: "Shree Ravirandaldham", hi: "श्री रविरांदलधाम", gu: "શ્રી રવિરાંદલધામ" },
                    subtitle: { en: "Randaldhma Mandir, Dadva", hi: "रांदलधाम मंदिर, दाडवा", gu: "રાંદલધામ મંદિર, દડવા" }
                },
                {
                    image: "/images/banner-2.webp",
                    title: { en: "Pavitra Dham", hi: "पवित्र धाम", gu: "પવિત્ર ધામ" },
                    subtitle: { en: "A Sacred Abode of Peace & Devotion", hi: "शांति और भक्ति का पवित्र निवास", gu: "શાંતિ અને ભક્તિનું પવિત્ર નિવાસસ્થાન" }
                }
            ]);
        } catch (error) {
            console.error("Error fetching banners:", error);
            setStatus("❌ Failed to load homepage banners");
        } finally {
            setLoading(false);
        }
    };

    const saveBanners = async () => {
        setSaving(true);
        setStatus("");
        try {
            // First, process any deferred image uploads sequentially
            const processingBanners = [...homepageBanners];
            for (let i = 0; i < processingBanners.length; i++) {
                if (processingBanners[i].rawFile) {
                    const uploadedUrl = await uploadDynamicImage(processingBanners[i].rawFile as File).then((res: any) => res.url);
                    processingBanners[i].image = uploadedUrl;
                    delete processingBanners[i].rawFile; // Clear the staging file
                } else if (processingBanners[i].image && processingBanners[i].image.includes('wasabisys.com')) {
                    // Strip the temporary AWS authentication query string out before pushing to Database
                    processingBanners[i].image = processingBanners[i].image.split('?')[0];
                }
            }

            setHomepageBanners(processingBanners); // Sync state with real URLs

            const res = await fetch(`${API_URL}/dynamic-content/homepage_banners`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    value: processingBanners,
                    description: "Array of image URLs for the homepage hero banner",
                }),
            });

            if (res.ok) {
                await revalidateDynamicContent();
                setStatus("✅ Homepage banners saved successfully!");
            } else {
                setStatus("❌ Failed to save homepage banners");
            }
        } catch (error) {
            console.error("Error saving banners:", error);
            setStatus("❌ An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const addBanner = () => {
        setHomepageBanners([...homepageBanners, {
            image: newImageUrl.trim() || "",
            title: { en: "", hi: "", gu: "" },
            subtitle: { en: "", hi: "", gu: "" },
            rawFile: undefined
        }]);
        setNewImageUrl("");
        setStatus("");
    };

    const handleBannerFileChange = (index: number, file: File) => {
        const previewUrl = URL.createObjectURL(file);
        const newBanners = [...homepageBanners];
        newBanners[index].image = previewUrl;
        newBanners[index].rawFile = file;
        setHomepageBanners(newBanners);
        return previewUrl; // Return for SingleImageUpload preview 
    };

    const handleBannerChange = (index: number, field: string, subfield: 'en' | 'hi' | 'gu', value: string) => {
        const newBanners = [...homepageBanners];
        (newBanners[index] as any)[field][subfield] = value;
        setHomepageBanners(newBanners);
    };

    const handleImageChange = (index: number, url: string) => {
        const newBanners = [...homepageBanners];
        newBanners[index].image = url;
        setHomepageBanners(newBanners);
    };

    const removeBanner = (index: number) => {
        const newBanners = [...homepageBanners];
        newBanners.splice(index, 1);
        setHomepageBanners(newBanners);
    };

    const moveBanner = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === homepageBanners.length - 1) return;

        const newBanners = [...homepageBanners];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        const temp = newBanners[index];
        newBanners[index] = newBanners[targetIndex];
        newBanners[targetIndex] = temp;

        setHomepageBanners(newBanners);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-orange-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                    <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 inline-flex self-start sm:self-auto">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            Homepage Banners
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage the sliding images displayed on the main hero banner.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {homepageBanners.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            No banner images found. Add some below.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {homepageBanners.map((slide, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col lg:flex-row gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50 rounded-2xl border border-gray-200 group transition-all hover:bg-white hover:border-orange-200 shadow-sm"
                                >
                                    <div className="flex justify-between lg:flex-col gap-2 items-center text-gray-400 w-full lg:w-auto">
                                        <button
                                            onClick={() => moveBanner(index, 'up')}
                                            disabled={index === 0}
                                            className="p-2 lg:p-1 bg-white lg:bg-transparent border lg:border-transparent rounded border-gray-200 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                                            title="Move up"
                                        >
                                            ▲
                                        </button>
                                        <GripVertical className="w-5 h-5 hidden lg:block" />
                                        <button
                                            onClick={() => moveBanner(index, 'down')}
                                            disabled={index === homepageBanners.length - 1}
                                            className="p-2 lg:p-1 bg-white lg:bg-transparent border lg:border-transparent rounded border-gray-200 hover:text-orange-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                                            title="Move down"
                                        >
                                            ▼
                                        </button>
                                    </div>

                                    <div className="w-full lg:w-48 flex-shrink-0">
                                        <SingleImageUpload
                                            value={slide.image}
                                            onChange={(url) => handleImageChange(index, url)}
                                            onUpload={async (file) => handleBannerFileChange(index, file)}
                                            label={`Slide ${index + 1}`}
                                            aspectRatio="video"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Title Block */}
                                        <div className="mb-4">
                                            <p className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</p>
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    value={slide.title.en}
                                                    onChange={(e) => handleBannerChange(index, 'title', 'en', e.target.value)}
                                                    placeholder="EN"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                                <input
                                                    value={slide.title.hi}
                                                    onChange={(e) => handleBannerChange(index, 'title', 'hi', e.target.value)}
                                                    placeholder="HI"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                                <input
                                                    value={slide.title.gu}
                                                    onChange={(e) => handleBannerChange(index, 'title', 'gu', e.target.value)}
                                                    placeholder="GU"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Subtitle Block */}
                                        <div>
                                            <p className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subtitle</p>
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    value={slide.subtitle.en}
                                                    onChange={(e) => handleBannerChange(index, 'subtitle', 'en', e.target.value)}
                                                    placeholder="EN"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                                <input
                                                    value={slide.subtitle.hi}
                                                    onChange={(e) => handleBannerChange(index, 'subtitle', 'hi', e.target.value)}
                                                    placeholder="HI"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                                <input
                                                    value={slide.subtitle.gu}
                                                    onChange={(e) => handleBannerChange(index, 'subtitle', 'gu', e.target.value)}
                                                    placeholder="GU"
                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs lg:text-sm focus:ring-1 focus:ring-orange-400 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end w-full lg:w-auto mt-2 lg:mt-0 border-t border-gray-200 lg:border-none pt-2 lg:pt-0">
                                        <button
                                            onClick={() => removeBanner(index)}
                                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 lg:border-transparent lg:bg-transparent lg:text-gray-400 lg:hover:text-red-500 lg:hover:bg-red-50 w-full lg:w-auto flex justify-center"
                                            title="Remove Banner"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pt-6 mt-6">
                        <button
                            onClick={addBanner}
                            className="px-6 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center w-full gap-2 font-bold text-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Slide Profile
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mt-4 border-t border-orange-100 pt-6">
                    {status && <span className={`text-sm font-bold text-center sm:text-right ${status.includes("✅") ? "text-green-600" : "text-orange-600"}`}>{status}</span>}
                    <div className="w-full sm:w-auto">
                        <AdminButton onClick={saveBanners} size="lg" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Banner Changes
                        </AdminButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
