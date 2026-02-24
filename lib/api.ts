const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';
const UPLOADS_URL = API_URL.replace('/api', '/uploads');

// ─────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────

export async function fetchSeoData(route: string, locale: string) {
  try {
    const res = await fetch(`${API_URL}/seo?route=${route}&locale=${locale}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch SEO data');
    }
    return res.json();
  } catch {
    // Backend offline — silently return null so static defaults are used
    return null;
  }
}

export async function saveSeoData(data: any) {
  try {
    const res = await fetch(`${API_URL}/admin/seo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save SEO data');
    return res.json();
  } catch (error) {
    console.error('Error saving SEO data:', error);
    throw error;
  }
}

// ─────────────────────────────────────────────
// Translations
// ─────────────────────────────────────────────

export interface TranslationEntry {
  _id: string;
  section: string;
  key: string;
  en: string;
  hi: string;
  gu: string;
}

/** Fetch all translations as a flat array (for admin table) */
export async function fetchTranslationsFlat(): Promise<TranslationEntry[]> {
  try {
    const res = await fetch(`${API_URL}/translations/flat`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching translations:', error);
    return [];
  }
}

/** Fetch all translations as nested object (for runtime i18n merging) */
export async function fetchTranslationsNested(): Promise<Record<string, Record<string, { en: string; hi: string; gu: string }>>> {
  try {
    const res = await fetch(`${API_URL}/translations`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return {};
    return res.json();
  } catch (error) {
    console.error('Error fetching translations nested:', error);
    return {};
  }
}

/** Upsert a translation key */
export async function saveTranslation(data: Omit<TranslationEntry, '_id'>): Promise<TranslationEntry> {
  const res = await fetch(`${API_URL}/admin/translations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save translation');
  return res.json();
}

/** Delete a translation by ID */
export async function deleteTranslation(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/admin/translations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete translation');
}

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

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
  limit = 10
): Promise<PaginatedResponse<EventEntry>> {
  try {
    const res = await fetch(
      `${API_URL}/events?page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { data: [], total: 0, page, totalPages: 0 };
    return res.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

export async function saveEvent(data: FormData, id?: string): Promise<EventEntry> {
  const url = id ? `${API_URL}/events/admin/${id}` : `${API_URL}/events/admin`;
  const method = id ? 'PUT' : 'POST';
  
  const res = await fetch(url, {
    method,
    body: data,
  });
  if (!res.ok) throw new Error('Failed to save event');
  return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/events/admin/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete event');
}

export function getImageUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) {
    // Legacy local uploads
    return `${API_URL.replace('/api', '')}${path}`;
  }
  // Wasabi storage via backend proxy/redirection
  return `${API_URL}/events/image/${path}`;
}

// ─────────────────────────────────────────────
// Galleries
// ─────────────────────────────────────────────

export interface GalleryImageItem {
  _id: string;
  url: string;         // pre-signed URL (resolved by backend)
  description: LocalizedString;
}

export interface GalleryEntry {
  _id: string;
  title: LocalizedString;
  coverImage: string;  // pre-signed URL (resolved by backend)
  images: GalleryImageItem[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Public: enabled galleries only, paginated */
export async function fetchGalleries(
  page = 1,
  limit = 9
): Promise<PaginatedResponse<GalleryEntry>> {
  try {
    const res = await fetch(
      `${API_URL}/galleries?page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { data: [], total: 0, page, totalPages: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

/** Public + Admin: single gallery by id */
export async function fetchGallery(id: string): Promise<GalleryEntry | null> {
  try {
    const res = await fetch(`${API_URL}/galleries/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Admin: all galleries (including disabled), paginated */
export async function fetchGalleriesAdmin(
  page = 1,
  limit = 9
): Promise<PaginatedResponse<GalleryEntry>> {
  try {
    const res = await fetch(
      `${API_URL}/galleries/admin?page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { data: [], total: 0, page, totalPages: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0, page, totalPages: 0 };
  }
}

export async function saveGallery(data: FormData, id?: string): Promise<GalleryEntry> {
  const url = id ? `${API_URL}/galleries/admin/${id}` : `${API_URL}/galleries/admin`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, body: data });
  if (!res.ok) throw new Error('Failed to save gallery');
  return res.json();
}

export async function deleteGallery(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/galleries/admin/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete gallery');
}

