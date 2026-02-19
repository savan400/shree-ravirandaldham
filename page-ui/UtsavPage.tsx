"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import styles from "../app/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import sevaPunjanStyles from "../app/upasna-vidhi/seva-punjan/SevaPunjanPage.module.css";
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations';
import CommonTitle from '@/components/CommonTitle/CommonTitle';
import LotusDivider from '@/components/LotusDivider/LotusDivider';
import DiamondDivider from '@/components/DiamondDivider/DiamondDivider';

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
        id: 'patotsav',
        label: 'પાટોત્સવ',
        icon: '🙏',
        title: 'પાટોત્સવ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'જે તે મંદિરની પ્રતિષ્ઠાની જે તિથિએ કરવામાં આવેલ છે તેને દર વર્ષે તે જ તિથિએ પ્રતિષ્ઠાનું સેલિબ્રેશન કરવું તેને પાટોત્સવ કહેવામાં આવે છે.',
            'શ્રી સાળંગપુર ધામમાં આસો વદ પાંચમના દિવસે શ્રી હનુમાનજી મહારાજની પ્રતિષ્ઠા સદ્ગુરુ શ્રી ગોપાળાનંદ સ્વામીએ કરી હતી.',
            'તે જ તિથિએ દાદાને ભવ્ય શણગાર, અન્નકૂટ, દાદાનો રાજપચાર પૂજન વગેરે કાર્યક્રમો કરીને પાટોત્સવને ભવ્ય રીતે ઉજવવામાં આવે છે.',
            'આ દિવ્ય પાટોત્સવમાં શ્રી સ્વામિનારાયણ સંપ્રદાયના આચાર્ય મુખ્ય અર્ચક તરીકે તેમજ હજારો સંતો અને ભક્તો ભેગા મળી આ અવસરને ઉજવે છે, હનુમાનજી મહારાજને રાજી કરે છે અને પોતાનો ભાવ વ્યક્ત કરી ધન્યતા અનુભવે છે.',
            'દાદાના ભક્તો પાટોત્સવમાં યજમાન બનીને આ દિવ્ય અવસરની સેવાનો લાભ લઈ શકે છે.',
            'મંદિરની ઓફિસમાં ઘણા વર્ષ અગાઉથી જે ભક્તોએ નામ નોંધાવેલ છે તેના દરવર્ષ દરમિયાન અનુક્રમે નામ આવે છે અને યજમાન તરીકે એ ભક્ત સેવાનો લાભ લે છે, આવી પરંપરા છેલ્લા 175 વર્ષથી ચાલી આવે છે.',
        ],
    },
    {
        id: 'dhanuarmas',
        label: 'ધનુર્માસ',
        icon: '🪔',
        title: 'ધનુર્માસ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'સૂર્યદેવ જ્યારે મકરરાશિમાં સંક્રાંતિ કરે છે તે અગાઉ એક મહિના સુધી ધન રાશિમાં રહે છે. આ ધન રાશિમાં જે સૂર્યનું રહેવું તેને જ ધનુર્માસ કહેવામાં આવે છે.',
            'શ્રી સાળંગપુર ધામમાં ધનુર માસ દરમિયાન હનુમાનજી મહારાજને શનિવાર, મંગળવાર અને રવિવારે વિશેષ શણગાર કરવામાં આવે છે.',
            '⁠દર શનિવારે અને પૂર્ણિમાએ દાદાને ભવ્ય અને અન્નકુટ ધરાવવામાં આવે છે.'
        ],
    },
    {
        id: 'shravan',
        label: 'શ્રાવણ માસ',
        icon: '🔥',
        title: 'શ્રાવણ માસ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'સાળંગપુર ધામમાં શ્રાવણ માસના પવિત્ર દિવસોમાં શ્રી હનુમાનજી મહારાજને દરરોજ અવનવા શણગારો અવનવા અન્નકૂટ, જન્માષ્ટમી વગેરે જેવા ભવ્ય કાર્યક્રમો, સંપૂર્ણ માસ દરમ્યાન ભવ્ય હનુમાન ચાલીસા યજ્ઞ, પદયાત્રા, શોભાયાત્રા વગેરે જેવા કાર્યક્રમો કરીને સંપૂર્ણ શ્રાવણ માસને ખૂબ જ ભક્તિ ભાવપૂર્વક ઉજવવામાં આવે છે.',
            'ઉત્સવ દરમિયાન દાદાના ભક્તો દ્વારા યજમાન તરીકે આ તમામ ઉત્સવની ભાવપૂર્ણ રીતે સેવા કરવામાં આવે છે.',
        ],
    },
    {
        id: 'hanuman-jayanti',
        label: 'હનુમાન\nજયંતી',
        icon: '📿',
        title: 'હનુમાન જયંતી',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'રામાયણ સહિત અન્ય ગ્રંથો જેવા કે મહાભારત અને વિવિધ પુરાણોમાં શ્રી હનુમાન જી મહારાજનું વર્ણન થયું છે.',
            'જેઓ અંજની અને કેસરીના પુત્ર તેમજ વાયુદેવના પુત્ર છે.',
            'દાદાનો જન્‍મ ચૈત્રી પૂનમને દિવસે થયો હતો, જેની હનુમાન જયંતી તરીકે ઉજવણી થાય છે.',
            'સાળંગપુર ધામમાં શ્રી હનુમાન જયંતીનો મહોત્સવ ખૂબ જ ઐતિહાસિક રીતે ઉજવવામાં આવે છે.',
        ],
    },
    {
        id: 'kali-chaudash',
        label: 'કાળી\nચૌદશ',
        icon: '🕉️',
        title: 'કાળી ચૌદશ',
        images: [
            { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
            { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
            { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
        ],
        bullets: [
            'કાળી ચૌદસના દિવસે આ શુભ યોગમાં ભગવાન શ્રી હનુમાનની પૂજા કરવાથી વ્યક્તિને દરેક ક્ષેત્રમાં સફળતા મળે છે અને ધનમાં વૃદ્ધિ થાય છે.',
            '⁠કાળી ચૌદસના પવિત્ર દિવસે શ્રી સાળંગપુર ધામમાં શ્રીકષ્ટભંજન દેવને સમુહ મારૂતિ યજ્ઞ કરવામાં આવે છે.',
            '⁠સવારથી બપોર ૧૨ કલાક સુધી ચાલનારા આ યજ્ઞમાં વિશેષ કરીને હનુમાનજી મહારાજ નું પૂજન અને યજ્ઞ કરવામાં આવે છે જેનો હજારો લોકો ભાગ લે છે.',
            '⁠આ પરમ પવિત્ર દિવસે જે લાકડીના માધ્યમથી સદગુરુ શ્રી ગોપાળાનંદ સ્વામીએ શ્રી કષ્ટભંજન દેવની પ્રતિષ્ઠા કરી છે એ જ લાકડીનો મહા અભિષેક કરી અને પાણી અને એ પ્રસાદી નું જળ ભક્તોમાં વિતરણ કરવામાં આવે છે.',
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

const UtsavPage = () => {
    const [visible, setVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('vagha');
    const [currentSlide, setCurrentSlide] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    const currentTabData = tabs.find(t => t.id === activeTab) ?? tabs[0];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Reset slide when tab changes
    useEffect(() => { setCurrentSlide(0); }, [activeTab]);

    const nextSlide = () => setCurrentSlide(p => (p + 1) % currentTabData.images.length);
    const prevSlide = () => setCurrentSlide(p => (p - 1 + currentTabData.images.length) % currentTabData.images.length);

    const visibleClass = (base: string) =>
        `${styles[base]} ${visible ? styles.visible : ""}`;

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 0.8} duration={8 + i * 0.5} left={`${10 + i * 8}%`} />
            ))}

            <div className={sevaPunjanStyles.container}>
                <div className={visibleClass("header")}>
                    <CommonTitle text="ઉત્સવ" />
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

                    <div className={visibleClass("footer")} style={{ marginTop: '4rem' }}>
                        <DiamondDivider />
                        <p className={styles.footerBlessing} style={{ marginTop: '20px' }}>
                            ॥ જય સદગુરુ શ્રી ગોપાળાનંદ સ્વામી ॥
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UtsavPage;