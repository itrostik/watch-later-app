"use client";

import React, {useState} from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import Link from "next/link";
import axios, {Axios, AxiosError} from "axios";
import {useRouter} from "next/navigation";
import {Loader} from "@/components/Loader/Loader";

type Inputs = {
  email: string;
  password: string;
};
export default function Login() {
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: {errors},
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const password = data.password;
    const email = data.email;
    try {
      const user = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      localStorage.setItem("user", JSON.stringify(user.data));
      router.push("/");
      // @ts-ignore
    } catch (error: AxiosError) {
      console.error(error.response.data.message);
      setError("email", {
        type: "custom",
        message: "неверный логин или пароль",
      });
      setError("password", {
        type: "custom",
        message: "неверный логин или пароль",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function reset(nameField: "email" | "password") {
    resetField(nameField);
    if (nameField === "email") setIsEmail(false);
    else setIsPassword(false);
  }

  function setEmail(value: string) {
    if (value.length > 0) {
      setIsEmail(true);
    } else setIsEmail(false);
  }

  function setPassword(value: string) {
    if (value.length > 0) {
      setIsPassword(true);
    } else setIsPassword(false);
  }

  return (
    <div className={styles.container}>
      <Image
        src="/logo.svg"
        alt="watch later"
        width={98}
        height={42}
        draggable={false}
        priority
        className={styles.logo}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label}>
          <input
            type={"text"}
            className={!errors.email ? styles.input : styles.errorInput}
            placeholder={"Адрес электронной почты"}
            {...register("email", {
              required: {
                value: true,
                message: "Это поле обязательно для заполнения",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некорректный email",
              },
            })}
            onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />
          {isEmail && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              id="delete"
              className={styles.reset}
              onClick={() => reset("email")}
            >
              <path
                d="M17.586 46.414c.391.391.902.586 1.414.586s1.023-.195 1.414-.586L32 34.828l11.586 11.586c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L34.828 32l11.586-11.586a2 2 0 1 0-2.828-2.828L32 29.172 20.414 17.586a2 2 0 1 0-2.828 2.828L29.172 32 17.586 43.586a2 2 0 0 0 0 2.828z"></path>
              <path
                d="M32 64c8.547 0 16.583-3.329 22.626-9.373C60.671 48.583 64 40.547 64 32s-3.329-16.583-9.374-22.626C48.583 3.329 40.547 0 32 0S15.417 3.329 9.374 9.373C3.329 15.417 0 23.453 0 32s3.329 16.583 9.374 22.626C15.417 60.671 23.453 64 32 64zM12.202 12.202C17.49 6.913 24.521 4 32 4s14.51 2.913 19.798 8.202C57.087 17.49 60 24.521 60 32s-2.913 14.51-8.202 19.798C46.51 57.087 39.479 60 32 60s-14.51-2.913-19.798-8.202C6.913 46.51 4 39.479 4 32s2.913-14.51 8.202-19.798z"></path>
            </svg>
          )}
        </label>
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
        <label className={styles.label}>
          <input
            type={"password"}
            className={!errors.password ? styles.input : styles.errorInput}
            placeholder={"Пароль"}
            {...register("password", {
              required: {
                value: true,
                message: "Это поле обязательно для заполнения",
              },
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            })}
            onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
          />
          {isPassword && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              id="delete"
              className={styles.reset}
              onClick={() => reset("password")}
            >
              <path
                d="M17.586 46.414c.391.391.902.586 1.414.586s1.023-.195 1.414-.586L32 34.828l11.586 11.586c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L34.828 32l11.586-11.586a2 2 0 1 0-2.828-2.828L32 29.172 20.414 17.586a2 2 0 1 0-2.828 2.828L29.172 32 17.586 43.586a2 2 0 0 0 0 2.828z"></path>
              <path
                d="M32 64c8.547 0 16.583-3.329 22.626-9.373C60.671 48.583 64 40.547 64 32s-3.329-16.583-9.374-22.626C48.583 3.329 40.547 0 32 0S15.417 3.329 9.374 9.373C3.329 15.417 0 23.453 0 32s3.329 16.583 9.374 22.626C15.417 60.671 23.453 64 32 64zM12.202 12.202C17.49 6.913 24.521 4 32 4s14.51 2.913 19.798 8.202C57.087 17.49 60 24.521 60 32s-2.913 14.51-8.202 19.798C46.51 57.087 39.479 60 32 60s-14.51-2.913-19.798-8.202C6.913 46.51 4 39.479 4 32s2.913-14.51 8.202-19.798z"></path>
            </svg>
          )}
        </label>
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
        {!loading ? (
          <button type="submit" className={styles.button}>
            Войти
          </button>
        ) : (
          <Loader/>
        )}
      </form>
      <span className={styles.register}>
        Ещё не зарегистрированы?{" "}
        <Link href={"/auth/register"} className={styles.link}>
          Регистрация
        </Link>
      </span>
    </div>
  );
}
