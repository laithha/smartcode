"use client";
import { motion } from "framer-motion";
import "./style.css";

const STATS = [
    { num: "50+", label: "Exercises" },
    { num: "5",   label: "Languages" },
    { num: "24/7", label: "AI Feedback" },
    { num: "Free", label: "Forever" },
];

const STEPS = [
    { n: "1", title: "Choose a Lesson", desc: "Pick from beginner to advanced topics across multiple languages" },
    { n: "2", title: "Write Code",      desc: "Practice in our browser-based editor with syntax highlighting" },
    { n: "3", title: "Get Feedback",    desc: "Receive instant AI-powered suggestions to improve your code" },
];

const FEATURES = [
    { icon: "< >", title: "Interactive Coding", desc: "Write code directly in your browser with our powerful editor" },
    { icon: "💡",  title: "AI Feedback",         desc: "Get personalized suggestions to improve your solutions" },
    { icon: "📊",  title: "Track Progress",       desc: "See your improvements and achievements over time" },
];

const LANGUAGES = [
    { icon: "🐍", name: "Python" },
    { icon: "🟨", name: "JavaScript" },
    { icon: "☕", name: "Java" },
    { icon: "💎", name: "C++" },
    { icon: "🦀", name: "Rust" },
];

export default function HomePage() {
    return (
        <div className="hv2-bg">
            <div className="hv2-blob hv2-blob1" />
            <div className="hv2-blob hv2-blob2" />
            <div className="hv2-blob hv2-blob3" />

            {/* Hero */}
            <section className="hv2-hero">
                <div className="hv2-wrap">
                    <motion.div className="hv2-hero-inner" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="hv2-badge">
                            <span className="hv2-badge-dot" />
                            Live IDE Terminal Active
                        </div>
                        <h1 className="hv2-title">
                            Learn to Code<br />
                            <span className="hv2-gradient">from Scratch</span>
                        </h1>
                        <p className="hv2-sub">Master programming fundamentals through hands-on practice. Build real skills with AI-powered feedback in a modern learning environment.</p>
                        <div className="hv2-hero-btns">
                            <a href="/web/lessons" className="hv2-btn-primary">Start Learning</a>
                            <a href="/web/lessons" className="hv2-btn-ghost">Browse Lessons →</a>
                        </div>
                    </motion.div>

                    {/* IDE mockup */}
                    <motion.div className="hv2-ide" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                        <div className="hv2-ide-bar">
                            <div className="hv2-ide-dots">
                                <span style={{ background: "#ff5f57" }} />
                                <span style={{ background: "#ffbd2e" }} />
                                <span style={{ background: "#28ca41" }} />
                            </div>
                            <span className="hv2-ide-filename">solution.py</span>
                        </div>
                        <div className="hv2-ide-body">
                            <div className="hv2-line"><span className="hv2-ln">1</span><span className="hv2-kw">def </span><span className="hv2-fn">welcome</span><span className="hv2-tx">(name):</span></div>
                            <div className="hv2-line"><span className="hv2-ln">2</span><span className="hv2-tx">    </span><span className="hv2-kw">return </span><span className="hv2-str">f"Hello, </span><span className="hv2-kw">{`{name}`}</span><span className="hv2-str">!"</span></div>
                            <div className="hv2-line"><span className="hv2-ln">3</span></div>
                            <div className="hv2-line"><span className="hv2-ln">4</span><span className="hv2-fn">print</span><span className="hv2-tx">(welcome(</span><span className="hv2-str">"World"</span><span className="hv2-tx">))</span></div>
                        </div>
                        <div className="hv2-ide-footer">
                            <span className="hv2-ide-ok">✓ No errors</span>
                            <button className="hv2-ide-run">▶ Run</button>
                        </div>

                        {/* Floating streak card */}
                        <div className="hv2-streak-card">
                            <div className="hv2-streak-icon">🔥</div>
                            <div>
                                <p className="hv2-streak-num">14 Days</p>
                                <p className="hv2-streak-lbl">Current Streak</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="hv2-stats-section">
                <div className="hv2-wrap">
                    <motion.div className="hv2-stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        {STATS.map((s) => (
                            <div key={s.label} className="hv2-stat">
                                <span className="hv2-stat-num">{s.num}</span>
                                <span className="hv2-stat-lbl">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section className="hv2-section">
                <div className="hv2-wrap">
                    <h2 className="hv2-section-title">How It Works</h2>
                    <div className="hv2-steps">
                        {STEPS.map((s, i) => (
                            <div key={s.n} className="hv2-step-row">
                                <motion.div className="hv2-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <div className="hv2-step-num">{s.n}</div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </motion.div>
                                {i < STEPS.length - 1 && <span className="hv2-step-arrow">→</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="hv2-section hv2-section-tinted">
                <div className="hv2-wrap">
                    <h2 className="hv2-section-title">Everything You Need</h2>
                    <div className="hv2-features">
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} className="hv2-feature-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="hv2-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Languages */}
            <section className="hv2-section">
                <div className="hv2-wrap">
                    <h2 className="hv2-section-title">Languages You'll Learn</h2>
                    <div className="hv2-langs">
                        {LANGUAGES.map((l) => (
                            <motion.div key={l.name} className="hv2-lang-card" whileHover={{ y: -4 }}>
                                <span className="hv2-lang-icon">{l.icon}</span>
                                <span>{l.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="hv2-section">
                <div className="hv2-wrap">
                    <motion.div className="hv2-cta-box" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="hv2-cta-top-line" />
                        <h2>Ready to Start Your Coding Journey?</h2>
                        <p>Join thousands of learners mastering programming skills. No credit card required.</p>
                        <a href="/web/register" className="hv2-btn-primary">Create Free Account</a>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="hv2-footer">
                <div className="hv2-wrap hv2-footer-inner">
                    <span className="hv2-footer-brand">SmartCode</span>
                    <div className="hv2-footer-links">
                        <a href="#">Contact</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                    <span className="hv2-footer-copy">© 2024 SmartCode. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
