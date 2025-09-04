'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LevelSelector from '../../components/levelSelector';
import LanguageSelector from '@/components/languageselector';
import { Lesson } from '../../type';
import styles from './page.module.css';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:1337/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data?.data as Lesson[]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setLessons([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className={styles.container}>Loading lessons...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>All Lessons</h1>

      <div className={styles.selectorWrapper}>
        <LevelSelector />
        <LanguageSelector />
      </div>

      {lessons.length === 0 && <p>No lessons found.</p>}

      <div className={styles.lessonsGrid}>
        {lessons.map((l) => (
          <Link key={l.id} href={`/lessons/${l.id}`}>
            <div className={styles.lessonCard}>
              <h2>{l.Title}</h2>
              <p>{l.Description}</p><br></br>
              <p>⭐ {l.Level}</p><br></br>
              <p>⏱ {l.Duration} min</p><br></br>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
