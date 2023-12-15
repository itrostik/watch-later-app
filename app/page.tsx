"use client";

import Header from "@/components/Header/Header";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("/");
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("user")) {
        router.push("/auth/login");
      }
    }
  }, []);
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
