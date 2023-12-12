"use client";

import Header from "@/components/Header/Header";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
export default function Home() {
  const [activeItem, setActiveItem] = useState("/");

  return (
    <main>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      {activeItem === "/" ? (
        <div className={styles.main}>
          <Image
            src={"/logo.svg"}
            alt={""}
            width={300}
            height={120}
            priority
            draggable={false}
          />
          <Image
            src={"/agona.svg"}
            alt={""}
            width={112}
            height={51}
            priority
            draggable={false}
            className={styles.agona}
          />
        </div>
      ) : (
        ""
      )}
    </main>
  );
}
