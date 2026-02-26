import { MetadataRoute } from 'next';
import { fetchGlobalSettings } from '@/services/seo-service';
import { SEO_CONFIG } from '@/lib/seoConfig';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await fetchGlobalSettings();
  const baseUrl = settings?.baseUrl || SEO_CONFIG.baseUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
