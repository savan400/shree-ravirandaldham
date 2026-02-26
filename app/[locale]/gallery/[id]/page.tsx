import { fetchGallery } from '@/services/gallery-service';
import { notFound } from 'next/navigation';
import GalleryDetailPage from '@/page-ui/GalleryDetailPage';

interface Props {
  params: { id: string };
}

export default async function GalleryDetailServerPage({ params }: Props) {
  const gallery = await fetchGallery(params.id);
  if (!gallery) notFound();
  return <GalleryDetailPage gallery={gallery} />;
}
