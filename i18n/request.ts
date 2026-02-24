import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fallback to default if locale is not provided (e.g., in non-localized routes)
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages = {};

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/translations?locale=${locale}`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      messages = await res.json();
      console.log(`[i18n request] Loaded ${Object.keys(messages).length} sections for locale "${locale}"`);
    }
  } catch (err) {
    console.error(`[i18n] Failed to fetch translations for locale "${locale}":`, err);
  }

  return {
    locale,
    messages
  };
});
