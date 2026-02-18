"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Phone, Mail } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubmenuItem {
  title: string;
  href: string;
}

interface MenuItem {
  title: string;
  href: string;
  submenu?: SubmenuItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Ravirandal Dham",
    href: "#salangpur-dham",
    submenu: [
      { title: "Parichay", href: "/ravirandaldham/parichay" },
      { title: "Itihas", href: "/ravirandaldham/itihas" },
      { title: "Mahima", href: "/ravirandaldham/mahima" },
      { title: "Shree 1008 Akshaypari Bapu", href: "/ravirandaldham/akshaypari-bapu" },
      { title: "Shree Ajaypari Bapu", href: "/ravirandaldham/ajaypari-bapu" },
      { title: "Shree Dineshpuri Bapu", href: "/ravirandaldham/dineshpuri-bapu" },
      { title: "Seva Karya", href: "/ravirandaldham/seva-karya" },
    ],
  },
  {
    title: "Upasna Vidhi",
    href: "#kashtabhanjan-dev",
    submenu: [
      { title: "Darshan Timing", href: "/upasna-vidhi/darshan-timing" },
      { title: "Seva Punjan", href: "/upasna-vidhi/seva-punjan" },
      { title: "Bhakti", href: "/upasna-vidhi/bhakti" },
      { title: "Utsav", href: "/upasna-vidhi/utsav" },
      { title: "Randal Tedvanu Booking", href: "/upasna-vidhi/randal-booking" },
      { title: "Yagna Booking", href: "/upasna-vidhi/yagna-booking" },
      { title: "Aarti", href: "/upasna-vidhi/aarti" },
      { title: "Mataji Darshan", href: "/upasna-vidhi/mataji-darshan" },
    ],
  },
  {
    title: "Facilities",
    href: "#facilities",
    submenu: [
      { title: "Bhojan Shala", href: "/facilities/bhojan-shala" },
      { title: "108 Randal", href: "/facilities/108-randal" },
      { title: "Atithi Gruh", href: "/facilities/atithi-gruh" },
    ],
  },
  {
    title: "Pavitra Sthalo",
    href: "#pavitra-sthalo",
    submenu: [
      { title: "Shree Ravirandal Temple", href: "#dev-parichay" },
      { title: "Pavitra Vav", href: "#dev-itihas" },
      { title: "Shree Shanidev Temple", href: "#dev-mahima" },
      { title: "108 Randal", href: "#dev-mahima" },
      { title: "Shree Dineshpuri Bapu Samadhi Sthan", href: "#dev-mahima" },
      { title: "Dashama Temple", href: "#dev-mahima" },
    ],
  },
  {
    title: "Events",
    href: "#events",
    submenu: [
      { title: "Upcoming Events", href: "/events/upcoming-events" },
      { title: "Video Gallery", href: "/events/video-gallery" },
      { title: "Photo Gallery", href: "/events/photo-gallery" },
    ],
  },
  {
    title: "History",
    href: "#history",
    submenu: [
      { title: "History of Randaldham", href: "/history/history-of-randaldham" },
      { title: "Randal Prerna", href: "/history/randal-prerna" },
    ],
  },
  {
    title: "Downloads",
    href: "#downloads",
    submenu: [
      { title: "Wallpaper", href: "/downloads/wallpaper" },
      { title: "Calendar", href: "/downloads/calendar" },
      { title: "Books", href: "/downloads/books" },
      { title: "Audio", href: "/downloads/audio" },
    ],
  },
  { title: "Thoughts of Bapu", href: "#thoughts-of-bapu" },
  { title: "Store", href: "#store" },
  { title: "Donation", href: "#donation" },
  { title: "Contact Us", href: "#contact-us" },
];

const CONTACT_PHONE = "98258 35304, 05, 06";
const CONTACT_EMAIL = "shreesalangpur@gmail.com";
const CONTACT_ADDRESS = "P.O. Salangpur (Hanuman) Ta: Barwala, Dist. Botad, Gujarat";

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TopBarProps { }

