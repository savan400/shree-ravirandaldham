import Announcements from '@/components/Announcements/Announcements'
import DailyDarshan from '@/components/DailyDarshan/DailyDarshan'
import DarshanTimingsSidebar from '@/components/DarshanTimingsSidebar'
import FacilitiesCards from '@/components/FacilitiesCards/FacilitiesCards'
import Footer from '@/components/Footer'
import HariVani from '@/components/HariVani/HariVani'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner/HeroBanner'
import KashtabhanjanDev from '@/components/KashtabhanjanDev/KashtabhanjanDev'
import KingOfSalangpur from '@/components/KingOfSalangpur/KingOfSalangpur'
import LiveDarshan from '@/components/LiveDarshan/LiveDarshan'
import StatsSection from '@/components/StatsSection/StatsSection'
import TypingText from '@/components/TypingText/TypingText'
import React from 'react'

const Homepage = () => {
    return (
        <>
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
            <DarshanTimingsSidebar />
        </>
    )
}

export default Homepage