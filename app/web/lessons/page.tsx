"use client";
import { useState, useEffect } from "react";
import "./style.css";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson {
    lesson_id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: number;
}

export default function LessonsPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await fetch("/api/lessons");
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error("Failed to fetch lessons:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique languages for tabs
    const languages = ["all", ...new Set(lessons.map((l) => l.language).filter(Boolean))];
    const difficulties = ["all", "beginner", "intermediate", "advanced"];

    // Filter lessons based on search and selections
    const filteredLessons = lessons.filter((lesson) => {
        const matchSearch = lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLanguage = selectedLanguage === "all" || lesson.language === selectedLanguage;
        const matchDifficulty = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
        return matchSearch && matchLanguage && matchDifficulty;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case "beginner":
                return "#28ca41";
            case "intermediate":
                return "#ffbd2e";
            case "advanced":
                return "#ff5f57";
            default:
                return "#888";
        }
    };

    const getLanguageIcon = (language: string) => {
        switch (language?.toLowerCase()) {
            case "python":
                return "";
            case "javascript":
                return "";
            case "java":
                return "";
            case "c++":
                return "";
            case "rust":
                return "";
            default:
                return "";
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    if (loading) {
        return (
            <div className="lessons-bg">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading lessons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lessons-bg">
            <motion.div
                className="lessons-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="lessons-header">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Browse <span className="highlight">Lessons</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Choose from our collection of programming lessons
                    </motion.p>
                </div>

                {/* Search Bar */}
                <motion.div
                    className="search-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search lessons by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchQuery("")}
                        >
                            ✕
                        </button>
                    )}
                </motion.div>

                {/* Language Tabs */}
                <motion.div
                    className="tabs-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="tabs-wrapper">
                        <span className="tabs-label">Language:</span>
                        <div className="tabs">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    className={`tab ${selectedLanguage === lang ? 'active' : ''}`}
                                    onClick={() => setSelectedLanguage(lang)}
                                >
                                    {lang !== "all" && <span className="tab-icon">{getLanguageIcon(lang)}</span>}
                                    {lang === "all" ? "All" : lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tabs-wrapper">
                        <span className="tabs-label">Level:</span>
                        <div className="tabs difficulty-tabs">
                            {difficulties.map((diff) => (
                                <button
                                    key={diff}
                                    className={`tab ${selectedDifficulty === diff ? 'active' : ''} ${diff !== 'all' ? `tab-${diff}` : ''}`}
                                    onClick={() => setSelectedDifficulty(diff)}
                                >
                                    {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <motion.div
                    className="results-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="results-count">
                        {filteredLessons.length} {filteredLessons.length === 1 ? 'lesson' : 'lessons'} found
                    </span>
                </motion.div>

                {/* Lessons Grid */}
                {filteredLessons.length === 0 ? (
                    <motion.div
                        className="no-lessons"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="no-lessons-icon">📚</span>
                        <h3>No lessons found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="lessons-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key={`${selectedLanguage}-${selectedDifficulty}-${searchQuery}`}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredLessons.map((lesson) => (
                                <motion.div
                                    key={lesson.lesson_id}
                                    className="lesson-card"
                                    variants={cardVariants}
                                    layout
                                >
                                    <div className="card-header">
                                        <span className="language-icon">{lesson.language?.charAt(0).toUpperCase() || "?"}</span>
                                    </div>

                                    <div className="card-content">
                                        <h3>{lesson.title}</h3>
                                        <p className="description">{lesson.description || "No description available"}</p>
                                        <a href={`/web/lessons/${lesson.lesson_id}`} className="start-btn">
                                            Start Lesson
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
