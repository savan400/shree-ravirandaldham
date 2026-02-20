import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

/** Deep merge: values in `override` overwrite matching keys in `base` */
function deepMerge(base: Record<string, any>, override: Record<string, any>): Record<string, any> {
  const result = { ...base };
  for (const [section, keys] of Object.entries(override)) {
    if (typeof keys === 'object' && keys !== null && !Array.isArray(keys)) {
      result[section] = { ...(result[section] || {}), ...keys };
    } else {
      result[section] = keys;
    }
  }
  return result;
}

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load static JSON messages (fallback defaults)
  const staticMessages = (await import(`../messages/${locale}.json`)).default;

  // Fetch DB overrides — fail gracefully if backend is down
  let dbMessages: Record<string, any> = {};
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/translations`,
      { next: { revalidate: 30 } }
    );
    if (res.ok) {
      const nested = await res.json(); // { section: { key: { en, hi, gu } } }
      // Flatten to locale-specific: { section: { key: value } }
      for (const [section, keys] of Object.entries(nested as Record<string, any>)) {
        dbMessages[section] = {};
        for (const [key, vals] of Object.entries(keys as Record<string, any>)) {
          const val = (vals as any)[locale];
          if (val) dbMessages[section][key] = val;
        }
      }
    }
  } catch {
    // Backend offline — use static JSON only
  }

  return {
    locale,
    messages: deepMerge(staticMessages, dbMessages),
  };
});
