"use client";
import styles from './Navbar.module.css';
import logo from "../logo.png";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/web/login";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo.src} alt="SmartCode" />
      </div>
      <div className={styles.links}>
        <a href="/">Home</a>
        <a href="/web/lessons">Lessons</a>
        <a href="/web/progress">Progress</a>
        <a href="">About</a>
      </div>
      <a href="/web/login" className={styles.logout} onClick={handleLogout}>
        Logout
      </a>
    </nav>
  );
}
