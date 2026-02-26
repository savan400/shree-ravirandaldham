import { apiClient, triggerRevalidate, API_URL } from "./api-client";

export interface LocalizedString {
  en: string;
  hi: string;
  gu: string;
}

export interface EventEntry {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  location: LocalizedString;
  time: LocalizedString;
  date: string;
  images: string[];
  coverImage?: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchEvents(
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<EventEntry>> {
  try {
    const res = await apiClient.get('/events', {
      params: { page, limit }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

export async function saveEvent(
  data: FormData,
  id?: string,
): Promise<EventEntry> {
  const url = id ? `/events/admin/${id}` : `/events/admin`;
  const res = await (id ? apiClient.put(url, data) : apiClient.post(url, data));
  
  if (res.data?._id) {
    triggerRevalidate(`/events/${res.data._id}`);
    triggerRevalidate(`/en/events/${res.data._id}`);
    triggerRevalidate(`/gu/events/${res.data._id}`);
    triggerRevalidate(`/hi/events/${res.data._id}`);
  }

  triggerRevalidate('/', 'layout');
  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await apiClient.delete(`/events/admin/${id}`);
  triggerRevalidate('/', 'layout');
}

export function getImageUrl(path: string) {
  if (!path) return "";
  if (path?.startsWith?.("http")) return path;
  if (path?.startsWith?.("/uploads")) {
    return `${API_URL.replace("/api", "")}${path}`;
  }
  return `${API_URL}/events/image/${path}`;
}
