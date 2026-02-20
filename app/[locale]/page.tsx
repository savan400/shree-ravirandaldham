import {fetchSeoData} from '@/lib/api';
import type { Metadata } from 'next';
import Homepage from "@/page-ui/Homepage";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const seoData = await fetchSeoData('/', locale);
  
  return {
    title: seoData?.title || 'Shree Ravirandaldham',
    description: seoData?.description || 'Spiritual Place',
    keywords: seoData?.keywords || '',
    openGraph: seoData?.ogImage ? {
      images: [seoData.ogImage],
    } : undefined,
  };
}

export default async function Home({params}: Props) {
  const {locale} = await params;

  return (
    <div className="min-h-screen">
      <Homepage />
    </div>
  );
}
