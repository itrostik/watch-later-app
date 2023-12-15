"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import styles from "./page.module.scss";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { UserType } from "@/types/userType";
import { useRouter } from "next/navigation";
import { GenreType } from "@/types/genreType";

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
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setIsLoading(true);
    setImageUrl(user?.avatarUrl);
    const getGenres = async () => {
      const response = await axios.get<GenreType[]>(
        "https://watch-later.tw1.ru/api/genre",
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
      "https://watch-later.tw1.ru/api/users",
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
        "https://watch-later.tw1.ru/api/file?folder=users",
        formData,
      );
      if (response.data) {
        console.log(response.data);
        setImageUrl(`http://watch-later.tw1.ru:4444${response.data[0].url}`);
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
      <Header activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className={styles.account}>
        <h2 className={styles.title}>Профиль</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles["input__wrapper"]}>
            {imageUrl ? (
              <div className={styles.imageBlock}>
                <img src={imageUrl} alt="" className={styles.image} />
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
            render={({ field }) => (
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
                <path d="M9.33333 0H11.6667V21H9.33333V0Z" fill="#002DFF" />
                <path
                  d="M21 9.33333V11.6667L0 11.6667L8.15943e-08 9.33333H21Z"
                  fill="#002DFF"
                />
              </svg>
              <span>Сохранить</span>
            </button>
          ) : (
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.loader}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.1155 8.2755L10.29 11.8405C10.7011 12.067 10.9577 12.4981 10.9608 12.9675C10.9639 13.4369 10.713 13.8713 10.3049 14.1032C9.89678 14.3351 9.39519 14.3284 8.9935 14.0855L2.819 10.521C2.20554 10.16 1.99789 9.37183 2.35381 8.75538C2.70974 8.13893 3.49611 7.92472 4.1155 8.2755ZM26.25 2.3445C26.8701 2.70254 27.0825 3.49542 26.7245 4.1155L23.1595 10.29C22.933 10.7011 22.5019 10.9577 22.0325 10.9608C21.5631 10.9639 21.1287 10.713 20.8968 10.3049C20.6649 9.89678 20.6716 9.39519 20.9145 8.9935L24.4795 2.819C24.8375 2.19924 25.63 1.98685 26.25 2.3445ZM26.0065 20.9145L32.181 24.4795C32.5921 24.706 32.8487 25.1371 32.8518 25.6065C32.8549 26.0759 32.604 26.5103 32.1959 26.7422C31.7878 26.9741 31.2862 26.9674 30.8845 26.7245L24.71 23.1595C24.2989 22.933 24.0423 22.5019 24.0392 22.0325C24.0361 21.5631 24.287 21.1287 24.6951 20.8968C25.1032 20.6649 25.6048 20.6716 26.0065 20.9145ZM13.611 24.236C14.2311 24.594 14.4435 25.3869 14.0855 26.007L10.5205 32.1815C10.291 32.5868 9.86169 32.8378 9.39592 32.8391C8.93016 32.8404 8.49949 32.5917 8.26774 32.1877C8.03598 31.7837 8.03876 31.2864 8.275 30.885L11.84 24.7105C12.0118 24.4126 12.295 24.1953 12.6272 24.1063C12.9593 24.0173 13.3133 24.0639 13.611 24.236ZM10.521 2.819L14.086 8.9935C14.3289 9.39519 14.3356 9.89678 14.1037 10.3049C13.8718 10.713 13.4374 10.9639 12.968 10.9608C12.4986 10.9577 12.0675 10.7011 11.841 10.29L8.2755 4.1155C7.92472 3.49611 8.13893 2.70974 8.75538 2.35381C9.37183 1.99789 10.16 2.20554 10.521 2.819ZM32.6555 8.75C32.8274 9.0477 32.874 9.40149 32.785 9.73353C32.696 10.0656 32.4787 10.3487 32.181 10.5205L26.0065 14.0855C25.6048 14.3284 25.1032 14.3351 24.6951 14.1032C24.287 13.8713 24.0361 13.4369 24.0392 12.9675C24.0423 12.4981 24.2989 12.067 24.71 11.8405L30.8845 8.2755C31.5046 7.91751 32.2975 8.12994 32.6555 8.75ZM23.1595 24.7105L26.7245 30.885C26.9674 31.2867 26.9741 31.7883 26.7422 32.1964C26.5103 32.6045 26.0759 32.8554 25.6065 32.8523C25.1371 32.8492 24.706 32.5926 24.4795 32.1815L20.9145 26.007C20.6716 25.6053 20.6649 25.1037 20.8968 24.6956C21.1287 24.2875 21.5631 24.0366 22.0325 24.0397C22.5019 24.0428 22.933 24.2994 23.1595 24.7105ZM10.7645 21.389C10.9364 21.6867 10.983 22.0405 10.894 22.3725C10.805 22.7046 10.5877 22.9877 10.29 23.1595L4.1155 26.7245C3.49726 27.0652 2.72009 26.8486 2.36707 26.2374C2.01406 25.6261 2.21494 24.8447 2.819 24.4795L8.9935 20.9145C9.61358 20.5565 10.4065 20.7689 10.7645 21.389ZM1 16.203H8.719C9.27129 16.203 9.719 16.6507 9.719 17.203V17.797C9.719 18.3493 9.27129 18.797 8.719 18.797H1C0.447715 18.797 0 18.3493 0 17.797V17.203C0 16.6507 0.447715 16.203 1 16.203ZM17.203 0H17.797C18.3493 0 18.797 0.447715 18.797 1V8.719C18.797 9.27129 18.3493 9.719 17.797 9.719H17.203C16.6507 9.719 16.203 9.27129 16.203 8.719V1C16.203 0.447715 16.6507 0 17.203 0ZM26.2815 16.203H34C34.5523 16.203 35 16.6507 35 17.203V17.797C35 18.3493 34.5523 18.797 34 18.797H26.2815C25.7292 18.797 25.2815 18.3493 25.2815 17.797V17.203C25.2815 16.6507 25.7292 16.203 26.2815 16.203ZM17.203 25.2815H17.797C18.3493 25.2815 18.797 25.7292 18.797 26.2815V34C18.797 34.5523 18.3493 35 17.797 35H17.203C16.6507 35 16.203 34.5523 16.203 34V26.2815C16.203 25.7292 16.6507 25.2815 17.203 25.2815Z"
                fill="#000"
              />
              <defs>
                <radialGradient
                  id="paint0_angular_728_4387"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(17.5 17.5) scale(17.5)"
                >
                  <stop offset="0.350486" />
                  <stop
                    offset="0.377922"
                    stopColor="#eeeeee"
                    stopOpacity="0.01"
                  />
                </radialGradient>
              </defs>
            </svg>
          )}
        </form>
      </div>
    </div>
  );
}
