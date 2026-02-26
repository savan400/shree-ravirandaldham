import { Metadata } from "next";
import { fetchSeoData, fetchGlobalSettings } from "@/services/seo-service";
import { SEO_CONFIG } from "./seoConfig";

export async function generateAdvancedMetadata(
  route: string,
  locale: string
): Promise<Metadata> {
  const [seoData, globalSettings] = await Promise.all([
    fetchSeoData(route, locale),
    fetchGlobalSettings()
  ]);

  const siteName = (globalSettings?.siteName?.[locale] || globalSettings?.siteName?.en || SEO_CONFIG.siteName) as string;
  const baseUrl = globalSettings?.baseUrl || SEO_CONFIG.baseUrl;
  const defaultOgImage = globalSettings?.defaultOgImage || SEO_CONFIG.defaultOgImage;
  const twitterHandle = globalSettings?.twitterHandle || SEO_CONFIG.twitterHandle;
  const globalKeywords = (globalSettings?.keywords?.[locale] || globalSettings?.keywords?.en || SEO_CONFIG.keywords) as string;

  const canonical = seoData?.canonicalUrl || `${baseUrl}/${locale}${route === "/" ? "" : route}`;

  // Generate hreflang alternates
  const languages: Record<string, string> = {};
  SEO_CONFIG.locales.forEach((loc) => {
    languages[loc] = `${baseUrl}/${loc}${route === "/" ? "" : route}`;
  });

  return {
    title: seoData?.title || siteName,
    description: seoData?.description || "Spiritual Place",
    keywords: seoData?.keywords || globalKeywords,
    alternates: {
      canonical: canonical,
      languages: languages,
    },
    robots: {
       index: !seoData?.noIndex,
       follow: !seoData?.noFollow,
    },
    openGraph: {
      title: seoData?.title || siteName,
      description: seoData?.description || "Spiritual Place",
      url: `${baseUrl}/${locale}${route === "/" ? "" : route}`,
      siteName: siteName,
      locale: locale,
      type: "website",
      images: [
        {
          url: seoData?.ogImage || defaultOgImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.title || siteName,
      description: seoData?.description || "Spiritual Place",
      creator: twitterHandle,
      images: [seoData?.ogImage || defaultOgImage],
    },
    verification: {
      google: globalSettings?.googleSearchConsoleId,
    }
  };
}

export async function generateStructuredData(type: 'Organization' | 'Website', locale: string, data?: any) {
  const settings = await fetchGlobalSettings();
  
  if (type === 'Organization') {
    const orgName = settings?.organizationName?.[locale] || settings?.organizationName?.en || settings?.siteName?.[locale] || settings?.siteName?.en || SEO_CONFIG.organization.name;
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": orgName,
      "url": settings?.organizationUrl || settings?.baseUrl || SEO_CONFIG.organization.url,
      "logo": settings?.organizationLogo || SEO_CONFIG.organization.logo,
      ...data
    };
  }
  
  if (type === 'Website') {
    const siteName = settings?.siteName?.[locale] || settings?.siteName?.en || SEO_CONFIG.siteName;
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": settings?.baseUrl || SEO_CONFIG.baseUrl,
      ...data
    };
  }
  
  return null;
}
