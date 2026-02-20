"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import sevaPunjanStyles from "@/app/[locale]/upasna-vidhi/seva-punjan/SevaPunjanPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';
import RandalSahayate from './randalSahayate';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TabData {
    id: string;
    label: string;
    icon: string;
    title: string;
    images: { src: string; alt: string }[];
    bullets: string[];
    highlight?: string;
}

// ─── Tab Data (from screenshot) ───────────────────────────────────────────────

const tabs: TabData[] = [
    {
        id: 'vagha',
        label: 'વાઘા: શણગાર\n– શયન',
        icon: '🙏',
        title: 'વાઘા: શણગાર - શયન',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજને મંગળા, શણગાર અને શયન એમ દિવસમાં ત્રણ પ્રકારના શણગાર ભાવપૂર્વક ધરાવવામાં આવે છે.',
            'દાદાના ભક્તો 5 હજારથી લઈ આઠ કરોડ સુધીના સોના ચાંદી સાથે અનેક પ્રકારના વસ્ત્રના શણગાર શ્રી હનુમાનજી મહારાજને ધરાવી દાદાને પ્રસન્ન કરે છે.',
            'શ્રી સાળંગપુર ધામમાં શ્રી કષ્ટભંજન દેવને સ્વામિનારાયણ સંપ્રદાયમાં માન્ય કરેલ, શિક્ષાપત્રીમાં આપેલી આજ્ઞા મુજબ, પરમ વૈષ્ણવ શ્રી વલ્લભાચાર્યજીએ નિર્દેશ કરેલી સેવા રીતે મુજબ વ્રત, ઉત્સવ, તહેવાર, તિથિ અનુસાર અને વર્લ્ડ દિવસ, રાષ્ટ્રીય દિવસ વગેરે પ્રસંગોપાત વિવિધ પ્રકારના શણગાર ધરાવવામાં આવે છે.',
            'અને દાદાના ભક્તો પણ આ સેવામાં યજમાન બની વાઘાની સેવા કરવાનો લાભ શ્રદ્ધા પૂર્વક લઈ શકે છે.',
        ],
    },
    {
        id: 'alankar',
        label: 'અલંકાર',
        icon: '🪔',
        title: 'અલંકાર સેવા',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'અલંકાર સેવા શ્રી હનુમાનજી મહારાજને ઝવેરાત અને આભૂષણો ધારણ કરાવવાની સેવા છે.',
            'ભક્તો ભગવાનને સોના-ચાંદીના ઘરેણાં, હાર, કંગન, મુકુટ વગેરે અર્પણ કરી ધન્યતા અનુભવે છે.',
            'આ સેવા ભક્તિ, શ્રદ્ધા અને ભક્ત-ભગવાનના સ્નેહ સંબંધની અભિવ્યક્તિ છે.',
        ],
    },
    {
        id: 'thal',
        label: 'થાળ',
        icon: '🔥',
        title: 'થાળ સેવા',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'ભગવાન શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજને દરરોજ ભક્તિભાવ સહિત ભોજનનો થાળ ધરાવવામાં આવે છે.',
            'ભક્તો ભગવાનને ઘઉં, ચોખા, ફળ, મીઠાઈ વગેરે અર્પણ કરી ભક્તિ ભાવ પ્રગટ કરે છે.',
            'ભગવાનને અર્પણ કરવામાં આવેલ ભોજનનો પ્રસાદ ભક્તો ગ્રહણ કરે છે.',
        ],
        highlight: 'ભગવાનને ભોગ ધરાવ્યા પછી તે ભોગ "પ્રસાદ" બની જાય છે અને ભક્તો તે ભોગ ભક્તિભાવ સહ ગ્રહણ કરે છે.',
    },
    {
        id: 'aarti',
        label: 'આરતી',
        icon: '📿',
        title: 'આરતી',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'દરરોજ નિત્ય ક્રિયા અનુસાર પ્રભાતે, મધ્યાહ્ને અને સાંજે શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજની આરતી ઉતારવામાં આવે છે.',
            'આ આરતી ભક્તો ઉત્સાહ, ઉમંગ અને ભક્તિ ભાવ સહિત ભક્ત-ભગવાનના મિલનનો અનુભવ કરે છે.',
            'ભક્તો ઘી, કપૂર, ફૂલ, ફળ વગેરે ચઢાવી ભગવાનની આરતી ઉતારે છે.',
        ],
    },
    {
        id: 'annakut',
        label: 'અન્નકૂટ',
        icon: '🕉️',
        title: 'અન્નકૂટ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'દિવાળીના બીજા દિવસે (બેસતા વર્ષ) ભવ્ય અન્નકૂટ ઉત્સવ ઉજવવામાં આવે છે.',
            'સેંકડો પ્રકારના ભોજન, ફળ, ફૂળ, મીઠાઈ, ફળ, ડ્રાય ફ્રૂટ્સ વગેરેથી ભગવાનને અન્નકૂટ ધરાવવામાં આવે છે.',
            'ભક્તો આ ઉત્સવ ઉત્સાહ, ઉમંગ અને ભક્તિ ભાવ સહ ઉજવે છે.',
        ],
    },
    {
        id: 'dhwaj',
        label: 'ધ્વજ\nઅર્પણ',
        icon: '🪷',
        title: 'ધ્વજ અર્પણ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'ભક્તો ભગવાન શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજને ધ્વજ અર્પણ કરી ભક્તિ ભાવ પ્રગટ કરે છે.',
            'ધ્વજ ઉત્સવ, તહેવાર, ઉત્સવ, ખાસ તિથિ વગેરે પ્રસંગે ચઢાવવામાં આવે છે.',
            'ભક્ત ભગવાનના સ્નેહ-સંબંધ, ભક્તિ, કૃતજ્ઞતા, ઉત્સવ વગેરેના ઉપલક્ષ્યમાં ધ્વજ ચઢાવે છે.',
        ],
    },
];

