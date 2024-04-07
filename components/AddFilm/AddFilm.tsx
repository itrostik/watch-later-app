import styles from "./AddFilm.module.scss";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { GenreType } from "@/types/genreType";
import Select from "react-select";
import { UserType } from "@/types/userType";
import { Loader } from "@/components/Loader/Loader";

type Inputs = {
  name: string;
  description: string;
  year: string;
  genres: {
    value: string;
    label: string;
  }[];
  posterUrl: string;
};

export default function AddFilm() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [posterUrl, setPosterUrl] = useState<string | null | undefined>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [user, setUser] = useState<UserType | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<Inputs>();

  useEffect(() => {
    setIsLoading(true);
    const getGenres = async () => {
      const response = await axios.get<GenreType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/genre`,
      );
      setGenres(response.data);
      setIsLoading(false);
    };
    getGenres();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSaving(true);
    console.log(52);
    const name = data.name;
    const description = data.description;
    const year = data.year;
    const genres: string[] = [];
    data.genres.forEach((genre) => {
      genres.push(genre.value);
    });
    if (!posterUrl) {
      setError("posterUrl", {
        type: "custom",
        message: "Постер должен быть загружен!",
      });
    }
    if (genres.length === 0) {
      setError("genres", {
        type: "custom",
        message: "Выберите хотя бы 1 жанр",
      });
    }
    if (genres.length === 0 || !posterUrl) {
      setIsSaving(false);
    } else {
      const addedFilm = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/film/add`,
        {
          name,
          description,
          genres,
          posterUrl,
          year,
          reviews: [],
        },
      );
      const updatedUser = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          film: addedFilm.data,
          email: user!.email,
          watched: false,
          review: null,
        },
      );
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      setIsSaving(false);
      router.push("/films");
    }
  };
  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoadingImage(true);
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", event.target.files[0]);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file?folder=films`,
        formData,
      );
      if (response.data) {
        setPosterUrl(
          `${process.env.NEXT_PUBLIC_API_URL}${response.data[0].url}`,
        );
      }
      clearErrors("posterUrl");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  function reset() {
    setPosterUrl(null);
  }

  return (
    <div>
      <div className={styles.account}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={styles.label}>
            <h3>Название</h3>
            <input
              type={"text"}
              className={!errors.name ? styles.input : styles.errorInput}
              placeholder={"Например, Зеленая миля"}
              {...register("name", {
                required: {
                  value: true,
                  message: "Это поле обязательно для заполнения",
                },
              })}
            />
          </label>
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
          <label className={styles.label}>
            <h3>Год</h3>
            <input
              type={"text"}
              className={!errors.year ? styles.input : styles.errorInput}
              placeholder={"Укажите год выхода фильма"}
              {...register("year", {
                required: {
                  value: true,
                  message: "Это поле обязательно для заполнения",
                },
              })}
            />
          </label>
          {errors.year && (
            <span className={styles.error}>{errors.year.message}</span>
          )}
          <label className={styles.label}>
            <h3>Описание</h3>
            <input
              type={"text"}
              className={!errors.description ? styles.input : styles.errorInput}
              placeholder={"Расскажите о фильме (более 30 символов)"}
              {...register("description", {
                required: {
                  value: true,
                  message: "Это поле обязательно для заполнения",
                },
                minLength: {
                  value: 30,
                  message: "Описание должно быть больше 30 символов",
                },
              })}
            />
          </label>
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
          <div>
            <h3>Жанр</h3>
            <Controller
              control={control}
              defaultValue={[]}
              name="genres"
              render={({ field }) => (
                <Select
                  defaultMenuIsOpen
                  menuIsOpen
                  className={styles.modal}
                  classNamePrefix={"react-select"}
                  styles={{
                    //@ts-ignore
                    valueContainer: (baseStyles, _state) => ({
                      ...baseStyles,
                      cursor: "pointer",
                      color: "#002DFF",
                      padding: "10px 0px",
                      display: "flex",
                      gap: 5,
                    }),
                    control: (_baseStyles, _state) => ({
                      borderBottom: "1px solid #000",
                      marginTop: 15,
                      width: 800,
                      display: "flex",
                    }),
                    multiValueLabel: (_baseStyles, _state) => ({}),
                    multiValue: (_baseStyles, _state) => ({
                      color: "#000",
                      borderRadius: 14,
                      border: "2px solid #000",
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 16,
                      gap: 5,
                    }),
                    multiValueRemove: (_baseStyles, _state) => ({
                      cursor: "pointer",
                      ":hover": {
                        color: "#002DFF",
                      },
                      marginTop: 3,
                    }),
                    dropdownIndicator: (_baseStyles, _state) => ({
                      display: "none",
                    }),
                    indicatorSeparator: (_baseStyles, _state) => ({
                      display: "none",
                    }),
                    //@ts-ignore
                    clearIndicator: (baseStyles, _state) => ({
                      ...baseStyles,
                      cursor: "pointer",
                      ":hover": {
                        color: "#002DFF",
                      },
                    }),
                    menuList: (_baseStyles, _state) => ({
                      cursor: "pointer",
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }),
                    menu: (_baseStyles, _state) => ({
                      padding: "10px 0px",
                    }),
                    option: (_baseStyles, _state) => ({
                      borderRadius: 14,
                      border: "2px solid #000",
                      cursor: "pointer",
                      padding: "5px 10px",
                      ":hover": {
                        background: "#002DFF",
                        color: "#ffffff",
                        border: "2px solid #002DFF",
                      },
                    }),
                  }}
                  options={genres.map((genre: GenreType) => ({
                    value: genre.name,
                    label: genre.name,
                  }))}
                  defaultValue={genres.map((genre) => ({
                    value: genre,
                    label: genre,
                  }))}
                  //@ts-ignore
                  value={field.value.name}
                  //@ts-ignore
                  onChange={(genre: GenreType) => {
                    field.onChange(genre);
                  }}
                  noOptionsMessage={() =>
                    isLoading ? "Загрузка жанров..." : "Жанры закончились..."
                  }
                  isMulti={true}
                  placeholder={"Выберите жанр фильма из списка"}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      neutral50: "#b0b0b0", // Placeholder color
                    },
                  })}
                />
              )}
            />
            {errors.genres && (
              <span className={styles.error}>{errors.genres.message}</span>
            )}
          </div>
          <div className={styles["input__wrapper"]}>
            <h3>Постер</h3>
            {posterUrl ? (
              <div className={styles.imageBlock}>
                <img src={posterUrl} alt="" className={styles.image} />
                <div className={styles.reset} onClick={() => reset()}>
                  <img src="/reset.svg" alt="" />
                </div>
              </div>
            ) : (
              <div>
                <input
                  name="file"
                  type="file"
                  id="input__file"
                  className={[styles["input"], styles["input__file"]].join(" ")}
                  onChange={handleUpload}
                  accept={".jpg, .jpeg, .png, .svg, .webp"}
                  disabled={isLoadingImage}
                />
                <label
                  htmlFor="input__file"
                  className={styles["input__file-button"]}
                >
                  <span className={styles["input__file-icon-wrapper"]}>
                    <img
                      className={styles["input__file-icon"]}
                      src="/download.svg"
                      alt="Выбрать файл"
                      width="25"
                    />
                  </span>
                  <span className={styles["input__file-button-text"]}>
                    {!isLoadingImage ? "Загрузить фото" : "Загрузка..."}
                  </span>
                </label>
                {errors.posterUrl && (
                  <span className={styles.error}>
                    {errors.posterUrl.message}
                  </span>
                )}
              </div>
            )}
          </div>
          {!isSaving ? (
            <button type="submit" className={styles.button}>
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
              <span>Сохранить</span>
            </button>
          ) : (
            <Loader />
          )}
        </form>
      </div>
    </div>
  );
}
