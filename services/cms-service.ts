import { unstable_cache } from "next/cache";
import { apiClient } from "./api-client";
import { revalidateCmsPage } from "@/app/actions/revalidate";
import { LocalizedString, PaginatedResponse } from "./events-service";

export interface CMSPageAnalytics {
  key?: string;
  value?: string;
  image?: string; 
  title?: LocalizedString;
  description?: LocalizedString;
}

export interface CMSPageImage {
  url: string;
  caption?: LocalizedString;
}

export interface CMSPageEntry {
  _id: string;
  key: string;
  type: 'textonly' | 'profile' | 'temple';
  title: LocalizedString;
  badgeText: LocalizedString;
  description: LocalizedString; 
  quote?: LocalizedString;
  images: CMSPageImage[]; 
  analytics: CMSPageAnalytics[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchCMSPage(key: string): Promise<CMSPageEntry | null> {
  return unstable_cache(
    async () => {
      try {
        const res = await apiClient.get(`/cms-pages/${key}`);
        return res.data;
      } catch {
        return null;
      }
    },
    [`cms-page-${key}`],
    { tags: ['cms-page'] }
  )();
}

export async function fetchCMSPagesAdmin(
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<CMSPageEntry>> {
  try {
    const res = await apiClient.get('/admin/cms-pages', {
      params: { page, limit }
    });
    return res.data;
  } catch {
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

export async function saveCMSPage(
  data: FormData,
  id?: string,
): Promise<CMSPageEntry> {
  const url = id ? `/admin/cms-pages/${id}` : `/admin/cms-pages`;
  const res = await (id ? apiClient.put(url, data) : apiClient.post(url, data));
  
  // Tag-based revalidation
  await revalidateCmsPage();

  return res.data;
}

export async function deleteCMSPage(id: string): Promise<void> {
  await apiClient.delete(`/admin/cms-pages/${id}`);
  await revalidateCmsPage();
}
