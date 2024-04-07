"use client";

import React, {useEffect, useState} from "react";
import Header from "@/components/Header/Header";
import styles from "./page.module.scss";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import {UserType} from "@/types/userType";
import {useRouter} from "next/navigation";
import {GenreType} from "@/types/genreType";
import {Loader} from "@/components/Loader/Loader";

type Inputs = {
  name: string;
  description: string;
  genres: {
    value: string;
    label: string;
  }[];
};
export default function Account() {
  const [activeItem, setActiveItem] = useState<string>("/account");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm<Inputs>();

  useEffect(() => {
    setIsLoading(true);
    setImageUrl(user?.avatarUrl);
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
    const name = data.name;
    const description = data.description;
    const genres: string[] = [];
    data.genres.forEach((genre) => {
      genres.push(genre.value);
    });
    const updatedUser = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      {
        email: JSON.parse(localStorage.getItem("user")!).email,
        name,
        description,
        genres,
        avatarUrl: imageUrl ? imageUrl : null,
      },
    );
    localStorage.setItem("user", JSON.stringify(updatedUser.data));
    setIsSaving(false);
    router.push("/account");
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoadingImage(true);
      const formData = new FormData();
      //@ts-ignore
      formData.append("image", event.target.files[0]);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file?folder=users`,
        formData,
      );
      if (response.data) {
        setImageUrl(`${process.env.NEXT_PUBLIC_API_URL}${response.data[0].url}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  function reset() {
    setImageUrl(null);
  }

  return (
    <div>
      <Header activeItem={activeItem} setActiveItem={setActiveItem}/>
      <div className={styles.account}>
        <h2 className={styles.title}>Профиль</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles["input__wrapper"]}>
            {imageUrl ? (
              <div className={styles.imageBlock}>
                <img src={imageUrl} alt="" className={styles.image}/>
                <div className={styles.reset} onClick={() => reset()}>
                  <img src="/reset.svg" alt=""/>
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
                  accept={".jpg, .jpeg, .png, .svg"}
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
              </div>
            )}
          </div>
          <label className={styles.label}>
            <input
              type={"text"}
              defaultValue={user?.name ? user.name : ""}
              className={!errors.name ? styles.input : styles.errorInput}
              placeholder={"Имя"}
              {...register("name")}
            />
          </label>
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
          <label className={styles.label}>
            <input
              type={"text"}
              defaultValue={user?.description ? user.description : ""}
              className={!errors.description ? styles.input : styles.errorInput}
              placeholder={"О себе"}
              {...register("description")}
            />
          </label>
          {errors.description && (
            <span className={styles.error}>{errors.description.message}</span>
          )}
          <Controller
            control={control}
            defaultValue={
              user?.genres.map((genre) => ({
                value: genre,
                label: genre,
              })) || []
            }
            name="genres"
            render={({field}) => (
              <Select
                defaultMenuIsOpen
                menuIsOpen
                className={styles.modal}
                classNamePrefix={"react-select"}
                styles={{
                  // @ts-ignore
                  valueContainer: (baseStyles, state) => ({
                    ...baseStyles,
                    cursor: "pointer",
                    color: "#002DFF",
                    padding: "10px 0px",
                    display: "flex",
                    gap: 5,
                  }),
                  control: (baseStyles, state) => ({
                    borderBottom: "1px solid #000",
                    marginTop: 15,
                    width: 800,
                    display: "flex",
                  }),
                  multiValueLabel: (baseStyles, state) => ({}),
                  multiValue: (baseStyles, state) => ({
                    color: "#000",
                    borderRadius: 14,
                    border: "2px solid #000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 16,
                    gap: 5,
                  }),
                  multiValueRemove: (baseStyles, state) => ({
                    cursor: "pointer",
                    ":hover": {
                      color: "#002DFF",
                    },
                    marginTop: 3,
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    display: "none",
                  }),
                  indicatorSeparator: (baseStyles, state) => ({
                    display: "none",
                  }),
                  // @ts-ignore
                  clearIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    cursor: "pointer",
                    ":hover": {
                      color: "#002DFF",
                    },
                  }),
                  menuList: (baseStyles, state) => ({
                    cursor: "pointer",
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }),
                  menu: (baseStyles, state) => ({
                    padding: "10px 0px",
                  }),
                  option: (baseStyles, state) => ({
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
                defaultValue={user?.genres.map((genre) => ({
                  value: genre,
                  label: genre,
                }))}
                // @ts-ignore
                value={field.value.name}
                // @ts-ignore
                onChange={(genre: GenreType) => {
                  field.onChange(genre);
                }}
                noOptionsMessage={() =>
                  isLoading ? "Загрузка жанров..." : "Жанры закончились..."
                }
                isMulti={true}
                placeholder={"Любимые жанры"}
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

          {!isSaving ? (
            <button type="submit" className={styles.button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
              >
                <path d="M9.33333 0H11.6667V21H9.33333V0Z" fill="#002DFF"/>
                <path
                  d="M21 9.33333V11.6667L0 11.6667L8.15943e-08 9.33333H21Z"
                  fill="#002DFF"
                />
              </svg>
              <span>Сохранить</span>
            </button>
          ) : (
            <Loader/>
          )}
        </form>
      </div>
    </div>
  );
}
