"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import "./style.css";

interface Lesson {
    lesson_id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: number;
}

interface ReviewResult {
    verdict: string;
    ai_solution: string;
    advice: string;
}

export default function LessonPage() {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [tips, setTips] = useState<{ tip_id: number; category: string; message: string }[]>([]);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Collapsible section toggles
    const [showProblem, setShowProblem] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [showHints, setShowHints] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchLesson = async () => {
            const res = await fetch(`http://localhost:8000/lessons/${id}`);
            const data = await res.json();
            setLesson(data);

            try {
                const res2 = await fetch(`http://localhost:8000/tips?lesson_id=${id}`);
                const data2 = await res2.json();
                setTips(Array.isArray(data2) ? data2 : []);
            } catch {
                setTips([]);
            }

            setLoading(false);
        };
        fetchLesson();
    }, [id]);

    // Function to run the code
    const runCode = async () => {
        setRunning(true);
        setOutput("");

        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: code,
                    language: lesson?.language || "python"
                })
            });
            const result = await res.json();

            if (result.success) {
                setOutput(result.output || "Code executed successfully!");
            } else {
                setOutput(result.error || result.output || "Error executing code");
            }
        } catch (error) {
            setOutput("Failed to execute code: " + String(error));
        } finally {
            setRunning(false);
        }
    };

    const submitProgress = async () => {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");

        if (!token || !user_id) {
            alert("You must be logged in to submit.");
            return;
        }

        if (!code.trim()) {
            alert("Please write some code before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            // Step 1: Call AI review
            const reviewRes = await fetch("http://localhost:8000/ai-review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    code,
                    language: lesson?.language || "python",
                    lesson_title: lesson?.title || "",
                    lesson_description: lesson?.description || ""
                })
            });

            const reviewData = await reviewRes.json();
            const result: ReviewResult = reviewData.feedback;

            setReviewResult(result);
            setShowModal(true);

            // Step 2: If correct, save progress
            if (result.verdict === "CORRECT") {
                await fetch("http://localhost:8000/progress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_id: parseInt(user_id),
                        lesson_id: parseInt(id as string),
                        status: "completed"
                    })
                });
            }
        } catch {
            alert("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Get Monaco language from lesson language
    const getMonacoLanguage = (lang: string) => {
        const map: { [key: string]: string } = {
            python: "python",
            javascript: "javascript",
            java: "java",
            "c++": "cpp",
            cpp: "cpp",
            c: "c",
            "c#": "csharp",
            csharp: "csharp",
            ruby: "ruby",
            go: "go",
            rust: "rust",
            php: "php",
            typescript: "typescript",
        };
        return map[lang?.toLowerCase()] || "python";
    };

    if (loading) {
        return (
            <div className="lesson-page">
                <div className="loading">Loading lesson...</div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="lesson-page">
                <div className="error">Lesson not found</div>
            </div>
        );
    }

    return (
        <div className="lesson-page">
            {/* Review Modal */}
            {showModal && reviewResult && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className={`modal-header ${reviewResult.verdict === "CORRECT" ? "modal-correct" : "modal-incorrect"}`}>
                            <h2>{reviewResult.verdict === "CORRECT" ? "✅ Correct!" : "❌ Incorrect"}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className="modal-solutions">
                            <div className="solution-column">
                                <h3>🤖 AI Solution</h3>
                                <pre className="solution-code">{reviewResult.ai_solution}</pre>
                            </div>
                            <div className="solution-divider" />
                            <div className="solution-column">
                                <h3>👤 Your Solution</h3>
                                <pre className="solution-code">{code}</pre>
                            </div>
                        </div>

                        <div className="modal-advice">
                            <h3>💡 Advice</h3>
                            <p>{reviewResult.advice}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="lesson-container">
                {/* Left Side - Lesson Content */}
                <div className="lesson-content">
                    <div className="lesson-header">
                        <h1>{lesson.title}</h1>
                        <div className="lesson-meta">
                            <span className="language-badge">{lesson.language}</span>
                            <span className="difficulty-badge">{lesson.difficulty}</span>
                            <span className="duration">{lesson.duration} min</span>
                        </div>
                    </div>

                    <div className="lesson-description">
                        <p>{lesson.description}</p>
                    </div>

                    {/* Lesson Content from DB */}
                    <div className="lesson-body">
                        <h2>📖 Lesson Content</h2>
                        <div className="content-text">
                            {lesson.content || "No content available yet."}
                        </div>
                    </div>

                    {/* Collapsible Problem Section */}
                    <div className="collapsible-section task-collapsible">
                        <button
                            className="collapsible-header"
                            onClick={() => setShowProblem(!showProblem)}
                        >
                            <h2>🎯 Your Task</h2>
                            <span className={`arrow ${showProblem ? "arrow-open" : ""}`}>▶</span>
                        </button>
                        {showProblem && (
                            <div className="collapsible-content">
                                <p>Write code in the editor on the right to practice what you learned.</p>
                            </div>
                        )}
                    </div>

                    {/* Collapsible Example Section */}
                    <div className="collapsible-section">
                        <button
                            className="collapsible-header"
                            onClick={() => setShowExample(!showExample)}
                        >
                            <h2>📝 Example</h2>
                            <span className={`arrow ${showExample ? "arrow-open" : ""}`}>▶</span>
                        </button>
                        {showExample && (
                            <div className="collapsible-content">
                                <p>No example available yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Collapsible Hints Section */}
                    <div className="collapsible-section">
                        <button
                            className="collapsible-header"
                            onClick={() => setShowHints(!showHints)}
                        >
                            <h2>💡 Hints</h2>
                            <span className={`arrow ${showHints ? "arrow-open" : ""}`}>▶</span>
                        </button>
                        {showHints && (
                            <div className="collapsible-content">
                                <p>No hints available yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Tips from database */}
                    {tips.length > 0 && (
                        <div className="lesson-tips">
                            <h2>💡 Tips</h2>
                            <div className="tips-text">
                                {tips.map((tip) => (
                                    <div key={tip.tip_id}>
                                        <h3 className="tip-category">{tip.category}</h3>
                                        <p className="tip-message">{tip.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Review Section */}
                    <div className="ai-review-section">
                        <h2>🤖 AI Review</h2>
                        {reviewResult ? (
                            <div>
                                <p className={reviewResult.verdict === "CORRECT" ? "ai-correct" : "ai-incorrect"}>
                                    {reviewResult.verdict === "CORRECT" ? "✅ Your solution is correct!" : "❌ Your solution needs improvement."}
                                </p>
                                <p className="ai-advice-text">{reviewResult.advice}</p>
                            </div>
                        ) : (
                            <p className="ai-placeholder">Submit your code to receive personalized feedback and suggestions from AI.</p>
                        )}
                    </div>
                </div>

                {/* Right Side - Code Editor */}
                <div className="editor-section">
                    <div className="editor-header">
                        <h3>Code Editor</h3>
                        <div className="editor-buttons">
                            <button
                                className="run-btn"
                                onClick={runCode}
                                disabled={running}
                            >
                                {running ? "Running..." : "▶ Run"}
                            </button>
                            <button className="submit-btn" onClick={submitProgress} disabled={submitting}>
                                {submitting ? "Reviewing..." : "Submit"}
                            </button>
                        </div>
                    </div>

                    <div className="editor-wrapper">
                        <Editor
                            height="400px"
                            language={getMonacoLanguage(lesson.language)}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 16 },
                            }}
                        />
                    </div>

                    <div className="output-section">
                        <h4>Output</h4>
                        <pre className="output-box">
                            {output || "Click 'Run' to see output..."}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
