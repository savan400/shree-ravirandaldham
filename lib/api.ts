const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  } catch (error) {
    console.error('Error fetching SEO data:', error);
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
