"use client";
import React, { useState } from "react";
import styles from "@/app/[locale]/ravirandaldham/akshaypari-bapu/AdaypatiBapuPage.module.css";
import cu from "../app/[locale]/contact-us/Contactuspage.module.css";
import PageBackgroundDecorations from "@/components/PageBackgroundDecorations/PageBackgroundDecorations";
import CommonTitle from "@/components/CommonTitle/CommonTitle";
import LotusDivider from "@/components/LotusDivider/LotusDivider";
import DiamondDivider from "@/components/DiamondDivider/DiamondDivider";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { visibleClass } from "@/lib/utils";
import RandalSahayate from "./randalSahayate";

const ContactUsPage = () => {
  const t = useTranslations("ContactUs");
  const { ref: sectionRef, isVisible: visible } = useInView<HTMLElement>({
    threshold: 0.1,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // hook up your API here
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <PageBackgroundDecorations />

      <div className={cu.container}>
        <div className={visibleClass("header", visible)}>
          <CommonTitle text={t("cu_title")} />
          <LotusDivider />

          {/* ── Two-column: Info + Form ── */}
          <div className={cu.cuWrap}>
            {/* Info Cards */}
            <div className={cu.cuInfo}>
              <div className={cu.cuInfoCard}>
                <div className={cu.cuInfoRow}>
                  <span className={cu.cuInfoIcon}>📍</span>
                  <div>
                    <p className={cu.cuInfoLabel}>{t("cu_address_label")}</p>
                    <p className={cu.cuInfoValue}>
                      {t("cu_address_value")}
                    </p>
                  </div>
                </div>
              </div>

              <div className={cu.cuInfoCard}>
                <div className={cu.cuInfoRow}>
                  <span className={cu.cuInfoIcon}>📞</span>
                  <div>
                    <p className={cu.cuInfoLabel}>{t("cu_phone_label")}</p>
                    <p className={cu.cuInfoValue}>
                      <a href="tel:+919825835304">98258 35304</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className={cu.cuInfoCard}>
                <div className={cu.cuInfoRow}>
                  <span className={cu.cuInfoIcon}>✉️</span>
                  <div>
                    <p className={cu.cuInfoLabel}>{t("cu_email_label")}</p>
                    <p className={cu.cuInfoValue}>
                      <a href="mailto:shreesalangpur@gmail.com">
                        shreesalangpur@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className={cu.cuInfoCard}>
                <div className={cu.cuInfoRow}>
                  <span className={cu.cuInfoIcon}>🕐</span>
                  <div>
                    <p className={cu.cuInfoLabel}>{t("cu_timings_label")}</p>
                    <p className={cu.cuInfoValue}>
                      {t("cu_timings_morning")}
                      <br />
                      {t("cu_timings_evening")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={cu.cuFormWrap}>
              <h3 className={cu.cuMapHeading} style={{ paddingTop: "30px" }}>
                {t("cu_find_us_heading")}
              </h3>
              <p className={cu.cuMapSub}>
                {t("cu_find_us_sub")}
              </p>
              <div className={cu.cuMapAccent} />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3703.9863309177945!2d71.07281885768664!3d21.819459028146856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3957e7064ebf3bc7%3A0xc9601760bf02d337!2sRavi%20Randal%20Mataji%20Temple!5e0!3m2!1sen!2sin!4v1771836384317!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                width={"100%"}
                height={333}
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Ravirandaldham - Salangpur Dham Location"
              />
            </div>
          </div>

          <RandalSahayate />
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
