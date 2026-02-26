import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
export const UPLOADS_URL = API_URL.replace("/api", "/uploads");

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Helper to trigger on-demand revalidation on the frontend */
export async function triggerRevalidate(route: string, type: 'page' | 'layout' = 'page') {
  try {
    const res = await axios.post(`${APP_URL}/api/revalidate`, { route, type });
    console.log(`[Revalidation] ${route} (${type}):`, res.data);
    return res.data;
  } catch (error) {
    console.error(`[Revalidation Error] ${route}:`, error);
  }
}
