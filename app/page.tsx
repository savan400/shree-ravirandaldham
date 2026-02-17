import Image from "next/image";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import TypingText from "./components/TypingText";
import Announcements from "./components/Announcements";
import KashtabhanjanDev from "./components/KashtabhanjanDev";
import KingOfSalangpur from "./components/KingOfSalangpur";
import LiveDarshan from "./components/LiveDarshan";
import DailyDarshan from "./components/DailyDarshan";
import FacilitiesCards from "./components/FacilitiesCards";
import StatsSection from "./components/StatsSection";
import HariVani from "./components/HariVani";
import Footer from "./components/Footer";
import DarshanTimingsSidebar from "./components/DarshanTimingsSidebar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroBanner />
      <TypingText />
      <Announcements />
      <KashtabhanjanDev />
      <KingOfSalangpur />
      <LiveDarshan />
      <DailyDarshan />
      <FacilitiesCards />
      <StatsSection />
      <HariVani />
      <Footer />
      <DarshanTimingsSidebar />
    </div>
  );
}
