"use client"
import React from 'react'
import Image from 'next/image'
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css"
import b from "./CommonBookingPage.module.css"
import PageBackgroundDecorations from '@/components/PageBackgroundDecorations/PageBackgroundDecorations'
import CommonTitle from '@/components/CommonTitle/CommonTitle'
import LotusDivider from '@/components/LotusDivider/LotusDivider'
import { useInView } from '@/hooks/useInView'
import { visibleClass } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */

export interface ContactItem {
    icon: string
    label: string
    value: string
    href?: string          // if provided → renders as <a>
    target?: string
}

export interface NoteItem {
    text: React.ReactNode  // supports <strong> etc.
}

export interface BookingPageProps {
    /** Page heading shown in CommonTitle */
    pageTitle: string

    /** Hero image */
    imageSrc: string
    imageAlt?: string
    imageCaption?: string

    /** Right-panel content */
    aboutTitle: string
    aboutParagraphs: React.ReactNode[]   // array of paragraphs

    /** Contact section */
    contactTitle?: string                 // default: "સંપર્ક"
    contacts: ContactItem[]

    /** Note section */
    noteTitle?: string                    // default: "🔔 નોંધ"
    noteTitleEn?: string                  // default: "Important Note"
    notes: NoteItem[]

    /** Optional slot rendered after the note (e.g. <RandalSahayate />) */
    footer?: React.ReactNode
}

/* ─────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────── */

function MiniDivider() {
    return (
        <div className={b.miniDivider}>
            <div className={b.miniLine} />
            <span className={b.miniDot}>✦</span>
            <span className={b.miniDot} style={{ fontSize: '1.1rem' }}>🪷</span>
            <span className={b.miniDot}>✦</span>
            <div className={b.miniLine} />
        </div>
    )
}

/* ─────────────────────────────────────────────────────────
   COMMON BOOKING PAGE
───────────────────────────────────────────────────────── */

const CommonBookingPage = ({
    pageTitle,
    imageSrc,
    imageAlt = 'booking image',
    imageCaption,
    aboutTitle,
    aboutParagraphs,
    contactTitle = 'સંપર્ક',
    contacts,
    noteTitle = '🔔 નોંધ',
    noteTitleEn = 'Important Note',
    notes,
    footer,
}: BookingPageProps) => {

    const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
        threshold: 0.1,
    })

    return (
        <section ref={sectionRef} className={styles.section}>
            <PageBackgroundDecorations />

            <div className={styles.container}>
                <div className={visibleClass('header', visible)}>

                    {/* ── Page Title ── */}
                    <CommonTitle text={pageTitle} />
                    <LotusDivider />

                    {/* ════════════════════════════════════════
                        ① HERO CARD: image LEFT | content RIGHT
                        ════════════════════════════════════════ */}
                    <div className={b.card}>
                        <div className={b.heroRow}>

                            {/* LEFT — image */}
                            <div className={b.imagePanelLeft}>
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    width={500}
                                    height={400}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    priority
                                />
                                {imageCaption && (
                                    <div className={b.imageOverlay}>{imageCaption}</div>
                                )}
                            </div>

                            {/* RIGHT — about text */}
                            <div className={b.textPanelRight}>
                                <div>
                                    <p className={b.paneTitleGu}>{aboutTitle}</p>
                                    <span className={b.paneUnderline} />
                                </div>
                                {aboutParagraphs.map((para, i) => (
                                    <p key={i} className={b.paneText}>{para}</p>
                                ))}
                            </div>

                        </div>
                    </div>

                    <MiniDivider />

                    {/* ════════════════════════════════════════
                        ② CONTACT
                        ════════════════════════════════════════ */}
                    <div className={b.card}>
                        <div className={b.contactSection}>
                            <p className={b.sectionTitleGu}>{contactTitle}</p>
                            <span className={b.sectionUnderline} />

                            <div className={b.contactGrid}>
                                {contacts.map((c, i) =>
                                    c.href ? (
                                        <a
                                            key={i}
                                            href={c.href}
                                            target={c.target}
                                            rel={c.target === '_blank' ? 'noopener noreferrer' : undefined}
                                            className={b.contactCard}
                                        >
                                            <span className={b.contactIcon}>{c.icon}</span>
                                            <span className={b.contactLabel}>{c.label}</span>
                                            <span className={b.contactValue}>{c.value}</span>
                                        </a>
                                    ) : (
                                        <div key={i} className={b.contactCard}>
                                            <span className={b.contactIcon}>{c.icon}</span>
                                            <span className={b.contactLabel}>{c.label}</span>
                                            <span className={b.contactValue}>{c.value}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <MiniDivider />

                    {/* ════════════════════════════════════════
                        ③ NOTE
                        ════════════════════════════════════════ */}
                    <div className={b.noteBlock}>
                        <div className={b.noteHeader}>
                            <span className={b.noteTitleGu}>{noteTitle}</span>
                            <span className={b.noteDivide}>/</span>
                            <span className={b.noteTitleEn}>{noteTitleEn}</span>
                        </div>
                        <ul className={b.noteList}>
                            {notes.map((n, i) => (
                                <li key={i}>{n.text}</li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Optional footer slot ── */}
                    {footer}

                </div>
            </div>
        </section>
    )
}

export default CommonBookingPage