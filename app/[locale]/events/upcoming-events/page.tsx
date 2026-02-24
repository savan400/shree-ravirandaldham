import UpcomingEventsPage from '@/page-ui/UpcomingEventsPage'
import { fetchEvents } from '@/lib/api'
import React from 'react'

const page = async () => {
    const events = await fetchEvents();
    
    return (
        <div>
            <UpcomingEventsPage initialEvents={events} />
        </div>
    )
}

export default page