import ParichayPage, { Locale } from "@/page-ui/ParichayPage";
import { fetchCMSPage } from "@/lib/api";
import { generateAdvancedMetadata } from "@/lib/seo";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateAdvancedMetadata("/ravirandaldham/parichay", locale);
}

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  const cmsData = await fetchCMSPage("parichay");
  return (
    <div>
      <ParichayPage cmsData={cmsData} />
    </div>
  );
};

export default Page;
