"use client";
import React, { useState } from "react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import don from "../app/[locale]/donation/DonationPage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";
import RandalSahayate from "./randalSahayate";
import PaymentModal from "@/components/Paymentmodal/Paymentmodal";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DonationCategory {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  amounts: { label: string; value: number }[];
  hasCustom: boolean;
  minCustom?: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const categories: DonationCategory[] = [
  {
    id: "gaudaan",
    icon: "🐄",
    title: "Gaudaan",
    subtitle: "Gayo na ghaaschaara mate",
    amounts: [
      { label: "₹ 251", value: 251 },
      { label: "₹ 551", value: 551 },
      { label: "₹ 1100", value: 1100 },
    ],
    hasCustom: true,
    minCustom: 100,
  },
  {
    id: "bhavan",
    icon: "🏛️",
    title: "Nutan Yatrik Bhavan",
    subtitle: "Construction Help",
    amounts: [
      { label: "₹ 1100", value: 1100 },
      { label: "₹ 2100", value: 2100 },
      { label: "₹ 5100", value: 5100 },
      { label: "₹ 11000", value: 11000 },
      { label: "₹ 21000", value: 21000 },
    ],
    hasCustom: false,
  },
  {
    id: "maanta",
    icon: "🙏",
    title: "Maanta (Mannat)",
    subtitle: "Choose From The Amount Listed:",
    amounts: [
      { label: "₹ 251", value: 251 },
      { label: "₹ 551", value: 551 },
      { label: "₹ 1100", value: 1100 },
    ],
    hasCustom: true,
    minCustom: 100,
  },
  {
    id: "thaal",
    icon: "🍱",
    title: "Thaal (Dada no Bhog)",
    subtitle: "Choose From The Amount Listed:",
    amounts: [
      { label: "₹ 501", value: 501 },
      { label: "₹ 1101", value: 1101 },
      { label: "₹ 2101", value: 2101 },
    ],
    hasCustom: true,
    minCustom: 100,
  },
  {
    id: "yagna",
    icon: "🔥",
    title: "Navchandi Yagna",
    subtitle: "Choose From The Amount Listed:",
    amounts: [
      { label: "₹ 25000 (One Day)", value: 25000 },
      { label: "₹ 21000 (Two Days)", value: 51000 },
    ],
    hasCustom: false,
  },
  {
    id: "bhet",
    icon: "🤲",
    title: "Bhet (Swaichhik Donation)",
    subtitle: "Choose From The Amount Listed:",
    amounts: [
      { label: "₹ 251", value: 251 },
      { label: "₹ 551", value: 551 },
      { label: "₹ 1100", value: 1100 },
    ],
    hasCustom: true,
    minCustom: 100,
  },
];
interface DonationCardProps {
  cat: DonationCategory;
  onPay: (amount: number, category: string) => void;
}

// ── Donation Card ─────────────────────────────────────────────────────────────
const DonationCard = ({ cat, onPay }: DonationCardProps) => {
  const [selected, setSelected] = useState<number | "custom" | null>(null);
  const [customAmt, setCustomAmt] = useState("");

  const handleSelect = (val: number | "custom") => setSelected(val);

  const getEffectiveAmount = () => {
    if (selected === "custom") return parseInt(customAmt) || 0;
    return selected ?? 0;
  };

  const handlePay = () => {
    const amt = getEffectiveAmount();
    if (!amt || (cat.minCustom && amt < cat.minCustom)) return;

    onPay(amt, cat.title); // ✅ Open modal
  };
  return (
    <div className={don.donCard}>
      <div className={don.donCardHeader}>
        <span className={don.donIcon}>{cat.icon}</span>
        <div>
          <h3 className={don.donTitle}>{cat.title}</h3>
          <p className={don.donSub}>{cat.subtitle}</p>
        </div>
      </div>

      <div className={don.donAmounts}>
        {cat.amounts.map((a) => (
          <label
            key={a.value}
            className={`${don.donOption} ${selected === a.value ? don.donOptionActive : ""}`}
          >
            <input
              type="radio"
              name={cat.id}
              value={a.value}
              checked={selected === a.value}
              onChange={() => handleSelect(a.value)}
            />
            <span className={don.donRadio} />
            <span className={don.donAmountLabel}>{a.label}</span>
          </label>
        ))}

        {cat.hasCustom && (
          <label
            className={`${don.donOption} ${selected === "custom" ? don.donOptionActive : ""}`}
          >
            <input
              type="radio"
              name={cat.id}
              value="custom"
              checked={selected === "custom"}
              onChange={() => handleSelect("custom")}
            />
            <span className={don.donRadio} />
            <span className={don.donAmountLabel}>Custom Amount</span>
          </label>
        )}
      </div>

      {selected === "custom" && (
        <div className={don.donCustomWrap}>
          <span className={don.donRupee}>₹</span>
          <input
            className={don.donCustomInput}
            type="number"
            placeholder={`Minimum amt. ${cat.minCustom} or higher`}
            value={customAmt}
            min={cat.minCustom}
            onChange={(e) => setCustomAmt(e.target.value)}
          />
        </div>
      )}

      {!selected && cat.hasCustom && (
        <div className={don.donHint}>
          Minimum amt. {cat.minCustom} or higher
        </div>
      )}

      <button className={don.donPayBtn} onClick={handlePay}>
        <span className={don.donPayGlow} />
        Pay Now
      </button>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const DonationPage = () => {
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpenModal = (amount: number, category: string) => {
    setSelectedAmount(amount);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  return (
    <section ref={sectionRef} className={styles.section}>
      <PageBackgroundDecorations />

      <div className={don.container}>
        <div className={visibleClass("header", visible)}>
          <CommonTitle text="Donation" />
          <LotusDivider />

          {/* ── Donor Info Fields ── */}
          <div className={don.donInfoWrap}>
            <div className={don.donField}>
              <span className={don.donFieldIcon}>👤</span>
              <input
                type="text"
                placeholder="Donor's Name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div className={don.donField}>
              <span className={don.donFieldIcon}>✉️</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={don.donField}>
              <span className={don.donFieldIcon}>📞</span>
              <input
                type="tel"
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>
          {/* ── Donation Categories ── */}
          <div className={don.donGrid}>
            {categories.map((cat) => (
              <DonationCard key={cat.id} cat={cat} onPay={handleOpenModal} />
            ))}
          </div>

          <RandalSahayate />
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={selectedAmount}
        categoryTitle={selectedCategory}
        donorName={donorName}
      />
    </section>
  );
};

export default DonationPage;
