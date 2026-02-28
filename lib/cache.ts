import { unstable_cache as next_unstable_cache } from "next/cache";

/**
 * A safe wrapper for unstable_cache that falls back to the original function
 * when called from a client-side context (where incrementalCache is missing).
 */
export const unstable_cache = <T extends (...args: any[]) => Promise<any>>(
  cb: T,
  keyParts?: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  },
): T => {
  // Gracefully fallback to the original function if not on server
  if (typeof window !== "undefined") {
    return cb;
  }
  return next_unstable_cache(cb, keyParts, options);
};
