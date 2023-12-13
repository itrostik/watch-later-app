import styles from "./RadioButton.module.scss";
import React from "react";
export default function RadioButton({
  defaultValue,
  setDefaultValue,
  values,
}: {
  defaultValue: string;
  setDefaultValue: React.Dispatch<string>;
  values: string[];
}) {
  return (
    <div className={styles.button}>
      <label className={styles.input}>
        <input
          type="radio"
          value={values[0]}
          name={"film"}
          onClick={() => setDefaultValue(values[0])}
          style={{ display: "none" }}
        />
        <span>{values[0]}</span>
      </label>
      <label className={styles.input}>
        <input
          type="radio"
          value={values[1]}
          name={"film"}
          onClick={() => setDefaultValue(values[1])}
          style={{ display: "none" }}
        />
        <span>{values[1]}</span>
      </label>
      <div
        className={styles.switch}
        style={{ left: defaultValue === values[0] ? 2 : 168 }}
      ></div>
    </div>
  );
}
