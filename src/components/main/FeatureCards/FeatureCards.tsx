"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./FeatureCards.module.css";
import { useTranslation } from "@/hooks/useTranslation";

type FeatureCard = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export default function FeatureCards() {
  const { t, lang } = useTranslation();

  const topRowCards: FeatureCard[] = [
    {
      title: t("meetAndFollowTitle"),
      subtitle: t("copyTrading"),
      imageSrc: "/images/copy-trading.svg",
      imageAlt: "Copy Trading Icon",
    },
    {
      title: t("holdToMaximizeTitle"),
      subtitle: t("exchangeEarn"),
      imageSrc: "/images/exchange-earn.svg",
      imageAlt: "Exchange Earn Icon",
    },
    {
      title: t("sepaTransferTitle"),
      subtitle: t("buyCrypto"),
      imageSrc: "/images/card-payment.svg",
      imageAlt: "Card Payment Icon",
    },
  ];

  const bottomRowCards: FeatureCard[] = [
    {
      title: t("meetAndFollowTitle"),
      subtitle: t("copyTrading"),
      imageSrc: "/images/chart-trading.svg",
      imageAlt: "Chart Trading Icon",
    },
    {
      title: t("holdToMaximizeTitle"),
      subtitle: t("exchangeEarn"),
      imageSrc: "/images/wallet-earn.svg",
      imageAlt: "Wallet Earn Icon",
    },
    {
      title: t("holdToMaximizeTitle"),
      subtitle: t("exchangeEarn"),
      imageSrc: "/images/exchange-earn.svg",
      imageAlt: "Exchange Earn Icon",
    },
  ];

  const CardRow = ({ cards }: { cards: FeatureCard[] }) => (
    <div className={styles.cardRow}>
      {cards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.textContainer}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
            </div>
            <div className={styles.iconContainer}>
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                fill
                className={styles.iconImage}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className={styles.featureSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t("whyExchange")}</h2>
        <div className={styles.cardRows}>
          <CardRow cards={topRowCards} />
          <CardRow cards={bottomRowCards} />
        </div>
      </div>
    </section>
  );
}
