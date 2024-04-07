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
import { Loader } from "@/components/Loader/Loader";

export default function Page() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValue, setDefaultValue] = useState<string>(statusFilm[0]);
  const [film, setFilm] = useState<FilmType | null>(null);
  const [activeItem, setActiveItem] = useState<string>("");
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [activeReview, setActiveReview] = useState<number>(0);
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );
  useEffect(() => {
    setIsLoading(true);
    const getFilm = async () => {
      const arrayId = pathname.split("/");
      const id = arrayId[arrayId.length - 1];
      if (id) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/film/getById`,
          {
            id: +id,
          },
        );
        setFilm(response.data);
        const userFilm = user!.films.find(
          (film) => film.film.id === response.data.id,
        );
        if (userFilm) {
          setIsAdded(true);
          setActiveReview(userFilm.review !== null ? userFilm.review : 0);
        }
        setDefaultValue(!userFilm?.watched ? statusFilm[0] : statusFilm[1]);
      }
      setIsLoading(false);
    };
    getFilm();
  }, []);

  const debounceChangeStatus = _.debounce(toggleStatus, 100);

  async function toggleStatus() {
    let newUserFilms = [];
    if (defaultValue === statusFilm[0]) {
      setDefaultValue(statusFilm[1]);
      newUserFilms = user!.films.map((filmItem) => {
        if (filmItem.film.id === film?.id) {
          filmItem.watched = true;
        }
        return filmItem;
      });
    } else {
      setDefaultValue(statusFilm[0]);
      newUserFilms = user!.films.map((filmItem) => {
        if (filmItem.film.id === film?.id) {
          filmItem.watched = false;
        }
        return filmItem;
      });
    }
    const updatedUser = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/film`,
      {
        films: newUserFilms,
        email: user!.email,
      },
    );
    localStorage.setItem("user", JSON.stringify(updatedUser.data));
  }

  async function setReview(review: number) {
    if (activeReview === 0) {
      setActiveReview(review);
      const reviewsFilm = film?.reviews;
      reviewsFilm?.push(review);
      const updatedFilm = { ...film, reviews: reviewsFilm };
      const responseFilm = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/film/update`,
        {
          name: updatedFilm.name,
          description: updatedFilm.description,
          posterUrl: updatedFilm.posterUrl,
          year: updatedFilm.year,
          genres: updatedFilm.genres,
          reviews: updatedFilm.reviews,
        },
      );

      const newUserFilms = user!.films.map((filmItem) => {
        if (filmItem.film.id === film?.id) {
          return {
            film: {
              ...responseFilm.data,
            },
            review: review,
          };
        }
        return filmItem;
      });

      const updatedUser = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/film`,
        {
          films: newUserFilms,
          email: user!.email,
        },
      );
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
    }
  }

  async function addFilm() {
    const updatedUser = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      {
        film: film,
        email: user!.email,
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
      {!isLoading ? (
        <div className={styles.container}>
          <div className={styles.film}>
            {film?.posterUrl ? (
              <Image
                src={film.posterUrl}
                alt={"poster"}
                width={500}
                height={500}
                className={styles.image}
              />
            ) : (
              <div className={styles.image}></div>
            )}
            <div className={styles.block}>
              <div className={styles.name}>{film?.name}</div>
              <div className={styles.info}>
                <span className={styles.year}>{film?.year}</span>
                <span className={styles.review}>
                  {film?.reviews && film?.reviews?.length > 0
                    ? film.reviews
                        .reduce((accum, number, index) => {
                          accum += number;
                          if (index === film?.reviews?.length! - 1) {
                            return accum / (index + 1);
                          }
                          return accum;
                        }, 0)
                        .toFixed(1)
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
          {isAdded && activeReview >= 0 && (
            <div className={styles.reviewFilm}>
              <h4 className={styles.reviewName}>
                {activeReview === 0 ? "Оцените фильм" : "Спасибо за оценку!"}
              </h4>
              {activeReview === 0 ? (
                <div className={styles.stars}>
                  {[...new Array(10)].map((_star, index) => {
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        id="star"
                        onClick={() => setReview(index + 1)}
                        className={styles.star}
                      >
                        <g fill="#dadada" transform="translate(2 2.5)">
                          <path d="M10.9788315,0.622701964 L13.2088343,5.0937337 C13.3696541,5.41898806 13.6833886,5.64532516 14.0473153,5.698638 L19.0425214,6.42627649 C19.3361902,6.46746623 19.6010526,6.62197034 19.7785029,6.8556019 C19.9559533,7.08923346 20.0313617,7.38273074 19.9880426,7.671152 C19.9534763,7.91020966 19.8407724,8.13174403 19.6669222,8.30235648 L16.0453978,11.809048 C15.7801525,12.0569606 15.6594885,12.4193205 15.7242774,12.7733882 L16.6162785,17.7090566 C16.7147938,18.2995122 16.3208523,18.8609116 15.7242774,18.9802323 C15.4801297,19.0185775 15.229908,18.9786152 15.0106765,18.8662648 L10.550671,16.5430816 C10.2203789,16.3761286 9.82840179,16.3761286 9.4981097,16.5430816 L5.03810421,18.8662648 C4.48873261,19.1584416 3.80239017,18.9584302 3.50386232,18.4191616 C3.39074686,18.2033073 3.35014981,17.9577724 3.38790218,17.7178233 L4.27990327,12.7821549 C4.34469215,12.4280873 4.22402814,12.0657274 3.95878288,11.8178148 L0.337258419,8.31112321 C0.124797095,8.10519293 0.00518811324,7.82415733 0.00518811324,7.53088433 C0.00518811324,7.23761134 0.124797095,6.95657574 0.337258419,6.75064546 C0.508415451,6.57648914 0.7350439,6.46512211 0.97949921,6.43504322 L5.97470536,5.70740472 C6.33863203,5.65409189 6.65236657,5.42775479 6.81318639,5.10250043 L8.96290904,0.622701964 C9.15090319,0.24057682 9.54799821,0.000936542622 9.97979029,0.00903094105 L10.1135905,0.00903094105 C10.489336,0.0558783885 10.8151899,0.286989836 10.9788315,0.622701964 Z"></path>
                          <path d="M10.0065503,16.4115807 C9.81118897,16.4103023 9.62747134,16.4746291 9.45365767,16.5622959 L5.00773517,18.8797981 C4.47450301,19.1484697 3.7974056,18.9325826 3.50386232,18.4191616 C3.39024338,18.2066302 3.34956803,17.9636968 3.38790218,17.72659 L4.27990327,12.7996884 C4.33980187,12.4433294 4.22008857,12.0805563 3.95878288,11.8265815 L0.328338408,8.31988994 C-0.109446136,7.88870587 -0.109446136,7.19059625 0.328338408,6.75941219 C0.499576039,6.59022427 0.721593581,6.47958644 0.961659188,6.44380995 L5.97470536,5.70740472 C6.36101524,5.65133519 6.63712459,5.43773896 6.81318639,5.10250043 L8.99095422,0.571355753 C9.15691252,0.202753827 9.71488681,-0.0519721233 10.0154703,0.00903094105 C10.0065503,0.307099724 10.0065503,16.2099459 10.0065503,16.4115807 Z"></path>
                        </g>
                      </svg>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.stars}>
                  {[...new Array(10)].map((_star, index) => {
                    if (index < activeReview) {
                      return (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          id="star"
                          onClick={() => setReview(index + 1)}
                          className={styles.star}
                        >
                          <g fill="#ffcc00" transform="translate(2 2.5)">
                            <path d="M10.9788315,0.622701964 L13.2088343,5.0937337 C13.3696541,5.41898806 13.6833886,5.64532516 14.0473153,5.698638 L19.0425214,6.42627649 C19.3361902,6.46746623 19.6010526,6.62197034 19.7785029,6.8556019 C19.9559533,7.08923346 20.0313617,7.38273074 19.9880426,7.671152 C19.9534763,7.91020966 19.8407724,8.13174403 19.6669222,8.30235648 L16.0453978,11.809048 C15.7801525,12.0569606 15.6594885,12.4193205 15.7242774,12.7733882 L16.6162785,17.7090566 C16.7147938,18.2995122 16.3208523,18.8609116 15.7242774,18.9802323 C15.4801297,19.0185775 15.229908,18.9786152 15.0106765,18.8662648 L10.550671,16.5430816 C10.2203789,16.3761286 9.82840179,16.3761286 9.4981097,16.5430816 L5.03810421,18.8662648 C4.48873261,19.1584416 3.80239017,18.9584302 3.50386232,18.4191616 C3.39074686,18.2033073 3.35014981,17.9577724 3.38790218,17.7178233 L4.27990327,12.7821549 C4.34469215,12.4280873 4.22402814,12.0657274 3.95878288,11.8178148 L0.337258419,8.31112321 C0.124797095,8.10519293 0.00518811324,7.82415733 0.00518811324,7.53088433 C0.00518811324,7.23761134 0.124797095,6.95657574 0.337258419,6.75064546 C0.508415451,6.57648914 0.7350439,6.46512211 0.97949921,6.43504322 L5.97470536,5.70740472 C6.33863203,5.65409189 6.65236657,5.42775479 6.81318639,5.10250043 L8.96290904,0.622701964 C9.15090319,0.24057682 9.54799821,0.000936542622 9.97979029,0.00903094105 L10.1135905,0.00903094105 C10.489336,0.0558783885 10.8151899,0.286989836 10.9788315,0.622701964 Z"></path>
                            <path d="M10.0065503,16.4115807 C9.81118897,16.4103023 9.62747134,16.4746291 9.45365767,16.5622959 L5.00773517,18.8797981 C4.47450301,19.1484697 3.7974056,18.9325826 3.50386232,18.4191616 C3.39024338,18.2066302 3.34956803,17.9636968 3.38790218,17.72659 L4.27990327,12.7996884 C4.33980187,12.4433294 4.22008857,12.0805563 3.95878288,11.8265815 L0.328338408,8.31988994 C-0.109446136,7.88870587 -0.109446136,7.19059625 0.328338408,6.75941219 C0.499576039,6.59022427 0.721593581,6.47958644 0.961659188,6.44380995 L5.97470536,5.70740472 C6.36101524,5.65133519 6.63712459,5.43773896 6.81318639,5.10250043 L8.99095422,0.571355753 C9.15691252,0.202753827 9.71488681,-0.0519721233 10.0154703,0.00903094105 C10.0065503,0.307099724 10.0065503,16.2099459 10.0065503,16.4115807 Z"></path>
                          </g>
                        </svg>
                      );
                    }
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        id="star"
                        onClick={() => setReview(index + 1)}
                        className={styles.star}
                      >
                        <g fill="#dadada" transform="translate(2 2.5)">
                          <path d="M10.9788315,0.622701964 L13.2088343,5.0937337 C13.3696541,5.41898806 13.6833886,5.64532516 14.0473153,5.698638 L19.0425214,6.42627649 C19.3361902,6.46746623 19.6010526,6.62197034 19.7785029,6.8556019 C19.9559533,7.08923346 20.0313617,7.38273074 19.9880426,7.671152 C19.9534763,7.91020966 19.8407724,8.13174403 19.6669222,8.30235648 L16.0453978,11.809048 C15.7801525,12.0569606 15.6594885,12.4193205 15.7242774,12.7733882 L16.6162785,17.7090566 C16.7147938,18.2995122 16.3208523,18.8609116 15.7242774,18.9802323 C15.4801297,19.0185775 15.229908,18.9786152 15.0106765,18.8662648 L10.550671,16.5430816 C10.2203789,16.3761286 9.82840179,16.3761286 9.4981097,16.5430816 L5.03810421,18.8662648 C4.48873261,19.1584416 3.80239017,18.9584302 3.50386232,18.4191616 C3.39074686,18.2033073 3.35014981,17.9577724 3.38790218,17.7178233 L4.27990327,12.7821549 C4.34469215,12.4280873 4.22402814,12.0657274 3.95878288,11.8178148 L0.337258419,8.31112321 C0.124797095,8.10519293 0.00518811324,7.82415733 0.00518811324,7.53088433 C0.00518811324,7.23761134 0.124797095,6.95657574 0.337258419,6.75064546 C0.508415451,6.57648914 0.7350439,6.46512211 0.97949921,6.43504322 L5.97470536,5.70740472 C6.33863203,5.65409189 6.65236657,5.42775479 6.81318639,5.10250043 L8.96290904,0.622701964 C9.15090319,0.24057682 9.54799821,0.000936542622 9.97979029,0.00903094105 L10.1135905,0.00903094105 C10.489336,0.0558783885 10.8151899,0.286989836 10.9788315,0.622701964 Z"></path>
                          <path d="M10.0065503,16.4115807 C9.81118897,16.4103023 9.62747134,16.4746291 9.45365767,16.5622959 L5.00773517,18.8797981 C4.47450301,19.1484697 3.7974056,18.9325826 3.50386232,18.4191616 C3.39024338,18.2066302 3.34956803,17.9636968 3.38790218,17.72659 L4.27990327,12.7996884 C4.33980187,12.4433294 4.22008857,12.0805563 3.95878288,11.8265815 L0.328338408,8.31988994 C-0.109446136,7.88870587 -0.109446136,7.19059625 0.328338408,6.75941219 C0.499576039,6.59022427 0.721593581,6.47958644 0.961659188,6.44380995 L5.97470536,5.70740472 C6.36101524,5.65133519 6.63712459,5.43773896 6.81318639,5.10250043 L8.99095422,0.571355753 C9.15691252,0.202753827 9.71488681,-0.0519721233 10.0154703,0.00903094105 C10.0065503,0.307099724 10.0065503,16.2099459 10.0065503,16.4115807 Z"></path>
                        </g>
                      </svg>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.container}>
          <Loader />
        </div>
      )}
    </>
  );
}
