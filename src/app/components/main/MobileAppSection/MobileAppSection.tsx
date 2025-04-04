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
          <div className={styles.leftColumn}>
            <h2 className={styles.title}>
              {t("tradeAnywhereTitle")}
            </h2>
          </div>
          
          <div className={styles.rightColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/mobile-light.png"
                alt="Exchange Mobile App"
                layout="responsive"
                width={600}  
                height={600} 
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
