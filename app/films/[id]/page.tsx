"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FilmType } from "@/types/filmType";
import axios from "axios";
import styles from "./page.module.scss";
import Image from "next/image";
import Header from "@/components/Header/Header";
import { UserType } from "@/types/userType";
import { statusFilm } from "@/constants/constants";
import _ from "lodash";

export default function Page() {
  const pathname = usePathname();
  const [defaultValue, setDefaultValue] = useState<string>(statusFilm[0]);
  const [film, setFilm] = useState<FilmType | null>(null);
  const [activeItem, setActiveItem] = useState<string>("/films/add");
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const router = useRouter();
  const [user, setUser] = useState<UserType>(
    JSON.parse(localStorage.getItem("user")!),
  );
  useEffect(() => {
    const getFilm = async () => {
      const id = pathname[pathname.length - 1];
      console.log(pathname);
      if (id) {
        const response = await axios.post(
          "http://watch-later.tw1.ru/api/film/getById",
          {
            id: +id,
          },
        );
        console.log(response.data);
        setFilm(response.data);
        const userFilm = user.films.find(
          (film) => film.film.id === response.data.id,
        );
        if (userFilm) setIsAdded(true);
        setDefaultValue(!userFilm?.watched ? statusFilm[0] : statusFilm[1]);
      }
    };
    getFilm();
  }, []);

  const debounceChangeStatus = _.debounce(toggleStatus, 100);

  //вот эта функция работает некорректно
  async function toggleStatus() {
    let newUserFilms = [];
    if (defaultValue === statusFilm[0]) {
      setDefaultValue(statusFilm[1]);
      newUserFilms = user.films.map((filmItem) => {
        if (filmItem.film.id === film?.id) {
          filmItem.watched = true;
        }
        return filmItem;
      });
    } else {
      setDefaultValue(statusFilm[0]);
      newUserFilms = user.films.map((filmItem) => {
        if (filmItem.film.id === film?.id) {
          filmItem.watched = false;
        }
        return filmItem;
      });
    }
    const updatedUser = await axios.patch(
      "http://watch-later.tw1.ru/api/users/film",
      {
        films: newUserFilms,
        email: user.email,
      },
    );
    localStorage.setItem("user", JSON.stringify(updatedUser.data));
  }

  async function addFilm() {
    const updatedUser = await axios.patch(
      "http://watch-later.tw1.ru/api/users",
      {
        film: film,
        email: user.email,
        watched: false,
        review: null,
      },
    );
    localStorage.setItem("user", JSON.stringify(updatedUser.data));
    router.push("/films");
  }

  return (
    <>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.container}>
        <div className={styles.film}>
          <div className={styles.image}>
            <Image src={film?.posterUrl!} alt={""} width={267} height={417} />
          </div>
          <div className={styles.block}>
            <div className={styles.name}>{film?.name}</div>
            <div className={styles.info}>
              <span className={styles.year}>{film?.year}</span>
              <span className={styles.review}>
                {film?.reviews?.length && film?.reviews?.length > 0
                  ? film.reviews.reduce((accum, number, index) => {
                      accum += number;
                      if (index === film?.reviews?.length! - 1) {
                        return accum / index + 1;
                      }
                      return accum;
                    }, 0)
                  : "Нет оценок"}
              </span>
            </div>
            {!isAdded ? (
              <div className={styles.add} onClick={() => addFilm()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path d="M9.33333 0H11.6667V21H9.33333V0Z" fill="#002DFF" />
                  <path
                    d="M21 9.33333V11.6667L0 11.6667L8.15943e-08 9.33333H21Z"
                    fill="#002DFF"
                  />
                </svg>
                <span>Буду смотреть</span>
              </div>
            ) : (
              <div className={styles.statusBlock}>
                <div
                  className={
                    defaultValue !== statusFilm[0]
                      ? styles.status
                      : styles.activeStatus
                  }
                  onClick={() => debounceChangeStatus()}
                >
                  {statusFilm[0]}
                </div>
                <div
                  className={
                    defaultValue !== statusFilm[1]
                      ? styles.status
                      : styles.activeStatus
                  }
                  onClick={() => debounceChangeStatus()}
                >
                  {statusFilm[1]}
                </div>
              </div>
            )}
            <div className={styles.description}>{film?.description}</div>
            <div className={styles.genres}>
              {film?.genres.map((genre, index) => {
                return (
                  <div className={styles.genre} key={index}>
                    {genre}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
