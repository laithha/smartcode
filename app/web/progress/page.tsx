"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./style.css";

interface ProgressItem {
    progress_id: number;
    lesson_id: number;
    status: string;
    title: string;
    language: string;
    difficulty: string;
}

interface Recommendation {
    lesson_id: number;
    title: string;
    description: string;
    language: string;
    difficulty: string;
    duration: number;
}

const LANG_COLORS: Record<string, { color: string; bg: string }> = {
    python:     { color: "#3b82f6", bg: "#eff6ff" },
    javascript: { color: "#d97706", bg: "#fffbeb" },
    java:       { color: "#dc2626", bg: "#fef2f2" },
    c:          { color: "#7c3aed", bg: "#f5f3ff" },
    cpp:        { color: "#0891b2", bg: "#ecfeff" },
};

const DIFF_CONFIG: Record<string, { color: string; bg: string }> = {
    beginner:     { color: "#16a34a", bg: "#f0fdf4" },
    intermediate: { color: "#d97706", bg: "#fffbeb" },
    advanced:     { color: "#dc2626", bg: "#fef2f2" },
};

export default function ProgressPage() {
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [total, setTotal] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            const user_id = localStorage.getItem("user_id");
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:8000/progress/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProgress(data.user?.prog ?? []);
            setTotal(data.user?.total ?? 0);
            setStreak(data.user?.streak ?? 0);
            setLoading(false);

            const recRes = await fetch(`http://localhost:8000/progress/${user_id}/recommendation`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const recData = await recRes.json();
            if (recData.lesson_id) setRecommendation(recData);
        };
        fetchProgress();
    }, []);

    const pct = total > 0 ? Math.round((progress.length / total) * 100) : 0;
    const langConf = (l: string) => LANG_COLORS[l?.toLowerCase()] ?? { color: "#6366f1", bg: "#eef2ff" };
    const diffConf = (d: string) => DIFF_CONFIG[d?.toLowerCase()] ?? { color: "#6b7280", bg: "#f9fafb" };

    if (loading) {
        return (
            <div className="f2-bg">
                <div className="f2-loader">
                    <div className="f2-spinner" />
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="f2-bg">
            <div className="f2-blob f2-blob1" />
            <div className="f2-blob f2-blob2" />

            <div className="f2-wrap">

                {/* Header */}
                <motion.div className="f2-header" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                    <div>
                        <p className="f2-eyebrow">SmartCode</p>
                        <h1>Your Dashboard</h1>
                        <p className="f2-sub">Keep learning, keep growing.</p>
                    </div>
                    <a href="/web/lessons" className="f2-cta">Browse Lessons →</a>
                </motion.div>

                {/* Hero progress ring + stats */}
                <motion.div className="f2-hero" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>

                    <div className="f2-ring-wrap">
                        <svg className="f2-ring-svg" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#ede9fe" strokeWidth="10" />
                            <motion.circle
                                cx="60" cy="60" r="50"
                                fill="none"
                                stroke="url(#ringGrad)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                                transform="rotate(-90 60 60)"
                                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - pct / 100) }}
                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                            />
                            <defs>
                                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="f2-ring-center">
                            <span className="f2-ring-pct">{pct}%</span>
                            <span className="f2-ring-lbl">complete</span>
                        </div>
                    </div>

                    <div className="f2-side-stats">
                        <div className="f2-side-stat">
                            <div className="f2-side-icon f2-icon-indigo">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div>
                                <p className="f2-side-num">{progress.length}</p>
                                <p className="f2-side-lbl">Completed</p>
                            </div>
                        </div>
                        <div className="f2-side-stat">
                            <div className="f2-side-icon f2-icon-violet">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                            </div>
                            <div>
                                <p className="f2-side-num">{total}</p>
                                <p className="f2-side-lbl">Total Lessons</p>
                            </div>
                        </div>
                        <div className="f2-side-stat">
                            <div className="f2-side-icon f2-icon-orange">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2c0 0-8.5 8-8.5 14a8.5 8.5 0 0017 0c0-3-1.5-6-3-8-1 2-2.5 3-4 3 1-3 1-6.5-1.5-9z"/></svg>
                            </div>
                            <div>
                                <p className="f2-side-num">{streak}</p>
                                <p className="f2-side-lbl">Day Streak</p>
                            </div>
                        </div>
                        <div className="f2-side-stat">
                            <div className="f2-side-icon f2-icon-green">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 17l4-8 4 4 4-6 4 10"/></svg>
                            </div>
                            <div>
                                <p className="f2-side-num">{total - progress.length}</p>
                                <p className="f2-side-lbl">Remaining</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recommendation */}
                {recommendation && (
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ marginBottom: "32px" }}>
                        <div className="f2-section-row">
                            <h2 className="f2-section-title">Up Next</h2>
                        </div>
                        <a href={`/web/lessons/${recommendation.lesson_id}`} className="f2-card" style={{ display: "block", textDecoration: "none", marginTop: "12px" }}>
                            <div className="f2-card-top">
                                <span className="f2-lang-chip" style={{ color: langConf(recommendation.language).color, background: langConf(recommendation.language).bg }}>
                                    {recommendation.language?.toUpperCase()}
                                </span>
                                <span className="f2-diff-chip" style={{ color: diffConf(recommendation.difficulty).color, background: diffConf(recommendation.difficulty).bg }}>
                                    {recommendation.difficulty}
                                </span>
                            </div>
                            <p className="f2-card-title">{recommendation.title}</p>
                            <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>{recommendation.description}</p>
                        </a>
                    </motion.div>
                )}

                {/* Lessons section */}
                {progress.length === 0 ? (
                    <motion.div className="f2-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <span className="f2-empty-icon">📘</span>
                        <h3>No completed lessons yet</h3>
                        <p>Complete your first lesson to see it here.</p>
                        <a href="/web/lessons" className="f2-cta">Start Learning</a>
                    </motion.div>
                ) : (
                    <>
                        <div className="f2-section-row">
                            <h2 className="f2-section-title">Completed Lessons</h2>
                            <span className="f2-section-count">{progress.length} lesson{progress.length !== 1 ? "s" : ""}</span>
                        </div>
                        <motion.div
                            className="f2-grid"
                            initial="hidden"
                            animate="visible"
                            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                        >
                            {progress.map((item) => {
                                const lc = langConf(item.language);
                                const dc = diffConf(item.difficulty);
                                return (
                                    <motion.div
                                        key={item.progress_id}
                                        className="f2-card"
                                        variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 18 } } }}
                                    >
                                        <div className="f2-card-top">
                                            <span className="f2-lang-chip" style={{ color: lc.color, background: lc.bg }}>
                                                {item.language?.toUpperCase()}
                                            </span>
                                            <span className="f2-done-chip">✓ Done</span>
                                        </div>
                                        <p className="f2-card-title">{item.title}</p>
                                        <div className="f2-card-foot">
                                            <span className="f2-diff-chip" style={{ color: dc.color, background: dc.bg }}>
                                                {item.difficulty}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
