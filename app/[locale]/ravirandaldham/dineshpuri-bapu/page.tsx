import CMSContent from "@/components/CMSContent";
import { fetchCMSPage } from "@/lib/api";
import CMSPage from "@/page-ui/CMSPage";

const Page = async () => {
  const cmsData = await fetchCMSPage("dineshpuri-bapu");
  console.log(cmsData, "cmsData");
  return (
    <div>
      <CMSPage cmsData={cmsData} />
    </div>
  );
};

export default Page;
