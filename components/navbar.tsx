"use client";
import Link from "next/link";
import styles from './navbar.module.css';
import logo from "../app/logo.png";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo.src} alt="logo" />
      </div>

      <div className={styles.links}>
        <a href="">Home</a>
        <a href="">Lessons</a>
        <a href="">Progress</a>
        <a href="">About</a>
      </div>

      <div className={styles.Search}>
        <input type="text" placeholder="Search.." />
      </div>

      <div className={styles.Login}>
        <a href="">Login</a>
      </div>
    </nav>
  )
}
