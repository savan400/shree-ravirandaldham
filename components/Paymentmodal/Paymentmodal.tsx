// PaymentModal.tsx  — drop this alongside DonationPage
"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Paymentmodal.module.css";
import { Download } from "lucide-react";

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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&tn=${encodeURIComponent(categoryTitle)}&cu=INR`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `donation-qr-${categoryTitle.replace(/\s+/g, "-").toLowerCase()}-₹${amount}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      // Fallback: open QR image in a new tab if fetch fails (e.g. due to CORS)
      window.open(qrUrl, "_blank");
    }
  };

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
              <img
                className={styles.qrImage}
                src={qrUrl}
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

            {/* ── Download QR Button ── */}
            <button
              className={styles.downloadQrBtn}
              onClick={handleDownloadQR}
              title="Download QR Code"
            >
              <Download /> <span>Download QR</span>
            </button>
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
