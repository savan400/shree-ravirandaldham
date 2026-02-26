"use client";

import { useState, useEffect } from "react";
import { fetchGlobalSettings, saveGlobalSettings } from "@/lib/api";
import { AdminButton, Card } from "./components/AdminUI";
import { Save, Loader2, Globe, Building, Share2, Search, BarChart } from "lucide-react";
import SingleImageUpload from "./components/SingleImageUpload";
import { uploadSeoImage } from "@/lib/api";

export default function GlobalSettingsCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [settings, setSettings] = useState({
    siteName: { en: "", hi: "", gu: "" },
    baseUrl: "",
    defaultOgImage: "",
    twitterHandle: "",
    organizationName: { en: "", hi: "", gu: "" },
    organizationUrl: "",
    organizationLogo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    googleSearchConsoleId: "",
    googleAnalyticsId: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchGlobalSettings();
        if (data) {
          setSettings({
            siteName: data.siteName || { en: "", hi: "", gu: "" },
            baseUrl: data.baseUrl || "",
            defaultOgImage: data.defaultOgImage || "",
            twitterHandle: data.twitterHandle || "",
            organizationName: data.organizationName || { en: "", hi: "", gu: "" },
            organizationUrl: data.organizationUrl || "",
            organizationLogo: data.organizationLogo || "",
            contactEmail: data.contactEmail || "",
            contactPhone: data.contactPhone || "",
            address: data.address || "",
            googleSearchConsoleId: data.googleSearchConsoleId || "",
            googleAnalyticsId: data.googleAnalyticsId || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      await saveGlobalSettings(settings);
      setStatus("✅ Saved successfully!");
    } catch {
      setStatus("❌ Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleLocalizedChange = (field: 'siteName' | 'organizationName', locale: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Global Site Settings</h2>
        <p className="text-sm md:text-base text-gray-500">Configure site-wide SEO, Organization data, and Tracking IDs in 3 languages.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic SEO */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-50">
             <Globe className="w-5 h-5 text-orange-500" />
             <h3 className="text-lg font-bold text-gray-900">Basic SEO Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Site Name (Multi-language)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇬🇧 English</span>
                   <input value={settings.siteName.en} onChange={(e) => handleLocalizedChange('siteName', 'en', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Site Name EN" required />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇮🇳 Hindi</span>
                   <input value={settings.siteName.hi} onChange={(e) => handleLocalizedChange('siteName', 'hi', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="नाम (हिंदी)" />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇮🇳 Gujarati</span>
                   <input value={settings.siteName.gu} onChange={(e) => handleLocalizedChange('siteName', 'gu', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="નામ (ગુજરાતી)" />
                 </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Base URL</label>
              <input name="baseUrl" value={settings.baseUrl} onChange={handleChange} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="https://shreeravirandaldham.org" required />
            </div>
            <div className="space-y-4 md:col-span-2">
              <SingleImageUpload
                value={settings.defaultOgImage}
                onChange={(url) => setSettings(prev => ({ ...prev, defaultOgImage: url }))}
                onUpload={(file) => uploadSeoImage(file).then(res => res.url)}
                label="Default OG Image"
                helperText="This image is used as a fallback if a page doesn't have its own SEO image."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Twitter Handle</label>
              <input name="twitterHandle" value={settings.twitterHandle} onChange={handleChange} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" placeholder="@username" />
            </div>
          </div>
        </Card>

        {/* Organization Schema */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-50">
             <Building className="w-5 h-5 text-orange-500" />
             <h3 className="text-lg font-bold text-gray-900">Organization / LD+JSON Schema</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700">Organization Name (Multi-language)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇬🇧 English</span>
                   <input value={settings.organizationName.en} onChange={(e) => handleLocalizedChange('organizationName', 'en', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇮🇳 Hindi</span>
                   <input value={settings.organizationName.hi} onChange={(e) => handleLocalizedChange('organizationName', 'hi', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
                 </div>
                 <div className="space-y-1">
                   <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter ml-1">🇮🇳 Gujarati</span>
                   <input value={settings.organizationName.gu} onChange={(e) => handleLocalizedChange('organizationName', 'gu', e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Organization Website</label>
                <input name="organizationUrl" value={settings.organizationUrl} onChange={handleChange} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
              </div>
              <SingleImageUpload
                value={settings.organizationLogo}
                onChange={(url) => setSettings(prev => ({ ...prev, organizationLogo: url }))}
                onUpload={(file) => uploadSeoImage(file).then(res => res.url)}
                label="Organization Logo"
                aspectRatio="square"
                className="md:col-span-2"
              />
            </div>
          </div>
        </Card>

        {/* Verification & Tracking */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-50">
             <Search className="w-5 h-5 text-orange-500" />
             <h3 className="text-lg font-bold text-gray-900">Tracking & Verification</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                 <Search className="w-4 h-4" /> Google Search Console ID
               </label>
               <input name="googleSearchConsoleId" value={settings.googleSearchConsoleId} onChange={handleChange} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
            </div>
            <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                 <BarChart className="w-4 h-4" /> Google Analytics (G-XXXX)
               </label>
               <input name="googleAnalyticsId" value={settings.googleAnalyticsId} onChange={handleChange} className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-4 sticky bottom-4">
           <AdminButton type="submit" size="lg" disabled={saving}>
             {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
             Save Global Settings
           </AdminButton>
           {status && <span className={`text-sm font-bold ${status.includes("✅") ? "text-green-600" : "text-orange-600"}`}>{status}</span>}
        </div>
      </form>
    </div>
  );
}
