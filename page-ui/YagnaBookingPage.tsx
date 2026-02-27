"use client"
import React from 'react'
import CommonBookingPage from '@/components/CommonBookingPage/CommonBookingPage'

/**
 * Yagna Booking Page
 * Just swap the props — same layout, different content.
 */
const YagnaBookingPage = () => (
    <CommonBookingPage
        pageTitle="યજ્ઞ બૂકિંગ"

        imageSrc="/images/yagya.jpg"
        imageAlt="શ્રી યજ્ઞ"
        imageCaption="✦  શ્રી રવિ રાંદલ ધામ  ✦"

        aboutTitle="યજ્ઞ વિશે"
        aboutParagraphs={[
            <>
                રવિ રાંદલ ધામ દ્વારા{' '}
                <strong >ઘરે, ખેતરે</strong> અથવા{' '}
                <strong >ધાર્મિક સ્થળ</strong> ઉપર
                વિવિધ પ્રકારના{' '}
                <strong >હવન-યજ્ઞ</strong>{' '}
                ની દિવ્ય સેવા ઉપલબ્ધ છે.
            </>,
            <>
                અનુભવી{' '}
                <strong >વૈદિક પંડિત</strong>{' '}
                દ્વારા વિધિ-વિધાન સહિત યજ્ઞ સંપન્ન કરાવવામાં આવે છે.
                પ્રત્યેક{' '}
                <strong >શ્રદ્ધા-ભાવ</strong>{' '}
                ને ઈશ્વર સુધી પહોંચાડવાનો અમારો સંકલ્પ છે.
            </>,
        ]}

        contactTitle="સંપર્ક"
        contacts={[
            { icon: '📞', label: 'ફોન કરો', value: '+91 98765 43210', href: 'tel:+919876543210' },
            { icon: '💬', label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210', target: '_blank' },
            { icon: '🕐', label: 'ઓફિસ સમય', value: 'સવારે ૯:૦૦ – સાંજ ૬:૦૦' },
        ]}

        noteTitle="🔔 નોંધ"
        noteTitleEn="Important Note"
        notes={[
            { text: <>બૂકિંગ ઓછામાં ઓછા <strong>5 દિવસ</strong> અગાઉ કરાવવું ફરજિયાત છે.</> },
            { text: <>યજ્ઞ-સ્થળ <strong>સ્વચ્છ</strong> અને <strong>ખુલ્લી જગ્યા</strong> માં હોવું જરૂરી છે.</> },
            { text: <>સામગ્રી-ખર્ચ <strong>ભક્ત</strong> ઉઠાવશે; વ્યવસ્થા ધામ કરશે.</> },
            { text: <>રદ કરવા <strong>૪૮ કલાક</strong> અગાઉ અચૂક જાણ કરવી આવશ્યક છે.</> },
        ]}
    /* no footer slot needed for yagna page */
    />
)

export default YagnaBookingPage