"use client";
import { useState, useEffect } from "react";
import "./style.css";
import { motion } from "framer-motion";

interface ProgressItem {
    progress_id: number;
    status: string;
    title: string;
    language: string;
    difficulty: string;
}

export default function ProgressPage() {
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const user_id = localStorage.getItem("user_id");
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:8000/progress/${user_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProgress(data.user?.prog ?? []);
            setLoading(false);
        };
        fetchProgress();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case "beginner": return "#28ca41";
            case "intermediate": return "#ffbd2e";
            case "advanced": return "#ff5f57";
            default: return "#888";
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    };

    if (loading) {
        return (
            <div className="progress-bg">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading progress...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-bg">
            <motion.div
                className="progress-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="progress-header">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        Your <span className="highlight">Progress</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        Track your completed lessons
                    </motion.p>
                </div>

                <motion.div
                    className="stats-bar"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="stats-count">
                        <strong>{progress.length}</strong> {progress.length === 1 ? "lesson" : "lessons"} completed
                    </span>
                </motion.div>

                {progress.length === 0 ? (
                    <motion.div
                        className="no-progress"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="no-progress-icon">📘</span>
                        <h3>No lessons completed yet</h3>
                        <p>Complete a lesson to see your progress here.</p>
                        <a href="/web/lessons" className="browse-btn">Browse Lessons</a>
                    </motion.div>
                ) : (
                    <motion.div
                        className="progress-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {progress.map((item) => (
                            <motion.div key={item.progress_id} className="progress-card" variants={cardVariants}>
                                <div className="progress-card-header">
                                    <span className="progress-language-icon">
                                        {item.language?.charAt(0).toUpperCase() ?? "?"}
                                    </span>
                                </div>
                                <div className="progress-card-content">
                                    <h3>{item.title}</h3>
                                    <div className="progress-meta">
                                        <span className="progress-language">{item.language}</span>
                                        <span
                                            className="progress-difficulty"
                                            style={{ color: getDifficultyColor(item.difficulty) }}
                                        >
                                            {item.difficulty}
                                        </span>
                                    </div>
                                    <span className="progress-status">Completed</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