// ─── Floating Particle ────────────────────────────────────────────────────────

const FloatingParticle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
    <div
        className={sevaPunjanStyles.floatingParticle}
        style={{ left, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    />
);

// ─── Main Component ───────────────────────────────────────────────────────────

const BhaktiPage = () => {

    const [activeTab, setActiveTab] = useState('vagha');
    const [currentSlide, setCurrentSlide] = useState(0);
    const currentTabData = tabs.find(t => t.id === activeTab) ?? tabs[0];


    // Reset slide when tab changes
    useEffect(() => { setCurrentSlide(0); }, [activeTab]);

    const nextSlide = () => setCurrentSlide(p => (p + 1) % currentTabData.images.length);
    const prevSlide = () => setCurrentSlide(p => (p - 1 + currentTabData.images.length) % currentTabData.images.length);

    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 0.8} duration={8 + i * 0.5} left={`${10 + i * 8}%`} />
            ))}

            <div className={sevaPunjanStyles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="ભક્તિ" />
                    <LotusDivider />

                    {/* Sacred subtitle */}
                    <div className={sevaPunjanStyles.sacredSubtitle}>
                        <Flame className={sevaPunjanStyles.flameIcon} />
                        <span>॥ ભક્તિમાર્ગ — સેવાનો મહિમા ॥</span>
                        <Flame className={sevaPunjanStyles.flameIcon} />
                    </div>

                    {/* Tabs */}
                    <div className={sevaPunjanStyles.tabsContainer}>
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                className={`${sevaPunjanStyles.tab} ${activeTab === tab.id ? sevaPunjanStyles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <span className={sevaPunjanStyles.tabIcon}>{tab.icon}</span>
                                <span className={sevaPunjanStyles.tabLabel}>
                                    {tab.label.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </span>
                                {activeTab === tab.id && <div className={sevaPunjanStyles.tabGlow} />}
                            </button>
                        ))}
                    </div>

                    {/* Content Card */}
                    <div className={sevaPunjanStyles.contentCard}>
                        <div className={sevaPunjanStyles.cardTopBorder} />

                        {/* Title row with mandala ornaments */}
                        <div className={sevaPunjanStyles.titleContainer}>
                            <svg className={sevaPunjanStyles.mandala} width="50" height="50" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="23" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.6" />
                                <circle cx="25" cy="25" r="18" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.4" />
                                <circle cx="25" cy="25" r="13" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                                {[...Array(12)].map((_, i) => {
                                    const a = (i * 30) * Math.PI / 180;
                                    return <line key={i} x1={25 + 13 * Math.cos(a)} y1={25 + 13 * Math.sin(a)} x2={25 + 23 * Math.cos(a)} y2={25 + 23 * Math.sin(a)} stroke="#FFD700" strokeWidth="0.3" opacity="0.5" />;
                                })}
                                <defs>
                                    <linearGradient id="mandala-grad">
                                        <stop stopColor="#FF6B00" />
                                        <stop offset="1" stopColor="#FFD700" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h2 className={sevaPunjanStyles.contentTitle}>{currentTabData.title}</h2>
                            <svg className={sevaPunjanStyles.mandala} width="50" height="50" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="23" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.6" />
                                <circle cx="25" cy="25" r="18" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.4" />
                                <circle cx="25" cy="25" r="13" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                                {[...Array(12)].map((_, i) => {
                                    const a = (i * 30) * Math.PI / 180;
                                    return <line key={i} x1={25 + 13 * Math.cos(a)} y1={25 + 13 * Math.sin(a)} x2={25 + 23 * Math.cos(a)} y2={25 + 23 * Math.sin(a)} stroke="#FFD700" strokeWidth="0.3" opacity="0.5" />;
                                })}
                            </svg>
                        </div>

                        {/* Carousel */}
                        <div className={sevaPunjanStyles.carousel}>
                            <button className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowPrev}`} onClick={prevSlide}>
                                <div className={sevaPunjanStyles.arrowGlow} />
                                <ChevronLeft />
                            </button>
                            <button className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowNext}`} onClick={nextSlide}>
                                <div className={sevaPunjanStyles.arrowGlow} />
                                <ChevronRight />
                            </button>

                            <div className={sevaPunjanStyles.carouselInner}>
                                <div className={sevaPunjanStyles.carouselTrack}>
                                    {currentTabData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={sevaPunjanStyles.carouselSlide}
                                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        >
                                            <div className={sevaPunjanStyles.imageGlow} />
                                            <Image
                                                src={img.src}
                                                alt={img.alt}
                                                width={800}
                                                height={500}
                                                className={sevaPunjanStyles.carouselImage}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className={sevaPunjanStyles.carouselIndicators}>
                                    {currentTabData.images.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`${sevaPunjanStyles.indicator} ${currentSlide === index ? sevaPunjanStyles.indicatorActive : ''}`}
                                            onClick={() => setCurrentSlide(index)}
                                        >
                                            {currentSlide === index && <div className={sevaPunjanStyles.indicatorRing} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bullet content */}
                        <div className={sevaPunjanStyles.contentList}>
                            <ul className={sevaPunjanStyles.bulletList}>
                                {currentTabData.bullets.map((bullet, i) => (
                                    <li key={i} className={sevaPunjanStyles.bulletItem}>{bullet}</li>
                                ))}
                            </ul>

                            {currentTabData.highlight && (
                                <div className={sevaPunjanStyles.highlightBox}>
                                    <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                                    <div className={sevaPunjanStyles.highlightContent}>
                                        <div className={sevaPunjanStyles.highlightOrnamentTop} />
                                        <p className={sevaPunjanStyles.highlightText}>{currentTabData.highlight}</p>
                                        <div className={sevaPunjanStyles.highlightOrnamentBottom} />
                                    </div>
                                    <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <RandalSahayate />
                </div>
            </div>
        </section>
    );
};

export default BhaktiPage;