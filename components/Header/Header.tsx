import styles from "./Header.module.scss";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UserType } from "@/types/userType";
import { useRouter } from "next/navigation";
import { type } from "node:os";

type HeaderProps = {
  activeItem: string;
  setActiveItem: React.Dispatch<string>;
};
export default function Header({ activeItem, setActiveItem }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("user"))
      setUser(JSON.parse(localStorage.getItem("user")!));
    else {
      router.push("/auth/login");
    }
  }, []);

  function setRouting(activeItemName: string) {
    setActiveItem(activeItemName);
    router.push(activeItemName);
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div
          className={
            activeItem === "/films"
              ? styles.collection + " " + styles.activeCollection
              : styles.collection
          }
          onClick={() => setRouting("/films")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9.13274 9.13274C9.55752 8.70796 9.87611 8.0708 9.87611 7.43363C9.87611 6.90265 9.66372 6.37168 9.34513 5.84071C7.75221 6.47788 6.47788 7.75221 5.84071 9.34513C6.26549 9.66372 6.79646 9.87611 7.43363 9.87611C8.0708 9.87611 8.70796 9.55752 9.13274 9.13274Z"
              fill="#002DFF"
            />
            <path
              d="M9.13274 14.9735C8.70796 14.5487 8.0708 14.2301 7.32743 14.2301C6.79646 14.2301 6.26549 14.4425 5.73451 14.7611C6.37168 16.354 7.64602 17.5221 9.23894 18.2655C9.55752 17.8407 9.76991 17.3097 9.76991 16.6726C9.87611 16.0354 9.55752 15.3982 9.13274 14.9735Z"
              fill="#002DFF"
            />
            <path
              d="M14.9735 9.13274C15.3982 9.55752 16.0354 9.87611 16.7788 9.87611C17.3097 9.87611 17.8407 9.66372 18.3717 9.34513C17.7345 7.75221 16.4602 6.58407 14.8673 5.84071C14.5487 6.26549 14.3363 6.79646 14.3363 7.43363C14.2301 8.0708 14.4425 8.70796 14.9735 9.13274Z"
              fill="#002DFF"
            />
            <path
              d="M14.9735 14.9735C14.5487 15.3982 14.2301 16.0354 14.2301 16.7788C14.2301 17.3097 14.4425 17.8407 14.7611 18.3717C16.354 17.7345 17.5221 16.4602 18.2655 14.8673C17.8407 14.5487 17.3097 14.3363 16.6726 14.3363C16.0354 14.2301 15.3982 14.4425 14.9735 14.9735Z"
              fill="#002DFF"
            />
            <path
              d="M12 0C5.41593 0 0 5.41593 0 12C0 18.5841 5.41593 24 12 24C18.5841 24 24 18.5841 24 12C24 5.41593 18.6903 0 12 0ZM9.55752 18.7965C8.38938 19.9646 6.47788 19.9646 5.30973 18.7965C4.14159 17.6283 4.14159 15.7168 5.30973 14.5487C6.47788 13.3805 8.38938 13.3805 9.55752 14.5487C10.7257 15.7168 10.7257 17.6283 9.55752 18.7965ZM9.55752 9.55752C8.38938 10.7257 6.47788 10.7257 5.30973 9.55752C4.14159 8.38938 4.0354 6.47788 5.30973 5.30973C6.47788 4.14159 8.38938 4.14159 9.55752 5.30973C10.7257 6.47788 10.7257 8.38938 9.55752 9.55752ZM13.0619 13.0619C12.4248 13.6991 11.469 13.6991 10.9381 13.0619C10.3009 12.4248 10.3009 11.469 10.9381 10.9381C11.5752 10.3009 12.531 10.3009 13.0619 10.9381C13.6991 11.5752 13.6991 12.531 13.0619 13.0619ZM18.7965 18.7965C17.6283 19.9646 15.7168 19.9646 14.5487 18.7965C13.3805 17.6283 13.3805 15.7168 14.5487 14.5487C15.7168 13.3805 17.6283 13.3805 18.7965 14.5487C19.9646 15.7168 19.9646 17.6283 18.7965 18.7965ZM18.7965 9.55752C17.6283 10.7257 15.7168 10.7257 14.5487 9.55752C13.3805 8.38938 13.3805 6.47788 14.5487 5.30973C15.7168 4.14159 17.6283 4.14159 18.7965 5.30973C19.9646 6.47788 19.9646 8.38938 18.7965 9.55752Z"
              fill="#002DFF"
            />
          </svg>
          <span>Коллекция</span>
        </div>
        <div
          className={
            activeItem === "/films/add"
              ? styles.add + " " + styles.activeAdd
              : styles.add
          }
          onClick={() => setRouting("/films/add")}
        >
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
          <span>Добавить</span>
        </div>
      </div>
      <div className={styles.miniLogo} onClick={() => setRouting("/")}>
        <Image src={"/short-logo.svg"} alt={"logo"} width={100} height={22} />
      </div>
      <div className={styles.right}>
        <div
          className={
            activeItem === "/search"
              ? styles.search + " " + styles.activeSearch
              : styles.search
          }
          onClick={() => setRouting("/search")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M8.57621 16.99C10.4275 16.99 12.1561 16.3935 13.5613 15.3993L18.8476 20.6355C19.0929 20.8785 19.4164 21 19.7509 21C20.4758 21 21 20.4477 21 19.7407C21 19.4093 20.8885 19.0999 20.6431 18.8569L15.3903 13.6428C16.4944 12.2067 17.1524 10.4282 17.1524 8.495C17.1524 3.8222 13.2937 0 8.57621 0C3.84758 0 0 3.8222 0 8.495C0 13.1678 3.84758 16.99 8.57621 16.99ZM8.57621 15.1562C4.88476 15.1562 1.8513 12.1405 1.8513 8.495C1.8513 4.84955 4.88476 1.83377 8.57621 1.83377C12.2565 1.83377 15.3011 4.84955 15.3011 8.495C15.3011 12.1405 12.2565 15.1562 8.57621 15.1562Z"
              fill="#002DFF"
            />
          </svg>
          <span>Поиск</span>
        </div>
        <div className={styles.user} onClick={() => setRouting("/account")}>
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={40}
              height={40}
              className={activeItem === "/account" ? styles.userImage : ""}
            />
          ) : (
            <div
              className={
                activeItem === "/account"
                  ? styles.userBlockActive
                  : styles.userBlock
              }
            />
          )}
        </div>
      </div>
    </header>
  );
}
