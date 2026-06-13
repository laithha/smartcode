"use client";
import { useEffect, useState } from "react";
import { API_URL } from "@/app/lib/api";
import { useAuth } from "../../lib/useAuth";
import "./style.css";

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  display_name: string;
  completed_count: number;
}

export default function LeaderboardPage() {
  const authenticated = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    if (uid) setCurrentUserId(parseInt(uid));

    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.leaderboard ?? []);
        setLoading(false);
      });
  }, []);

  const medal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  if (!authenticated) return null;

  return (
    <div className="lb-root">
      <div className="lb-container">
        <div className="lb-header">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-sub">Top students ranked by completed lessons</p>
        </div>

        {loading ? (
          <div className="lb-loading">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="lb-empty">No entries yet. Complete lessons to appear here!</div>
        ) : (
          <div className="lb-card">
            <table className="lb-table">
              <thead>
                <tr>
                  <th className="lb-th lb-th-rank">Rank</th>
                  <th className="lb-th lb-th-user">Student</th>
                  <th className="lb-th lb-th-count">Lessons</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.user_id}
                    className={`lb-row ${entry.user_id === currentUserId ? "lb-row-me" : ""}`}
                  >
                    <td className="lb-td lb-td-rank">
                      <span className="lb-rank-badge">
                        {medal(entry.rank) ?? `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="lb-td lb-td-user">
                      <span className="lb-email">{entry.display_name}</span>
                      {entry.user_id === currentUserId && (
                        <span className="lb-you-tag">you</span>
                      )}
                    </td>
                    <td className="lb-td lb-td-count">
                      <span className="lb-count">{entry.completed_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
