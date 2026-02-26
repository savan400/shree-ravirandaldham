import { apiClient, triggerRevalidate } from "./api-client";
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
  try {
    const res = await apiClient.get(`/cms-pages/${key}`);
    return res.data;
  } catch {
    return null;
  }
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
  
  // Trigger specific revalidation for this page if possible
  if (res.data?.key) {
    console.log(`[Revalidate] Triggering for CMS key: ${res.data.key}`);
    triggerRevalidate(`/ravirandaldham/${res.data.key}`);
    // Also try localized paths directly as a backup
    triggerRevalidate(`/en/ravirandaldham/${res.data.key}`);
    triggerRevalidate(`/gu/ravirandaldham/${res.data.key}`);
    triggerRevalidate(`/hi/ravirandaldham/${res.data.key}`);
  }

  triggerRevalidate('/', 'layout');
  return res.data;
}

export async function deleteCMSPage(id: string): Promise<void> {
  await apiClient.delete(`/admin/cms-pages/${id}`);
  triggerRevalidate('/', 'layout');
}
