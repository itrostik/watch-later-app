"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";

import styles from "./page.module.scss";
import axios from "axios";
import { FilmType } from "@/types/filmType";

import ContentLoader from "react-content-loader";
import { UserType } from "@/types/userType";
import Link from "next/link";
import { UserFilmType } from "@/types/userFilmType";

export default function Films() {
  const [activeItem, setActiveItem] = useState("/films");
  const [user, setUser] = useState<UserType>(
    JSON.parse(localStorage.getItem("user")!),
  );
  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.collection}>
        <h2 className={styles.title}>Коллекция</h2>
        {user.films ? (
          <div className={styles.films}>
            {user.films.length > 0 ? (
              user.films.map((film) => (
                <>
                  <div key={film.film.name} className={styles.film}>
                    <img
                      src={film.film.posterUrl}
                      alt={"film"}
                      width={100}
                      height={160}
                    />
                    <span className={styles.filmName}>{film.film.name}</span>
                  </div>
                </>
              ))
            ) : (
              <>
                <div className={styles.add}>
                  Вы ещё не добавили фильмы в коллекцию
                </div>
                <Link href={"/films/add"} className={styles.buttonAdd}>
                  Добавить
                </Link>
              </>
            )}
          </div>
        ) : (
          <ContentLoader
            speed={2}
            width={620}
            height={500}
            viewBox="0 0 620 500"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <rect x="0" y="0" rx="0" ry="0" width="140" height="180" />
            <rect x="0" y="200" rx="0" ry="0" width="140" height="180" />
            <rect x="160" y="0" rx="0" ry="0" width="140" height="180" />
            <rect x="160" y="200" rx="0" ry="0" width="140" height="180" />
            <rect x="320" y="0" rx="0" ry="0" width="140" height="180" />
            <rect x="320" y="200" rx="0" ry="0" width="140" height="180" />
            <rect x="480" y="0" rx="0" ry="0" width="140" height="180" />
            <rect x="480" y="200" rx="0" ry="0" width="140" height="180" />
          </ContentLoader>
        )}
      </div>
    </div>
  );
}
