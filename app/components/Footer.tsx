import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Salangpur Dham", href: "#salangpur-dham" },
  { label: "Shree Kashtabhanjan Dev", href: "#kashtabhanjan-dev" },
  { label: "King of Salangpur", href: "#king-of-salangpur" },
  { label: "Dev Darshan", href: "#dev-darshan" },
  { label: "Events", href: "#events" },
] as const;

const CONTACT_ADDRESS =
  "P.O. Salangpur (Hanuman) Ta: Barwala, Dist. Botad, Gujarat, India Pin-382450";
const CONTACT_PHONE = "98258 35304, 05, 06";
const CONTACT_EMAIL = "shreesalangpur@gmail.com";
const CURRENT_YEAR = new Date().getFullYear();

// ─── Component ───────────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer className="relative bg-foreground text-background py-12 overflow-hidden">
    {/* Decorative top border */}
    <div
      className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent, hsl(43 100% 50%), hsl(24 100% 50%), hsl(43 100% 50%), transparent)",
      }}
      aria-hidden="true"
    />

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid md:grid-cols-3 gap-8">

        {/* ── Brand column ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/logo.webp"
              alt="Shree Ravirandaldham logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
            />
            <div>
              <p className="font-bold text-sm">Shree Ravirandaldham</p>
              <p className="text-xs text-background/70">Randaldhma Mandir, Dadva</p>
            </div>
          </div>
          <p className="text-sm text-background/70 font-hindi leading-relaxed">
            શ્રી સ્વામિનારાયણ મંદિર વડતાલધામ તાબાનું શ્રી કષ્ટભંજનદેવ
            હનુમાનજી મંદિર-સાળંગપુર
          </p>
        </div>

        {/* ── Quick links column ── */}
        <nav aria-label="Footer quick links">
          <h2 className="font-bold text-sm mb-4 text-gold">Quick Links</h2>
          <ul className="space-y-2 text-sm text-background/70">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-primary hover:pl-1 transition-[color,padding] duration-200"
                >
                  → {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Contact column ── */}
        <div>
          <h2 className="font-bold text-sm mb-4 text-gold">Contact</h2>
          <address className="not-italic space-y-3 text-sm text-background/70">
            <p className="flex items-start gap-2 hover:text-background/90 transition-colors">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              {CONTACT_ADDRESS}
            </p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-background/90 transition-colors"
              aria-label={`Call us at ${CONTACT_PHONE}`}
            >
              <Phone className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
              {CONTACT_PHONE}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 hover:text-background/90 transition-colors"
              aria-label={`Email us at ${CONTACT_EMAIL}`}
            >
              <Mail className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </address>
        </div>

      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-background/10 mt-8 pt-6 text-center text-xs text-background/50">
        <p>
          © {CURRENT_YEAR} Shree Ravirandaldham Mandir, Dadva.
          All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;