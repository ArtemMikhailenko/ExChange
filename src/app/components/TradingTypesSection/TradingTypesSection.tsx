"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import styles from "./TradingTypesSection.module.css";

type TradingType = {
  title: string;
  subtitle: React.ReactNode;
  link: string;
};

export default function TradingTypesSection() {
  const { t } = useTranslation("common");

  const tradingTypes: TradingType[] = [
    {
      title: t("spot"),
      subtitle: (
        <>
          {t("spotDescriptionPrefix")}{" "}
          <span className={styles.bold}>1000+</span>{" "}
          {t("spotDescriptionSuffix")}
        </>
      ),
      link: "/spot",
    },
    {
      title: t("futures"),
      subtitle: (
        <>
          {t("futuresDescriptionPrefix")}{" "}
          <span className={styles.bold}>125x</span>{" "}
          {t("futuresDescriptionSuffix")}
        </>
      ),
      link: "/futures",
    },
    {
      title: t("gridTrading"),
      subtitle: (
        <>
          {t("gridTradingDescriptionPrefix")}{" "}
          <span className={styles.bold}>24/7</span>{" "}
          {t("gridTradingDescriptionSuffix")}
        </>
      ),
      link: "/grid-trading",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {tradingTypes.map((type, index) => (
            <div key={index} className={styles.card}>
              <h2 className={styles.title}>{type.title}</h2>
              <p className={styles.description}>{type.subtitle}</p>
              <div className={styles.linkWrapper}>
                <Link href={type.link} className={styles.link}>
                  {t("learnMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
