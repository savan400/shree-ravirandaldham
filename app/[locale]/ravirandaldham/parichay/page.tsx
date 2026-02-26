import ParichayPage, { Locale } from "@/page-ui/ParichayPage";
import { fetchCMSPage } from "@/lib/api";
import React from "react";
import CMSPage from "@/page-ui/CMSPage";

const Page = async ({ params: { locale } }: { params: { locale: Locale } }) => {
  const cmsData = await fetchCMSPage("parichay");
  return (
    <div>
      <CMSPage cmsData={cmsData} />
    </div>
  );
};

export default Page;
