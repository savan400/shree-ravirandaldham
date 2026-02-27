"use client"
import React from 'react'
import CommonBookingPage from '@/components/CommonBookingPage/CommonBookingPage'
import RandalSahayate from './randalSahayate'

const RandalBookingPage = () => (
    <CommonBookingPage
        pageTitle="રાંદલ તેડવાનું બૂકિંગ"

        imageSrc="/images/banner-2.webp"
        imageAlt="શ્રી રાંદલ માતા"
        imageCaption="✦  શ્રી રવિ રાંદલ ધામ  ✦"

        aboutTitle="રાંદલ તેડવા વિશે"
        aboutParagraphs={[
            <>
                રવિ રાંદલ ધામ દ્વારા ભક્તોના ઘરે,{' '}
                <strong >લગ્ન-પ્રસંગે</strong>, અન્ન-પ્રાશન,{' '}
                <strong >ગ્રહ-પ્રવેશ</strong> તથા અન્ય
                શુભ-અવસરો ઉપર{' '}
                <strong >&ldquo;રાંદલ&rdquo;</strong>{' '}
                તેડવાની દિવ્ય સેવા ઉપલબ્ધ છે.
            </>,
            <>
                ભક્તિ-ભાવ સાથે રાંદલ માતાની ઉપસ્થિતિ દ્વારા
                પ્રત્યેક પ્રસંગ{' '}
                <strong >દિવ્ય, પવિત્ર</strong>{' '}
                અને શ્રેષ્ઠ બને છે.
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
            { text: <>બૂકિંગ ઓછામાં ઓછા <strong>3 દિવસ</strong> અગાઉ કરાવવું ફરજિયાત છે.</> },
            { text: <>બૂકિંગ <strong>કન્ફર્મ</strong> થયા બાદ જ પ્રસંગ નક્કી ગણાશે.</> },
            { text: <>ભૂમિ અને <strong>સ્થળ-અંતર</strong> પ્રમાણે ભાડામાં ફેરફાર થઈ શકે છે.</> },
            { text: <>રદ કરવા <strong>૨૪ કલાક</strong> અગાઉ અચૂક જાણ કરવી આવશ્યક છે.</> },
        ]}

        footer={<RandalSahayate />}
    />
)

export default RandalBookingPage