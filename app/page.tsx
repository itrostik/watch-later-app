import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        className={styles.logo}
        src="/logo.svg"
        alt="Watch Later"
        width={180}
        height={37}
        priority
      />

    </main>
  )
}
