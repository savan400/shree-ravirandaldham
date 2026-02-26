import CMSContent from "@/components/CMSContent";
import { fetchCMSPage } from "@/services/cms-service";
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
