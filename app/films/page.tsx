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
import { FilmType } from "@/types/filmType";

export default function Films() {
  const [activeItem, setActiveItem] = useState("/films");
  const [defaultValue, setDefaultValue] = useState(filterFilms[0]);
  const [films, setFilms] = useState<UserFilmType[] | null>(null);
  const [view, setView] = useState<"Thumbnails" | "List">("Thumbnails");
  const [user, setUser] = useState<UserType | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  useEffect(() => {
    const filteredFilms = user!.films.filter((film) => {
      if (defaultValue === filterFilms[0]) {
        return !film.watched;
      } else {
        return film.watched;
      }
    });
    setFilms(filteredFilms);
  }, [defaultValue]);

  function getReview(film: FilmType) {
    if (film.reviews && film.reviews.length > 0) {
      return film.reviews
        .reduce((accum, number, index) => {
          accum += number;
          if (index === film?.reviews?.length! - 1) {
            return accum / (index + 1);
          }
          return accum;
        }, 0)
        .toFixed(1);
    }
    return undefined;
  }

  function switchView() {
    if (view === "Thumbnails") setView("List");
    else setView("Thumbnails");
  }

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.collection}>
        <h2 className={styles.title}>Коллекция</h2>
        <div className={styles.buttons}>
          <RadioButton
            defaultValue={defaultValue}
            setDefaultValue={setDefaultValue}
            values={filterFilms}
          />
          <div className={styles.switch} onClick={switchView}>
            {view === "Thumbnails" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
              >
                <path d="M0 0H3V3H0V0Z" fill="#002DFF" />
                <path d="M5 0H18V3H5V0Z" fill="#002DFF" />
                <path d="M5 6H18V9H5V6Z" fill="#002DFF" />
                <path d="M5 12H18V15H5V12Z" fill="#002DFF" />
                <path d="M0 6H3V9H0V6Z" fill="#002DFF" />
                <path d="M0 12H3V15H0V12Z" fill="#002DFF" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="15"
                viewBox="0 0 19 15"
                fill="none"
              >
                <path d="M0 0H5V6.5625H0V0Z" fill="#002DFF" />
                <path d="M0 8.4375H5V15H0V8.4375Z" fill="#002DFF" />
                <path d="M7 0H12V6.5625H7V0Z" fill="#002DFF" />
                <path d="M7 8.4375H12V15H7V8.4375Z" fill="#002DFF" />
                <path d="M14 0H19V6.5625H14V0Z" fill="#002DFF" />
                <path d="M14 8.4375H19V15H14V8.4375Z" fill="#002DFF" />
              </svg>
            )}
          </div>
        </div>
        {films ? (
          films.length > 0 ? (
            view === "Thumbnails" ? (
              <div className={styles.films}>
                {films.map((film) => (
                  <Link
                    href={`/films/${film.film.id}`}
                    key={film.film.name}
                    className={styles.film}
                  >
                    <span className={styles.review}>
                      {getReview(film.film) !== undefined
                        ? getReview(film.film)
                        : "Нет оценок"}
                    </span>
                    <img
                      src={film.film.posterUrl}
                      alt={"film"}
                      width={100}
                      height={160}
                    />
                    <span className={styles.filmName}>{film.film.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.filmsList}>
                {films.map((film) => (
                  <Link
                    href={`/films/${film.film.id}`}
                    key={film.film.name}
                    className={styles.filmList}
                  >
                    <span className={styles.filmName}>{film.film.name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="12"
                      viewBox="0 0 7 12"
                      fill="none"
                    >
                      <path
                        d="M0.970131 12C1.23775 12 1.46356 11.9079 1.64755 11.7238L6.65711 6.76151C6.89128 6.53556 7 6.29289 7 6C7 5.70711 6.89128 5.45607 6.66547 5.23849L1.64755 0.276151C1.46356 0.0920502 1.23775 0 0.970131 0C0.434886 0 0 0.426778 0 0.962343C0 1.23013 0.108722 1.4728 0.301075 1.67364L4.70012 6.00837L0.301075 10.3347C0.108722 10.5272 0 10.7699 0 11.0377C0 11.5732 0.434886 12 0.970131 12Z"
                        fill="#3C3C43"
                        fillOpacity="0.3"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            )
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
          )
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
