"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { fetchSeoData, saveSeoData } from "@/lib/api";
import { useEffect } from "react";
import TranslationCMS from "./TranslationCMS";
import EventsCMS from "./EventsCMS";
import GalleryCMS from "./GalleryCMS";
import VideoGalleryCMS from "./VideoGalleryCMS";
import PagesCMS from "./PagesCMS";
import GlobalSettingsCMS from "./GlobalSettingsCMS";
import SeoCMS from "./SeoCMS";
import { AdminButton, Card } from "./components/AdminUI";
import {
  Settings,
  Globe,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Calendar,
  Images,
  Video,
  FileText,
} from "lucide-react";
import Link from "next/link";

type Tab =
  | "seo"
  | "translations"
  | "events"
  | "gallery"
  | "video-gallery"
  | "cms-pages"
  | "global-settings";

export default function AdminForm({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("seo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 w-72 bg-[#1A0800] text-orange-50/90 flex flex-col border-r border-orange-900/20 z-[50]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg">
              SR
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-white">
                Ravirandaldham
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-orange-400 font-bold">
                Admin Suite
              </p>
            </div>
          </div>
          <button
            className="md:hidden p-2 text-orange-200 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => {
              setActiveTab("seo");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "seo"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-left text-sm">SEO Management</span>
            {activeTab === "seo" && <ChevronRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab("global-settings");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "global-settings"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="flex-1 text-left text-sm">Site Settings</span>
            {activeTab === "global-settings" && <ChevronRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab("translations");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "translations"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Globe className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">Translations</span>
            {activeTab === "translations" && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("events");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "events"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">Events Management</span>
            {activeTab === "events" && <ChevronRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab("gallery");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "gallery"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Images className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">Photo Gallery</span>
            {activeTab === "gallery" && <ChevronRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setActiveTab("video-gallery");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "video-gallery"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <Video className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">Video Gallery</span>
            {activeTab === "video-gallery" && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("cms-pages");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "cms-pages"
                ? "bg-orange-500/10 text-orange-400 font-bold"
                : "hover:bg-white/5 text-orange-100/60"
            }`}
          >
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
            <span className="flex-1 text-left text-sm">CMS Pages</span>
            {activeTab === "cms-pages" && <ChevronRight className="w-4 h-4" />}
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <Link href="/">
            <AdminButton
              variant="ghost"
              className="w-full justify-start text-orange-100/40 hover:text-white"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Exit to Site
            </AdminButton>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 md:h-20 bg-white border-b border-orange-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[30]">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
              <span className="text-gray-900 font-semibold capitalize truncate">
                {activeTab}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="w-full">
            {activeTab === "seo" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SeoCMS />
              </div>
            )}

            {activeTab === "translations" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TranslationCMS />
              </div>
            )}

            {activeTab === "events" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EventsCMS />
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <GalleryCMS />
              </div>
            )}

            {activeTab === "video-gallery" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <VideoGalleryCMS />
              </div>
            )}

            {activeTab === "cms-pages" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PagesCMS />
              </div>
            )}

            {activeTab === "global-settings" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <GlobalSettingsCMS />
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eeddcc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ddcbaa;
        }
      `}</style>
    </div>
  );
}
