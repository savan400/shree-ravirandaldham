import Announcements from "@/components/Announcements/Announcements";
import DailyDarshan from "@/components/DailyDarshan/DailyDarshan";
import DarshanTimingsSidebar from "@/components/DarshanTimingsSidebar";
import FacilitiesCards from "@/components/FacilitiesCards/FacilitiesCards";
import Footer from "@/components/Footer";
import HariVani from "@/components/HariVani/HariVani";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import KashtabhanjanDev from "@/components/KashtabhanjanDev/KashtabhanjanDev";
import KingOfSalangpur from "@/components/KingOfSalangpur/KingOfSalangpur";
import LiveDarshan from "@/components/LiveDarshan/LiveDarshan";
import StatsSection from "@/components/StatsSection/StatsSection";
import TypingText from "@/components/TypingText/TypingText";
import {fetchSeoData} from '@/lib/api';
import type { Metadata } from 'next';

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
      <Header />
      <HeroBanner />
      <TypingText />
      <Announcements />
      <KashtabhanjanDev />
      <KingOfSalangpur />
      <LiveDarshan />
      <DailyDarshan />
      <FacilitiesCards />
      <StatsSection />
      <HariVani />
      <Footer />
      <DarshanTimingsSidebar />
    </div>
  );
}
