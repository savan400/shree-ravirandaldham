// PaymentModal.tsx  — drop this alongside DonationPage
"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Paymentmodal.module.css";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  categoryTitle: string;
  donorName?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  categoryTitle,
  donorName,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const upiId = "randaldhaam@paytm";
  const payeeName = "Shri Randal Dham Trust";

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.modal}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
      >
        {/* ── Close ── */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* ── Header ── */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Complete Your Donation</h2>
          <p className={styles.headerSub}>
            {categoryTitle} &nbsp;·&nbsp;{" "}
            <strong>₹{amount.toLocaleString("en-IN")}</strong>
          </p>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          {/* QR Section */}
          <div className={styles.qrSection}>
            <div className={styles.qrFrame}>
              {/* Dummy QR — replace src with real generated QR */}
              <img
                className={styles.qrImage}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${encodeURIComponent(categoryTitle)}&cu=INR`}
                alt="Paytm Payment QR Code"
                width={220}
                height={220}
              />
              <div className={styles.qrCorner} data-pos="tl" />
              <div className={styles.qrCorner} data-pos="tr" />
              <div className={styles.qrCorner} data-pos="bl" />
              <div className={styles.qrCorner} data-pos="br" />
            </div>
            <p className={styles.qrHint}>Scan with Paytm / Any UPI App</p>
          </div>

          {/* ── Divider ── */}
          <div className={styles.orDivider}>
            <span>or pay using UPI ID</span>
          </div>

          {/* UPI ID copy */}
          <div className={styles.upiBox}>
            <span className={styles.upiLabel}>UPI ID</span>
            <span className={styles.upiId}>{upiId}</span>
            <button
              className={styles.copyBtn}
              onClick={() => navigator.clipboard.writeText(upiId)}
              title="Copy UPI ID"
            >
              📋
            </button>
          </div>

          {/* Payment details */}
          <div className={styles.detailsBox}>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Payee Name</span>
              <span className={styles.detailVal}>{payeeName}</span>
            </div>
            {donorName && (
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Donor</span>
                <span className={styles.detailVal}>{donorName}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Category</span>
              <span className={styles.detailVal}>{categoryTitle}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Amount</span>
              <span
                className={styles.detailVal}
                style={{ color: "#c45400", fontWeight: 700 }}
              >
                ₹{amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Note */}
          <p className={styles.note}>
            🙏 After payment, please take a screenshot and share it at{" "}
            <strong>+91-XXXXX-XXXXX</strong> for confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
