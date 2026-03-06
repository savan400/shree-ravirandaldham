'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateVideoGallery() {
  console.log('[Action] Revalidating video-gallery tag');
  revalidateTag('video-gallery', 'max');
}

export async function revalidatePhotoGallery() {
  console.log('[Action] Revalidating photo-gallery tag');
  revalidateTag('photo-gallery', 'max');
}

export async function revalidateCmsPage() {
  console.log('[Action] Revalidating cms-page tag');
  revalidateTag('cms-page', 'max');
}

export async function revalidateEvent() {
  console.log('[Action] Revalidating event tag');
  revalidateTag('event', 'max');
}

export async function revalidateSeo() {
  console.log('[Action] Revalidating seo tag');
  revalidateTag('seo', 'max');
}

export async function revalidateSettings() {
  console.log('[Action] Revalidating settings tag');
  revalidateTag('settings', 'max');
}

export async function revalidateTranslation() {
  console.log('[Action] Revalidating translation tag');
  revalidateTag('translation', 'max');
}

export async function revalidateDynamicContent() {
  console.log('[Action] Revalidating dynamic-content tag');
  revalidateTag('dynamic-content', 'max');
}
