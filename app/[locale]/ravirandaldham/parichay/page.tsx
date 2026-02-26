import ParichayPage, { Locale } from "@/page-ui/ParichayPage";
import { fetchCMSPage } from "@/lib/api";
import React from "react";

const Page = async ({ params: { locale } }: { params: { locale: Locale } }) => {
  const cmsData = await fetchCMSPage("parichay");
  return (
    <div>
      <ParichayPage cmsData={cmsData} />
    </div>
  );
};

export default Page;
