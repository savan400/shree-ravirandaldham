import { generateAdvancedMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Homepage from "@/page-ui/Homepage";

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return generateAdvancedMetadata('/', locale);
}

export default async function Home({params}: Props) {
  const {locale} = await params;

  return (
    <div className="min-h-screen">
      <Homepage />
    </div>
  );
}
