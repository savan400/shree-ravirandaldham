import { fetchCMSPage } from '@/lib/api';
import CMSPage from '@/page-ui/CMSPage'
import ItihasPage from '@/page-ui/ItihasPage'
import React from 'react'

const Page = async () => {
    const cmsData = await fetchCMSPage("itihas");
    console.log(cmsData, "cmsData");
    return (
        <div><CMSPage cmsData={cmsData} /></div>
    )
}

export default Page