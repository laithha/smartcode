"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import "./style.css";
import CollapsibleSection from "./components/CollapsibleSection";
import ReviewModal from "./components/ReviewModal";
import { MONACO_LANG_MAP, Lesson, ReviewResult } from "./utils";

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
    const { id } = useParams();

    useEffect(() => {
        const fetchLesson = async () => {
            const res = await fetch(`http://localhost:8000/lessons/${id}`);
            setLesson(await res.json());
            try {
                const res2 = await fetch(`http://localhost:8000/tips?lesson_id=${id}`);
                const data2 = await res2.json();
                setTips(Array.isArray(data2) ? data2 : []);
            } catch { setTips([]); }
            setLoading(false);
        };
        fetchLesson();
    }, [id]);

    const runCode = async () => {
        setRunning(true);
        setOutput("");
        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: lesson?.language || "python" }),
            });
            const result = await res.json();
            setOutput(result.success ? result.output || "Code executed successfully!" : result.error || "Error executing code");
        } catch (error) {
            setOutput("Failed to execute code: " + String(error));
        } finally {
            setRunning(false);
        }
    };

    const submitProgress = async () => {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (!token || !user_id) return alert("You must be logged in to submit.");
        if (!code.trim()) return alert("Please write some code before submitting.");

        setSubmitting(true);
        try {
            const reviewRes = await fetch("http://localhost:8000/ai-review", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ code, language: lesson?.language || "python", lesson_title: lesson?.title || "", lesson_description: lesson?.description || "" }),
            });
            const result: ReviewResult = (await reviewRes.json()).feedback;
            setReviewResult(result);
            setShowModal(true);

            if (result.verdict === "CORRECT") {
                await fetch("http://localhost:8000/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ user_id: parseInt(user_id), lesson_id: parseInt(id as string), status: "completed" }),
                });
            }
        } catch {
            alert("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="lesson-page"><div className="loading">Loading lesson...</div></div>;
    if (!lesson) return <div className="lesson-page"><div className="error">Lesson not found</div></div>;

    return (
        <div className="lesson-page">
            {showModal && reviewResult && <ReviewModal result={reviewResult} code={code} onClose={() => setShowModal(false)} />}

            <div className="lesson-container">
                <div className="lesson-content">
                    <div className="lesson-header">
                        <h1>{lesson.title}</h1>
                        <div className="lesson-meta">
                            <span className="language-badge">{lesson.language}</span>
                            <span className="difficulty-badge">{lesson.difficulty}</span>
                            <span className="duration">{lesson.duration} min</span>
                        </div>
                    </div>

                    <div className="lesson-description"><p>{lesson.description}</p></div>

                    <div className="lesson-body">
                        <h2>📖 Lesson Content</h2>
                        <div className="content-text">{lesson.content || "No content available yet."}</div>
                    </div>

                    <CollapsibleSection icon="🎯" title="Your Task">
                        <p>Write code in the editor on the right to practice what you learned.</p>
                    </CollapsibleSection>

                    <CollapsibleSection icon="📝" title="Example">
                        <p>No example available yet.</p>
                    </CollapsibleSection>

                    <CollapsibleSection icon="💡" title="Hints">
                        <p>No hints available yet.</p>
                    </CollapsibleSection>

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

                <div className="editor-section">
                    <div className="editor-header">
                        <h3>Code Editor</h3>
                        <div className="editor-buttons">
                            <button className="run-btn" onClick={runCode} disabled={running}>
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
                            language={MONACO_LANG_MAP[lesson.language?.toLowerCase()] || "python"}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                        />
                    </div>
                    <div className="output-section">
                        <h4>Output</h4>
                        <pre className="output-box">{output || "Click 'Run' to see output..."}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
