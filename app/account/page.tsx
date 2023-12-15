"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import styles from "./page.module.scss";
import { UserType } from "@/types/userType";
import Link from "next/link";

export default function Account() {
  const [activeItem, setActiveItem] = useState<string>("/account");

  const [user, setUser] = useState<UserType | null>(
    JSON.parse(localStorage.getItem("user")!),
  );

  return (
    <div className={styles.wrapper}>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.account}>
        <h2 className={styles.username}>
          {user?.name ? user.name : user?.email}
        </h2>
        <div className={styles.description}>{user?.description}</div>
        <div className={styles.avatar}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" />
          ) : (
            <div className={styles.imageBlock}></div>
          )}
        </div>
        <h3 className={styles.genreTitle}>Любимые жанры</h3>
        {user?.genres && user.genres.length > 0 ? (
          <div className={styles.genres}>
            {user?.genres.map((genre) => {
              return (
                <div key={genre} className={styles.genreBlock}>
                  {genre}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.genres}>Нет любимых жанров</div>
        )}
        <Link href={"/account/edit"} className={styles.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none"
          >
            <path
              d="M20.91 2.68959L21.7108 1.84712C22.0889 1.44866 22.1 0.890803 21.7219 0.515106L21.4661 0.241872C21.1213 -0.111056 20.5652 -0.0655168 20.2092 0.298795L19.3973 1.1185L20.91 2.68959ZM8.10817 14.5297L10.277 13.562L20.0869 3.52068L18.5631 1.98374L8.76438 12.0251L7.76338 14.1654C7.6744 14.359 7.89684 14.6208 8.10817 14.5297ZM3.49241 23H16.55C18.5409 23 19.7087 21.816 19.7087 19.4707V6.79949L17.918 8.63244V19.3796C17.918 20.5637 17.2841 21.1671 16.5166 21.1671H3.51465C2.40242 21.1671 1.79069 20.5637 1.79069 19.3796V6.45795C1.79069 5.27393 2.40242 4.65916 3.51465 4.65916H13.1355L14.9261 2.82621H3.49241C1.16784 2.82621 0 4.01023 0 6.35549V19.4707C0 21.8274 1.16784 23 3.49241 23Z"
              fill="#DADADA"
            />
          </svg>
          <span>Редактировать</span>
        </Link>
      </div>
    </div>
  );
}
