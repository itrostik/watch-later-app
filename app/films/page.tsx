"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header/Header";

import styles from "./page.module.scss";
import axios from "axios";
import { FilmType } from "@/types/filmType";

import ContentLoader from "react-content-loader";

export default function Films() {
  const [activeItem, setActiveItem] = useState("/films");
  const [films, setFilms] = useState<FilmType[] | null>(null);
  useEffect(() => {
    const getFilms = async () => {
      const films = await axios.get<FilmType[]>(
        "http://localhost:4444/api/film",
      );
      console.log(films);
      setFilms(films.data);
    };
    getFilms();
  }, []);

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.collection}>
        <h2 className={styles.title}>Коллекция</h2>
        {films ? (
          <div className={styles.films}>
            {films.map((film) => (
              <>
                <div key={film.id} className={styles.film}>
                  <img src={film.posterUrl} alt={"film"} />
                  <span>{film.name}</span>
                </div>
                <div key={film.id} className={styles.film}>
                  <img
                    src={film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span>{film.name}</span>
                </div>
                <div key={film.id} className={styles.film}>
                  <img
                    src={film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span>{film.name}</span>
                </div>
                <div key={film.id} className={styles.film}>
                  <img
                    src={film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span>{film.name}</span>
                </div>
                <div key={film.id} className={styles.film}>
                  <img
                    src={film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span>{film.name}</span>
                </div>
                <div key={film.id} className={styles.film}>
                  <img
                    src={film.posterUrl}
                    alt={"film"}
                    width={100}
                    height={160}
                  />
                  <span>{film.name}</span>
                </div>
              </>
            ))}
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
