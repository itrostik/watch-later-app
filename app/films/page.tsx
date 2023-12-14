"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";

import styles from "./page.module.scss";

import ContentLoader from "react-content-loader";
import { UserType } from "@/types/userType";
import Link from "next/link";
import { UserFilmType } from "@/types/userFilmType";
import RadioButton from "@/components/RadioButton/RadioButton";
import { filterFilms } from "@/constants/constants";

export default function Films() {
  const [activeItem, setActiveItem] = useState("/films");
  const [defaultValue, setDefaultValue] = useState(filterFilms[0]);
  const [films, setFilms] = useState<UserFilmType[] | null>(null);
  const [user, setUser] = useState<UserType>(
    JSON.parse(localStorage.getItem("user")!),
  );

  useEffect(() => {
    console.log(defaultValue);
    console.log(user);
    const filteredFilms = user.films.filter((film) => {
      if (defaultValue === filterFilms[0]) {
        return !film.watched;
      } else {
        return film.watched;
      }
    });
    console.log(filteredFilms);
    setFilms(filteredFilms);
  }, [defaultValue]);

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.collection}>
        <h2 className={styles.title}>Коллекция</h2>
        <RadioButton
          defaultValue={defaultValue}
          setDefaultValue={setDefaultValue}
          values={filterFilms}
        />
        {films ? (
          <div className={styles.films}>
            {films.length > 0 ? (
              films.map((film) => (
                <Link
                  href={`/films/${film.film.id}`}
                  key={film.film.name}
                  className={styles.film}
                >
                  <img
                    src={film.film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span className={styles.filmName}>{film.film.name}</span>
                </Link>
              ))
            ) : (
              <>
                <div className={styles.add}>
                  {defaultValue === filterFilms[0]
                    ? "Здесь фильмов нет..."
                    : "Не найдено ни одного просмотренного фильма"}
                </div>
                {defaultValue === filterFilms[0] && (
                  <Link href={"/films/add"} className={styles.buttonAdd}>
                    Добавить
                  </Link>
                )}
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
