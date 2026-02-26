import { apiClient, triggerRevalidate } from "./api-client";

export async function fetchSeoData(route: string, locale: string) {
  try {
    const res = await apiClient.get('/seo', {
      params: { route, locale }
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    return null;
  }
}

export async function fetchSeoList(search?: string) {
  try {
    const res = await apiClient.get('/admin/seo-list', {
      params: search ? { search } : {}
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching SEO list:", error);
    return [];
  }
}

export async function saveSeoData(data: any) {
  try {
    const res = await apiClient.post('/admin/seo', data);
    if (data.route) triggerRevalidate(data.route);
    return res.data;
  } catch (error) {
    console.error("Error saving SEO data:", error);
    throw error;
  }
}

export async function deleteSeoData(id: string) {
  try {
    const res = await apiClient.delete(`/admin/seo/${id}`);
    triggerRevalidate('/', 'layout');
    return res.data;
  } catch (error) {
    console.error("Error deleting SEO data:", error);
    throw error;
  }
}

export async function uploadSeoImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiClient.post('/admin/seo/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function fetchSeoRoutes(): Promise<string[]> {
  try {
    const res = await apiClient.get('/seo-routes');
    return res.data;
  } catch {
    return ['/'];
  }
}

export async function fetchGlobalSettings() {
  try {
    const res = await apiClient.get('/settings');
    return res.data;
  } catch {
    return null;
  }
}

export async function saveGlobalSettings(data: any) {
  const res = await apiClient.post('/admin/settings', data);
  triggerRevalidate('/', 'layout');
  return res.data;
}
