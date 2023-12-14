"use client";

import React, { useState } from "react";
import Header from "@/components/Header/Header";
import styles from "./page.module.scss";

import RadioButton from "@/components/RadioButton/RadioButton";
import Films from "@/components/Films/Films";
import { values } from "@/constants/constants";
import AddFilm from "@/components/AddFilm/AddFilm";

export default function Page() {
  const [activeItem, setActiveItem] = useState<string>("/films/add");
  const [defaultValue, setDefaultValue] = useState<string>(values[0]);
  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.film}>
        <h2 className={styles.title}>О фильме</h2>
        <RadioButton
          defaultValue={defaultValue}
          setDefaultValue={setDefaultValue}
          values={values}
        />
        {defaultValue === values[0] ? (
          <Films setDefaultValue={setDefaultValue} />
        ) : (
          <AddFilm />
        )}
      </div>
    </div>
  );
}
