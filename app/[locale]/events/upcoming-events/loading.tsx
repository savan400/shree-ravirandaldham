import styles from "./UpcomingEventsPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonBadge from "@/components/CommonBadge/CommonBadge";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";

export default function Loading() {
  return (
    <section className={styles.section}>
      <PageBackgroundDecorations />
      <div className={styles.container}>
        <div className={styles.header}>
          <CommonBadge text="॥ લોડીંગ ॥" />
          <CommonTitle text="Fetching Events" />
          <LotusDivider />
        </div>

        <div className="flex flex-col items-center justify-center p-20 w-full">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#1a080010] rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#e9bc47] rounded-full animate-spin"></div>
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#e9bc47] rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-8 text-[#1a080090] font-medium tracking-widest animate-pulse">
            Loading Blissful Experiences...
          </p>
        </div>
      </div>
    </section>
  );
}
