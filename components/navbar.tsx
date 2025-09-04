"use client";
import Link from "next/link";
import styles from './Navbar.module.css';
import logo from "../app/logo.png";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo.src} alt="logo" />
      </div>

      <div className={styles.links}>
        <a href="/">Home</a>
        <a href="/lessons">Lessons</a>
        <a href="">Progress</a>
        <a href="">About</a>
      </div>

      <div className={styles.Login}>
        <a href="">Login</a>
      </div>
    </nav>
  );
}
