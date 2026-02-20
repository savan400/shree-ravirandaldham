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
import RandalSahayate from './randalSahayate';
import { useInView } from '@/hooks/useInView';
import { visibleClass } from '@/lib/utils';

const tabs = [
    { id: 'rajopchar', label: 'રાજોપચાર\nપૂજન', icon: '🙏' },
    { id: 'pujim', label: 'પૂજિમ\nપૂજન', icon: '🪔' },
    { id: 'samuh', label: 'સમૂહ માસ્તી\nયજ્ઞ', icon: '🔥' },
    { id: 'hanuman', label: 'શ્રી હનુમાન ચાલીસા\nયજ્ઞ', icon: '📿' },
    { id: 'maha', label: 'શ્રી મારુતિ\nયજ્ઞ', icon: '🕉️' },
    { id: 'tel', label: 'તેલ\nઅભિષેક', icon: '🪷' },
    { id: 'fal', label: 'શ્રી\nફળ', icon: '🍊' },
    { id: 'sukhdi', label: 'સુખડીની\nમાનતા', icon: '🍬' },
];

const carouselImages = [
    { src: '/images/seva-1.jpg', alt: 'Rajopchar Pujan 1' },
    { src: '/images/seva-2.jpg', alt: 'Rajopchar Pujan 2' },
    { src: '/images/seva-3.jpg', alt: 'Rajopchar Pujan 3' },
];

// Floating particles component
const FloatingParticle = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
    <div
        className={sevaPunjanStyles.floatingParticle}
        style={{
            left,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
        }}
    />
);

// Decorative corner ornament SVG
const CornerOrnament = ({ flip = false }: { flip?: boolean }) => (
    <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        className={sevaPunjanStyles.cornerOrnament}
        style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
        <path d="M5 75 L5 5 L75 5" stroke="url(#corner-grad)" strokeWidth="2.5" opacity="0.8" />
        <path d="M5 30 Q20 30 20 5" stroke="#F5A623" strokeWidth="1" opacity="0.5" />
        <path d="M5 50 Q35 50 35 5" stroke="#F5A623" strokeWidth="0.7" opacity="0.3" />
        <circle cx="5" cy="5" r="5" fill="url(#corner-grad)" />
        <circle cx="5" cy="5" r="3" fill="#FFF" opacity="0.5" />
        <defs>
            <linearGradient id="corner-grad" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#FF6B00" />
                <stop offset="1" stopColor="#FFD700" />
            </linearGradient>
        </defs>
    </svg>
);

