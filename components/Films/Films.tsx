import styles from "./Films.module.scss";
import React, { useRef, useState } from "react";
import _ from "lodash";
import axios from "axios";
import { FilmType } from "@/types/filmType";
import Image from "next/image";
import { values } from "@/constants/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Films({
  setDefaultValue,
}: {
  setDefaultValue: React.Dispatch<string>;
}) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/film/get`,
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
    setIsEmpty(true);
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
    <>
      <h3 className={styles.subtitle}>Название</h3>
      <label className={styles.search}>
        <input
          type="text"
          placeholder={"Например, Зеленая миля"}
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
                <div className={styles.review}>
                  {getReview(film) !== undefined
                    ? getReview(film)
                    : "Нет оценок"}
                </div>
              </div>
            </Link>
          );
        })}
        {!isEmpty && !isLoading && films.length === 0 ? (
          <div className={styles.filmAdded}>
            <div className={styles.blockEmpty} />
            <div className={styles.filmInfo}>
              <div className={styles.name}>Фильм не найден</div>
              <div
                className={styles.added}
                onClick={() => setDefaultValue(values[1])}
              >
                Добавьте его вручную
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
