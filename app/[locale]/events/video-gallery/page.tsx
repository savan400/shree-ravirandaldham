import VideoGalleryPage from '@/page-ui/VideoGalleryPage'
import { fetchVideoGalleries } from '@/services/gallery-service';
import React from 'react'

const PER_PAGE = 12;

const page = async () => {
    // Initial fetch on server to enable tag-based revalidation
    const initialData = await fetchVideoGalleries(1, PER_PAGE);

    return (
        <div>
            <VideoGalleryPage initialData={initialData} />
        </div>
    )
}

export default page