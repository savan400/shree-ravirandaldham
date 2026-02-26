import { MetadataRoute } from 'next';
import { fetchSeoRoutes, fetchGlobalSettings } from '@/lib/api';
import { SEO_CONFIG } from '@/lib/seoConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, settings] = await Promise.all([
    fetchSeoRoutes(),
    fetchGlobalSettings()
  ]);

  const baseUrl = settings?.baseUrl || SEO_CONFIG.baseUrl;
  const locales = SEO_CONFIG.locales;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    // Basic entry for each route
    // But for a multi-language site, we should explicitly list each localized version
    locales.forEach((locale) => {
      const url = `${baseUrl}/${locale}${route === '/' ? '' : route}`;
      
      sitemapEntries.push({
        url: url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '/' ? 1 : 0.8,
        alternates: {
          languages: locales.reduce((acc, loc) => {
            acc[loc] = `${baseUrl}/${loc}${route === '/' ? '' : route}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  return sitemapEntries;
}
