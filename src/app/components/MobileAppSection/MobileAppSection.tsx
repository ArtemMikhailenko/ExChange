"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./MobileAppSection.module.css";

export default function MobileAppSection() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.row}>
          {/* Левая колонка с текстом */}
          <div className={styles.leftColumn}>
            <h2 className={styles.title}>
              {t("tradeAnywhereTitle")}
            </h2>
          </div>
          
          {/* Правая колонка с изображением */}
          <div className={styles.rightColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/mobile-light.png"
                alt="Exchange Mobile App"
                layout="responsive"
                width={600}  // задаем 600 для десктопа
                height={600} // устанавливаем квадратное соотношение 1:1
                className={styles.image}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