const SevaPunjanPage = () => {

    const [activeTab, setActiveTab] = useState('rajopchar');
    const [currentSlide, setCurrentSlide] = useState(0);
    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    });

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <FloatingParticle
                    key={i}
                    delay={i * 0.8}
                    duration={8 + i * 0.5}
                    left={`${10 + i * 8}%`}
                />
            ))}

            <div className={sevaPunjanStyles.container}>
                <div className={visibleClass("header", visible)}>
                    <CommonTitle text="સેવા પુંજન" />
                    <LotusDivider />

                    {/* Sacred subtitle */}
                    <div className={sevaPunjanStyles.sacredSubtitle}>
                        <Flame className={sevaPunjanStyles.flameIcon} />
                        <span>॥ ભક્તિમાર્ગ — સેવાનો મહિમા ॥</span>
                        <Flame className={sevaPunjanStyles.flameIcon} />
                    </div>

                    {/* Premium Tabs with 3D effect */}
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
                                {activeTab === tab.id && (
                                    <div className={sevaPunjanStyles.tabGlow} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Premium Content Card with ornaments */}
                    <div className={sevaPunjanStyles.contentCard}>

                        {/* Animated top border */}
                        <div className={sevaPunjanStyles.cardTopBorder} />

                        {/* Sacred title with mandala */}
                        <div className={sevaPunjanStyles.titleContainer}>
                            <svg className={sevaPunjanStyles.mandala} width="50" height="50" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="23" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.6" />
                                <circle cx="25" cy="25" r="18" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.4" />
                                <circle cx="25" cy="25" r="13" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i * 360 / 12) * Math.PI / 180;
                                    return (
                                        <line
                                            key={i}
                                            x1={25 + 13 * Math.cos(angle)}
                                            y1={25 + 13 * Math.sin(angle)}
                                            x2={25 + 23 * Math.cos(angle)}
                                            y2={25 + 23 * Math.sin(angle)}
                                            stroke="#FFD700"
                                            strokeWidth="0.3"
                                            opacity="0.5"
                                        />
                                    );
                                })}
                                <defs>
                                    <linearGradient id="mandala-grad">
                                        <stop stopColor="#FF6B00" />
                                        <stop offset="1" stopColor="#FFD700" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h2 className={sevaPunjanStyles.contentTitle}>રાજોપચાર પૂજન</h2>
                            <svg className={sevaPunjanStyles.mandala} width="50" height="50" viewBox="0 0 50 50">
                                <circle cx="25" cy="25" r="23" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.6" />
                                <circle cx="25" cy="25" r="18" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.4" />
                                <circle cx="25" cy="25" r="13" stroke="url(#mandala-grad)" strokeWidth="0.5" fill="none" opacity="0.3" />
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i * 360 / 12) * Math.PI / 180;
                                    return (
                                        <line
                                            key={i}
                                            x1={25 + 13 * Math.cos(angle)}
                                            y1={25 + 13 * Math.sin(angle)}
                                            x2={25 + 23 * Math.cos(angle)}
                                            y2={25 + 23 * Math.sin(angle)}
                                            stroke="#FFD700"
                                            strokeWidth="0.3"
                                            opacity="0.5"
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Premium Carousel with 3D frame */}
                        <div className={sevaPunjanStyles.carousel}>

                            <button
                                className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowPrev}`}
                                onClick={prevSlide}
                            >
                                <div className={sevaPunjanStyles.arrowGlow} />
                                <ChevronLeft />
                            </button>
                            <button
                                className={`${sevaPunjanStyles.carouselArrow} ${sevaPunjanStyles.arrowNext}`}
                                onClick={nextSlide}
                            >
                                <div className={sevaPunjanStyles.arrowGlow} />
                                <ChevronRight />
                            </button>
                            <div className={sevaPunjanStyles.carouselInner}>
                                <div className={sevaPunjanStyles.carouselTrack}>
                                    {carouselImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={sevaPunjanStyles.carouselSlide}
                                            style={{
                                                transform: `translateX(-${currentSlide * 100}%)`,
                                            }}
                                        >
                                            {/* Radial glow behind image */}
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

                                {/* Premium navigation arrows */}


                                {/* Decorative indicators */}
                                <div className={sevaPunjanStyles.carouselIndicators}>
                                    {carouselImages.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`${sevaPunjanStyles.indicator} ${currentSlide === index ? sevaPunjanStyles.indicatorActive : ''}`}
                                            onClick={() => setCurrentSlide(index)}
                                        >
                                            {currentSlide === index && (
                                                <div className={sevaPunjanStyles.indicatorRing} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content with ornamental bullets */}
                        <div className={sevaPunjanStyles.contentList}>
                            <ul className={sevaPunjanStyles.bulletList}>
                                <li className={sevaPunjanStyles.bulletItem}>
                                    શ્રી સાળંગપુરધામમાં શ્રી કષ્ટભંજન દેવ હનુમાનજી મહારાજને રાજોપચાર પૂજન ઘણી વખત કરવામાં આવે છે.
                                </li>
                                <li className={sevaPunjanStyles.bulletItem}>
                                    ભગવાન શ્રી રામનાં સમર્પિત સેવક હનુમાનજી મહારાજ પણ એક રાજાની જેમ પોતાનાં ભક્તોને કરેને નિરંતર દૂર કરે છે, તેથી જ શ્રી સાળંગપુરધામમાં કોઈને કોઈ કારણસર રાજોપચાર પૂજન કરવામાં આવે છે.
                                </li>
                                <li className={sevaPunjanStyles.bulletItem}>
                                    જે ઉપાસથી રાજા પ્રસન્ન થાય છે તેને રાજોપચાર પૂજન કહે છે. શ્રી હનુમાનજી મહારાજ શાસ્ત્રોમાં પ્રચંત છે.
                                </li>
                            </ul>

                            {/* Sacred highlight box with flames */}
                            <div className={sevaPunjanStyles.highlightBox}>
                                <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                                <div className={sevaPunjanStyles.highlightContent}>
                                    <div className={sevaPunjanStyles.highlightOrnamentTop} />
                                    <p className={sevaPunjanStyles.highlightText}>
                                        કેઓ વેદના રહસ્યો જાણો છે, તેથી જ રાજોપચાર પૂજનમાં ચાર વેદના મંત્રો સૌપ્રથમ હનુમાનજી મહારાજને સમર્પિતથાય છે.
                                    </p>
                                    <div className={sevaPunjanStyles.highlightOrnamentBottom} />
                                </div>
                                <div className={sevaPunjanStyles.highlightFlame}>🔥</div>
                            </div>

                            <ul className={sevaPunjanStyles.bulletList}>
                                <li className={sevaPunjanStyles.bulletItem}>
                                    ત્યાર બાદ પ્રાક્તિક લોણામાં લખેલા શાસ્ત્રો, પુરાણો, ઉપનિષદો અને ગાનું પણ હસ્યપૂર્વક પાઠ કરવામાં આવે છે.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <RandalSahayate />
                </div>
            </div>
        </section>
    )
}

export default SevaPunjanPage