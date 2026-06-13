"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/app/lib/api";
import styles from './navbar.module.css';
import logo from "../logo.png";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    if (!token || !user_id) return;

    fetch(`${API_URL}/users/${user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.user?.is_admin === true) setIsAdmin(true); })
      .catch(() => {});
  }, []);

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
        <a href="/web/leaderboard">Leaderboard</a>
        {isAdmin && <a href="/web/admin">Admin</a>}
        <a href="/web/settings">Settings</a>
      </div>
      <a href="/web/login" className={styles.logout} onClick={handleLogout}>
        Logout
      </a>
    </nav>
  );
}