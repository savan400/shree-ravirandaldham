import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import axios from 'axios';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fallback to default if locale is not provided (e.g., in non-localized routes)
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages = {};
  try {
    // During build, we should fetch from the BACKEND directly because the frontend (localhost:3000) isn't running.
    // Use the backend URL from env or fallback to localhost:5050/api
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    
    console.log(`[i18n] Fetching remote translations from: ${backendUrl}/translations?locale=${locale}`);
    
    const res = await axios.get(
      `${backendUrl}/translations?locale=${locale}`
    );

    if (res.status === 200) {
      messages = res.data;
      console.log(`[i18n request] Loaded ${Object.keys(messages).length} remote sections for locale "${locale}"`);
    } else {
      console.warn(`[i18n] Backend returned status ${res.status} for locale "${locale}"`);
    }
  } catch (err) {
    // Non-blocking error: return empty messages to avoid crashing the build
    if (err instanceof Error && (err as any).code === 'ECONNREFUSED') {
      console.warn(`[i18n] Backend connection refused at ${process.env.NEXT_PUBLIC_API_URL}. Proceeding with empty messages.`);
    } else {
      console.error(`[i18n] Failed to fetch remote translations:`, err);
    }
  }

  return {
    locale,
    messages
  };
});
