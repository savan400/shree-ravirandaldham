import { apiClient, triggerRevalidate } from "./api-client";

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
    const res = await apiClient.get('/translations/flat');
    return res.data;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return [];
  }
}

/** Fetch all translations as nested object (for runtime i18n merging) */
export async function fetchTranslationsNested(): Promise<
  Record<string, Record<string, { en: string; hi: string; gu: string }>>
> {
  try {
    const res = await apiClient.get('/translations');
    return res.data;
  } catch (error) {
    console.error("Error fetching translations nested:", error);
    return {};
  }
}

/** Upsert a translation key */
export async function saveTranslation(
  data: Omit<TranslationEntry, "_id">,
): Promise<TranslationEntry> {
  const res = await apiClient.post('/admin/translations', data);
  triggerRevalidate('/', 'layout');
  return res.data;
}

/** Delete a translation by ID */
export async function deleteTranslation(id: string): Promise<void> {
  await apiClient.delete(`/admin/translations/${id}`);
  triggerRevalidate('/', 'layout');
}