const TopBar: React.FC<TopBarProps> = () => (
  <div
    className="text-primary-foreground text-xs py-1.5"
    style={{
      background:
        "linear-gradient(160deg, #1A0800 0%, #120500 35%, #1F0A00 65%, #150600 100%)",
    }}
  >
    <div className="container mx-auto flex justify-between items-center px-4">
      <div className="flex items-center gap-4">
        <a
          href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          aria-label="Call us"
        >
          <Phone className="w-3 h-3" />
          <span>{CONTACT_PHONE}</span>
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden md:flex items-center gap-1 hover:opacity-80 transition-opacity"
          aria-label="Email us"
        >
          <Mail className="w-3 h-3" />
          <span>{CONTACT_EMAIL}</span>
        </a>
      </div>
      <address className="hidden sm:block not-italic text-xs">
        {CONTACT_ADDRESS}
      </address>
    </div>
  </div>
);

// ─── Desktop Nav Item ─────────────────────────────────────────────────────────

interface DesktopNavItemProps {
  item: MenuItem;
}

const DesktopNavItem: React.FC<DesktopNavItemProps> = ({ item }) => (
  <div className="nav-item relative group">
    <Link
      href={item.href}
      className="flex items-center text-white gap-1 px-3 py-4 text-[13px] font-medium transition-colors relative
        after:absolute after:bottom-2 after:left-3 after:right-3 after:h-0.5
        after:bg-primary after:scale-x-0 after:origin-left
        after:transition-transform after:duration-300 hover:after:scale-x-100"
    >
      {item.title}
      {item.submenu && (
        <ChevronDown
          className="w-3 h-3 transition-transform group-hover:rotate-180"
          aria-hidden="true"
        />
      )}
    </Link>

    {item.submenu && (
      <div className="nav-dropdown" role="menu" aria-label={`${item.title} submenu`}>
        {item.submenu.map((sub) => (
          <Link
            key={sub.title}
            href={sub.href}
            className="nav-dropdown-item"
            role="menuitem"
          >
            {sub.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

// ─── Mobile Nav Item ──────────────────────────────────────────────────────────

interface MobileNavItemProps {
  item: MenuItem;
  isOpen: boolean;
  onToggle: (title: string) => void;
  onClose: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  item,
  isOpen,
  onToggle,
  onClose,
}) => (
  <div>
    {item.submenu ? (
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
        onClick={() => onToggle(item.title)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
    ) : (
      <Link
        href={item.href}
        className="w-full flex items-center justify-between px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors"
        onClick={onClose}
      >
        {item.title}
      </Link>
    )}

    {item.submenu && isOpen && (
      <div className="bg-secondary/50" role="menu">
        {item.submenu.map((sub) => (
          <Link
            key={sub.title}
            href={sub.href}
            className="block px-10 py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            role="menuitem"
            onClick={onClose}
          >
            {sub.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

// ─── Main Header ──────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setOpenSubmenu(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll position for sticky header styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSubmenuToggle = useCallback((title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
    setOpenSubmenu(null);
  }, []);

  return (
    <>
      <TopBar />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-card shadow-sm"
          }`}
      >
        {/* Decorative bottom gradient border */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(24 100% 50%), hsl(43 100% 50%), hsl(24 100% 50%), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Logo + Bapu images row */}
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
            <Image
              src="/images/logo.webp"
              alt="Shree Ravirandaldham logo"
              width={64}
              height={64}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-primary leading-tight">
                Shree Ravirandaldham
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Randaldhma Mandir, Dadva
              </p>
            </div>
          </Link>

          <div className="flex gap-3 items-center" aria-hidden="true">
            <Image
              src="/images/bapu-2.png"
              alt="Bapu"
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
            <Image
              src="/images/bapu-1.png"
              alt="Bapu"
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="bg-gradient-to-r from-saffron-dark via-primary to-saffron-dark">
          <div className="container mx-auto px-4">
            <nav
              className="hidden lg:flex items-center gap-0"
              aria-label="Main navigation"
            >
              {MENU_ITEMS.map((item) => (
                <DesktopNavItem key={item.title} item={item} />
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            id="mobile-nav"
            className="lg:hidden bg-card border-t border-border max-h-[70vh] overflow-y-auto"
            aria-label="Mobile navigation"
          >
            {MENU_ITEMS.map((item) => (
              <MobileNavItem
                key={item.title}
                item={item}
                isOpen={openSubmenu === item.title}
                onToggle={handleSubmenuToggle}
                onClose={handleMobileClose}
              />
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;