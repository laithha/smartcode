"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { langConf, diffConf } from "../../lib/constants";
import { useAuth } from "../../lib/useAuth";
import { Lesson } from "./[id]/utils";
import "./style.css";

export default function LessonsPage() {
    const authenticated = useAuth();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await fetch("http://localhost:8000/lessons");
                const data = await res.json();
                setLessons(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch lessons:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    const languages = ["all", ...new Set(lessons.map((l) => l.language?.toLowerCase()).filter(Boolean))];
    const difficulties = ["all", "beginner", "intermediate", "advanced"];

    const filteredLessons = lessons.filter((lesson) => {
        const matchSearch =
            lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLanguage = selectedLanguage === "all" || lesson.language?.toLowerCase() === selectedLanguage;
        const matchDifficulty = selectedDifficulty === "all" || lesson.difficulty?.toLowerCase() === selectedDifficulty;
        return matchSearch && matchLanguage && matchDifficulty;
    });


    if (!authenticated) return null;

    if (loading) {
        return (
            <div className="lf2-bg">
                <div className="lf2-loader">
                    <div className="lf2-spinner" />
                    <p>Loading lessons...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lf2-bg">
            <div className="lf2-blob lf2-blob1" />
            <div className="lf2-blob lf2-blob2" />

            <div className="lf2-wrap">

                <motion.div className="lf2-header" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div className="lf2-header-left">
                        <p className="lf2-eyebrow">SmartCode</p>
                        <h1>Course Catalogue</h1>
                        <p className="lf2-sub">{lessons.length} lessons available across {new Set(lessons.map(l => l.language).filter(Boolean)).size} languages</p>
                    </div>
                    <div className="lf2-header-right">
                        <a href="/web/progress" className="lf2-ghost-btn">My Dashboard →</a>
                    </div>
                </motion.div>

                <motion.div className="lf2-search-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <svg className="lf2-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                    </svg>
                    <input
                        className="lf2-search"
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="lf2-clear" onClick={() => setSearchQuery("")}>✕</button>
                    )}
                </motion.div>

                <div className="lf2-body">

                    <motion.aside className="lf2-sidebar" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <div className="lf2-sidebar-section">
                            <p className="lf2-sidebar-title">Language</p>
                            {languages.map((lang) => {
                                const lc = langConf(lang);
                                const active = selectedLanguage === lang;
                                return (
                                    <button
                                        key={lang}
                                        className={`lf2-sidebar-item ${active ? "lf2-sidebar-active" : ""}`}
                                        onClick={() => setSelectedLanguage(lang)}
                                        style={active && lang !== "all" ? { color: lc.color, background: lc.bg } : {}}
                                    >
                                        {lang !== "all" && (
                                            <span className="lf2-sidebar-dot" style={{ background: lc.accent }} />
                                        )}
                                        {lang === "all" ? "All Languages" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        <span className="lf2-sidebar-count">
                                            {lang === "all" ? lessons.length : lessons.filter(l => l.language?.toLowerCase() === lang).length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="lf2-sidebar-divider" />

                        <div className="lf2-sidebar-section">
                            <p className="lf2-sidebar-title">Difficulty</p>
                            {difficulties.map((diff) => {
                                const dc = diffConf(diff);
                                const active = selectedDifficulty === diff;
                                return (
                                    <button
                                        key={diff}
                                        className={`lf2-sidebar-item ${active ? "lf2-sidebar-active" : ""}`}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        style={active && diff !== "all" ? { color: dc.color, background: dc.bg } : {}}
                                    >
                                        {diff !== "all" && (
                                            <span className="lf2-sidebar-dot" style={{ background: dc.dot }} />
                                        )}
                                        {diff === "all" ? "All Levels" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                                        <span className="lf2-sidebar-count">
                                            {diff === "all" ? lessons.length : lessons.filter(l => l.difficulty === diff).length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.aside>

                    <div className="lf2-main">
                        <div className="lf2-results-row">
                            <span className="lf2-results">{filteredLessons.length} lesson{filteredLessons.length !== 1 ? "s" : ""} found</span>
                        </div>

                        {filteredLessons.length === 0 ? (
                            <motion.div className="lf2-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <span className="lf2-empty-icon">📚</span>
                                <h3>No lessons found</h3>
                                <p>Try adjusting your filters or search.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="lf2-grid"
                                initial="hidden"
                                animate="visible"
                                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                                key={`${selectedLanguage}-${selectedDifficulty}-${searchQuery}`}
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredLessons.map((lesson) => {
                                        const lc = langConf(lesson.language);
                                        const dc = diffConf(lesson.difficulty);
                                        return (
                                            <motion.div
                                                key={lesson.lesson_id}
                                                className="lf2-card"
                                                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130, damping: 18 } } }}
                                                layout
                                            >
                                                <div className="lf2-card-accent" style={{ background: `linear-gradient(90deg, ${lc.accent}, ${lc.accent}88)` }} />
                                                <div className="lf2-card-body">
                                                    <div className="lf2-card-top">
                                                        <span className="lf2-lang-badge" style={{ color: lc.color, background: lc.bg }}>
                                                            {lesson.language?.toUpperCase()}
                                                        </span>
                                                        <span className="lf2-diff-badge" style={{ color: dc.color }}>
                                                            <span className="lf2-diff-dot" style={{ background: dc.dot }} />
                                                            {lesson.difficulty}
                                                        </span>
                                                    </div>
                                                    <h3 className="lf2-card-title">{lesson.title}</h3>
                                                    <p className="lf2-card-desc">{lesson.description || "No description available"}</p>
                                                    <div className="lf2-card-footer">
                                                        {lesson.duration && (
                                                            <span className="lf2-duration">
                                                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                                {lesson.duration} min
                                                            </span>
                                                        )}
                                                        <a href={`/web/lessons/${lesson.lesson_id}`} className="lf2-btn">
                                                            Start Lesson →
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>

                    <motion.aside className="lf2-right" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <div className="lf2-right-card">
                            <p className="lf2-right-title">Overview</p>
                            <div className="lf2-right-stat">
                                <span className="lf2-right-stat-icon" style={{ background: "#eef2ff", color: "#6366f1" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                </span>
                                <div>
                                    <p className="lf2-right-num">{lessons.length}</p>
                                    <p className="lf2-right-lbl">Total Lessons</p>
                                </div>
                            </div>
                            <div className="lf2-right-stat">
                                <span className="lf2-right-stat-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                                </span>
                                <div>
                                    <p className="lf2-right-num">{new Set(lessons.map(l => l.language).filter(Boolean)).size}</p>
                                    <p className="lf2-right-lbl">Languages</p>
                                </div>
                            </div>
                            <div className="lf2-right-stat">
                                <span className="lf2-right-stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </span>
                                <div>
                                    <p className="lf2-right-num">{lessons.filter(l => l.difficulty?.toLowerCase() === "beginner").length}</p>
                                    <p className="lf2-right-lbl">Beginner</p>
                                </div>
                            </div>
                            <div className="lf2-right-stat">
                                <span className="lf2-right-stat-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                </span>
                                <div>
                                    <p className="lf2-right-num">{lessons.filter(l => l.difficulty?.toLowerCase() === "intermediate").length}</p>
                                    <p className="lf2-right-lbl">Intermediate</p>
                                </div>
                            </div>
                            <div className="lf2-right-stat">
                                <span className="lf2-right-stat-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343M17.657 18.657L6.343 7.343"/></svg>
                                </span>
                                <div>
                                    <p className="lf2-right-num">{lessons.filter(l => l.difficulty?.toLowerCase() === "advanced").length}</p>
                                    <p className="lf2-right-lbl">Advanced</p>
                                </div>
                            </div>
                        </div>
                        <div className="lf2-right-card lf2-right-tip">
                            <p className="lf2-right-title">Quick Tip</p>
                            <p className="lf2-tip-text">Start with Beginner lessons to build a strong foundation before moving to harder topics.</p>
                            <a href="/web/progress" className="lf2-tip-link">View your progress →</a>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
