"use client";

import Header from "@/components/Header/Header";
import React, { useRef, useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";
import { FilmType } from "@/types/filmType";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Search() {
  const [activeItem, setActiveItem] = useState("/search");
  const debounceSearch = _.debounce(search, 50);
  const [films, setFilms] = useState<FilmType[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  async function search(event: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const name = event.target.value;
    if (name) setIsEmpty(false);
    else setIsEmpty(true);
    const responseFilms = await axios.post<FilmType[]>(
      `https://watch-later.tw1.ru/api/film/get`,
      {
        name: name,
      },
    );
    setIsLoading(false);
    setFilms(responseFilms.data);
  }

  function reset() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFilms([]);
  }

  function getReview(film: FilmType) {
    console.log(film);
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
  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.searchBlock}>
        <h3 className={styles.subtitle}>Поиск</h3>
        <label className={styles.search}>
          <input
            type="text"
            placeholder={"Введите название фильма, например: Зеленая миля"}
            onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
              debounceSearch(event)
            }
            ref={inputRef}
          />
          {!isEmpty && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              id="delete"
              className={styles.reset}
              onClick={() => reset()}
            >
              <path d="M17.586 46.414c.391.391.902.586 1.414.586s1.023-.195 1.414-.586L32 34.828l11.586 11.586c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L34.828 32l11.586-11.586a2 2 0 1 0-2.828-2.828L32 29.172 20.414 17.586a2 2 0 1 0-2.828 2.828L29.172 32 17.586 43.586a2 2 0 0 0 0 2.828z"></path>
              <path d="M32 64c8.547 0 16.583-3.329 22.626-9.373C60.671 48.583 64 40.547 64 32s-3.329-16.583-9.374-22.626C48.583 3.329 40.547 0 32 0S15.417 3.329 9.374 9.373C3.329 15.417 0 23.453 0 32s3.329 16.583 9.374 22.626C15.417 60.671 23.453 64 32 64zM12.202 12.202C17.49 6.913 24.521 4 32 4s14.51 2.913 19.798 8.202C57.087 17.49 60 24.521 60 32s-2.913 14.51-8.202 19.798C46.51 57.087 39.479 60 32 60s-14.51-2.913-19.798-8.202C6.913 46.51 4 39.479 4 32s2.913-14.51 8.202-19.798z"></path>
            </svg>
          )}
        </label>
        <div className={styles.films}>
          {films.map((film) => {
            return (
              <Link href={`/films/${film.id}`} className={styles.film}>
                <Image
                  src={film.posterUrl}
                  alt={"film"}
                  width={60}
                  height={90}
                  className={styles.image}
                />
                <div className={styles.filmInfo}>
                  <div className={styles.name}>{film.name}</div>
                  <div className={styles.year}>{film.year}</div>
                  <div className={styles.review}>{getReview(film)}</div>
                </div>
              </Link>
            );
          })}
          {!isEmpty && !isLoading && films.length === 0 ? (
            <div className={styles.filmAdded}>
              <div className={styles.blockEmpty} />
              <div className={styles.filmInfo}>
                <div className={styles.name}>Фильм не найден</div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
