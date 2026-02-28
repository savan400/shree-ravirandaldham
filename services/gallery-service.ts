import { apiClient, API_URL } from "./api-client";
import { revalidatePhotoGallery } from "@/app/actions/revalidate";
import { LocalizedString, PaginatedResponse } from "./events-service";

export interface GalleryImageItem {
  _id: string;
  url: string;
  description: LocalizedString;
}

export interface GalleryEntry {
  _id: string;
  title: LocalizedString;
  coverImage: string;
  images: GalleryImageItem[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoGalleryEntry {
  _id: string;
  title: LocalizedString;
  videoType: "link" | "file";
  videoUrl: string;
  videoKey: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Public: enabled galleries only, paginated */
export async function fetchGalleries(
  page = 1,
  limit = 9,
): Promise<PaginatedResponse<GalleryEntry>> {
  return unstable_cache(
    async () => {
      try {
        const res = await apiClient.get("/galleries", {
          params: { page, limit },
        });
        return res.data;
      } catch {
        return { data: [], total: 0, page, totalPages: 0 };
      }
    },
    [`galleries-${page}-${limit}`],
    { tags: ["photo-gallery"] },
  )();
}

/** Public + Admin: single gallery by id */
export async function fetchGallery(id: string): Promise<GalleryEntry | null> {
  try {
    const res = await apiClient.get(`/galleries/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

/** Admin: all galleries (including disabled), paginated */
export async function fetchGalleriesAdmin(
  page = 1,
  limit = 9,
): Promise<PaginatedResponse<GalleryEntry>> {
  try {
    const res = await apiClient.get("/galleries/admin", {
      params: { page, limit },
    });
    return res.data;
  } catch {
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

export async function saveGallery(
  data: FormData,
  id?: string,
): Promise<GalleryEntry> {
  const url = id ? `/admin/photos/${id}` : `/admin/photos`;
  const res = await (id ? apiClient.put(url, data) : apiClient.post(url, data));

  // Tag-based revalidation
  await revalidatePhotoGallery();

  return res.data;
}

export async function deleteGallery(id: string): Promise<void> {
  await apiClient.delete(`/galleries/admin/${id}`);
  await revalidatePhotoGallery();
}

// Video Galleries

import { unstable_cache } from "@/lib/cache";
import { revalidateVideoGallery } from "@/app/actions/revalidate";

/** Public: enabled video galleries, paginated */
export async function fetchVideoGalleries(
  page = 1,
  limit = 8,
): Promise<PaginatedResponse<VideoGalleryEntry>> {
  return unstable_cache(
    async () => {
      try {
        const res = await apiClient.get("/video-galleries", {
          params: { page, limit },
        });
        return res.data;
      } catch (err) {
        console.error("fetchVideoGalleries error:", err);
        return { data: [], total: 0, page, totalPages: 0 };
      }
    },
    [`video-galleries-${page}-${limit}`],
    { tags: ["video-gallery"] },
  )();
}

/** Admin: all video galleries, paginated */
export async function fetchVideoGalleriesAdmin(
  page = 1,
  limit = 8,
): Promise<PaginatedResponse<VideoGalleryEntry>> {
  try {
    const res = await apiClient.get("/video-galleries/admin", {
      params: { page, limit },
    });
    return res.data;
  } catch {
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

/** Get pre-signed upload URLs from backend */
export async function getPresignedUploadUrls(params: {
  videoType: "link" | "file";
  videoExt?: string;
  thumbExt?: string;
}) {
  const res = await apiClient.get("/video-galleries/presign-upload", {
    params,
  });
  return res.data;
}

/** Create or update a video gallery using JSON (for direct-to-wasabi flow) */
export async function saveVideoGalleryJson(
  data: any,
  id?: string,
): Promise<VideoGalleryEntry> {
  const url = id ? `/video-galleries/admin/${id}` : `/video-galleries/admin`;
  const res = await (id ? apiClient.put(url, data) : apiClient.post(url, data));

  // Tag-based revalidation
  await revalidateVideoGallery();

  return res.data;
}

/** Create or update a video gallery (Legacy multipart/form-data) */
export async function saveVideoGallery(
  data: FormData,
  id?: string,
  onProgress?: (percent: number) => void,
): Promise<VideoGalleryEntry> {
  const url = `${API_URL}${id ? `/video-galleries/admin/${id}` : `/video-galleries/admin`}`;
  const method = id ? "PUT" : "POST";

  // Still using XHR for progress tracking, but wrapped in service
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (err) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(xhr.statusText || "Failed to save video gallery"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(data);
  });
}

/** Delete a video gallery */
export async function deleteVideoGallery(id: string): Promise<void> {
  await apiClient.delete(`/video-galleries/admin/${id}`);
  await revalidateVideoGallery();
}

/** Returns the streaming URL for a raw video file */
export function getVideoStreamUrl(key: string): string {
  return `${API_URL}/video-galleries/stream/${key}`;
}
