'use client';
import React, { useEffect, useState } from 'react';
import LevelSelector from '../../components/levelSelector';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:1337/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data?.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setLessons([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading lessons...</p>;

  return (
    <div style={{ padding: '20px', overflowX: 'hidden' }}>
      <h1 style={{ color: 'black', textAlign: 'center', marginBottom: '20px', fontSize:'xx-large', }}>All Lessons</h1>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LevelSelector />
      </div>

      {lessons.length === 0 && <p>No lessons found.</p>}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center', // center cards
        }}
      >
        {lessons.map((l: any) => (
          <div
            key={l.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              width: '300px',
              minHeight: '200px',
              backgroundColor: '#f5f5f5',
              color: '#000',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>{l.Title}</h2>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>{l.Description}</p>
            <p>⭐ {l.Level}</p>
            <p>⏱ {l.Duration} min</p>
            <p>{l.Completed ? '✅ Completed' : '❌ Not Completed'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
