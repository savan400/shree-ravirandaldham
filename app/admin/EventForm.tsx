"use client";

import { useState, useCallback } from "react";
import { EventEntry, saveEvent, getImageUrl } from "@/lib/api";
import { AdminButton, Card } from "./components/AdminUI";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import ImageUploadGrid, { GridImage } from "./components/ImageUploadGrid";

interface EventFormProps {
  event?: EventEntry;
  onClose: () => void;
  onSave: () => void;
}

type Locale = "en" | "hi" | "gu";

export default function EventForm({ event, onClose, onSave }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Locale>("en");
  const [errors, setErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: event?.title || { en: "", hi: "", gu: "" },
    description: event?.description || { en: "", hi: "", gu: "" },
    location: event?.location || { en: "", hi: "", gu: "" },
    time: event?.time || { en: "", hi: "", gu: "" },
    date: event?.date || "",
  });

  // Unified image list (existing pre-signed URLs + new file uploads)
  const [images, setImages] = useState<GridImage[]>(() => [
    ...(event?.images || []).map((url, i) => ({
      id: `existing-${i}-${url.slice(-12)}`,
      isNew: false,
      url: getImageUrl(url),
    })),
  ]);
  const [coverId, setCoverId] = useState<string>(
    event?.coverImage
      ? `existing-0-${getImageUrl(event.coverImage).slice(-12)}`
      : "",
  );

  const handleTranslationChange = (
    field: "title" | "description" | "location" | "time",
    lang: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as unknown as Record<string, string>),
        [lang]: value,
      },
    }));
    if (errors.length > 0) setErrors([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors.length > 0) setErrors([]);
  };

  const handleAdd = useCallback((files: File[]) => {
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `new-${Date.now()}-${Math.random()}`,
        isNew: true,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  }, []);

  const handleRemove = useCallback(
    (id: string) => {
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (coverId === id) setCoverId("");
    },
    [coverId],
  );

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.date) newErrors.push("Event Date is required");
    if (!formData.time.en) newErrors.push("Event Time is required");
    if (!formData.title.en.trim()) newErrors.push("English Title is required");
    if (!formData.title.gu.trim()) newErrors.push("Gujarati Title is required");
    if (!formData.title.hi.trim()) newErrors.push("Hindi Title is required");
    if (images.length === 0)
      newErrors.push("At least one event image is required");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const data = new FormData();
      // Existing images: send their original URLs so backend can reverse-map to keys
      const existingUrls = images
        .filter((img) => !img.isNew)
        .map((img) => img.url);
      // Cover: send the URL of the selected cover tile
      const coverImg = images.find((img) => img.id === coverId);
      data.append(
        "data",
        JSON.stringify({
          ...formData,
          images: existingUrls,
          coverImage: coverImg?.url || "",
        }),
      );
      images
        .filter((img) => img.isNew && img.file)
        .forEach((img) => {
          data.append("images", img.file!);
        });
      await saveEvent(data, event?._id);
      onSave();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Locale; label: string }[] = [
    { id: "en", label: "English" },
    { id: "gu", label: "Gujarati" },
    { id: "hi", label: "Hindi" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {event ? "Edit Event" : "Add New Event"}
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to publish an event.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Validation Errors</span>
          </div>
          <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-6">
            <Card className="p-0 overflow-hidden">
              {/* Common Info Section */}
              <div className="p-6 space-y-4 bg-orange-50/20 border-b border-orange-100">
                <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Common Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          time: { en: val, hi: val, gu: val },
                        }));
                        if (errors.length > 0) setErrors([]);
                      }}
                      className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Tabs for Localized Content */}
              <div className="bg-orange-50/50 border-b border-orange-100 p-1 flex items-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-bold transition-all rounded-lg ${
                      activeTab === tab.id
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-500 hover:text-orange-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Title ({activeTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={formData.title[activeTab]}
                      onChange={(e) =>
                        handleTranslationChange(
                          "title",
                          activeTab,
                          e.target.value,
                        )
                      }
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium"
                      placeholder={`Enter ${activeTab} title...`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Location ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.location[activeTab]}
                      onChange={(e) =>
                        handleTranslationChange(
                          "location",
                          activeTab,
                          e.target.value,
                        )
                      }
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                      placeholder="e.g. Temple Ground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Description ({activeTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={8}
                      value={formData.description[activeTab]}
                      onChange={(e) =>
                        handleTranslationChange(
                          "description",
                          activeTab,
                          e.target.value,
                        )
                      }
                      className="w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
                      placeholder={`Tell us more about the event in ${activeTab}...`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Image Uploads */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <ImageUploadGrid
                images={images}
                coverId={coverId}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onSetCover={setCoverId}
                title="Event Gallery"
              />
              {coverId && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Cover photo selected
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-orange-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <AdminButton type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Event"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
