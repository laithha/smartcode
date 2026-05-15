"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import ReviewModal from "./components/ReviewModal";
import toast from "react-hot-toast";
import { MONACO_LANG_MAP, Lesson, ReviewResult, Recommendation } from "./utils";
import "./style.css";

type Tab = "problem" | "example" | "hints" | "theory" | "askai" | "history";

function isCodeLine(line: string): boolean {
    const t = line.trim();
    if (!t) return false;
    return (
        /^(def |class |return |import |from |if |else:|elif |for |while |try:|except|with |print\(|self\.|my_|#)/.test(t) ||
        /[←→]/.test(t) ||
        line.startsWith("    ") ||
        /^[a-z_]+\s*=\s*/.test(t) ||
        (/\(.*\)/.test(t) && /^[a-z_]/.test(t))
    );
}

function isHeadingLine(line: string): boolean {
    const t = line.trim();
    if (!t || t.length < 4) return false;
    return t === t.toUpperCase() && /[A-Z]/.test(t) && !/[{};]/.test(t);
}

function renderTheory(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let codeLines: string[] = [];
    let listItems: string[] = [];
    let key = 0;

    const flushCode = () => {
        if (codeLines.length > 0) {
            elements.push(
                <div key={key++} className="v2-theory-code-block">
                    <pre className="v2-theory-code-pre">{codeLines.join("\n")}</pre>
                </div>
            );
            codeLines = [];
        }
    };

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={key++} className="v2-theory-list">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) { flushCode(); flushList(); return; }

        if (trimmed.startsWith("# ")) {
            flushCode(); flushList();
            elements.push(<h2 key={key++} className="v2-theory-h1">{trimmed.slice(2)}</h2>);
        } else if (trimmed.startsWith("## ")) {
            flushCode(); flushList();
            elements.push(<h3 key={key++} className="v2-theory-h2">{trimmed.slice(3)}</h3>);
        } else if (isHeadingLine(line)) {
            flushCode(); flushList();
            elements.push(<h3 key={key++} className="v2-theory-h2">{trimmed}</h3>);
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            flushCode();
            listItems.push(trimmed.slice(2));
        } else if (/^\d+\.\s/.test(trimmed)) {
            flushCode();
            listItems.push(trimmed.replace(/^\d+\.\s/, ""));
        } else if (isCodeLine(line)) {
            flushList();
            codeLines.push(line);
        } else {
            flushCode(); flushList();
            elements.push(<p key={key++} className="v2-theory-p">{trimmed}</p>);
        }
    });
    flushCode();
    flushList();
    return <div className="v2-theory-body">{elements}</div>;
}

interface ChatMessage {
    role: "user" | "ai";
    text: string;
}

interface Submission {
    submission_id: number;
    code: string;
    language: string;
    submitted_at: string;
}

const DIFF_STYLE: Record<string, { color: string; bg: string }> = {
    beginner:     { color: "#16a34a", bg: "#dcfce7" },
    intermediate: { color: "#d97706", bg: "#fef3c7" },
    advanced:     { color: "#dc2626", bg: "#fee2e2" },
};

const LANG_STYLE: Record<string, { color: string; bg: string }> = {
    python:     { color: "#3b82f6", bg: "#dbeafe" },
    javascript: { color: "#d97706", bg: "#fef3c7" },
    java:       { color: "#dc2626", bg: "#fee2e2" },
    c:          { color: "#7c3aed", bg: "#ede9fe" },
    cpp:        { color: "#0891b2", bg: "#cffafe" },
};

export default function LessonPage() {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [tips, setTips] = useState<{ tip_id: number; category: string; message: string }[]>([]);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState<{ text: string; success: boolean } | null>(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("theory");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
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

            const token = localStorage.getItem("token");
            const user_id = localStorage.getItem("user_id");
            if (token && user_id) {
                const progRes = await fetch(`http://localhost:8000/progress/${user_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const progData = await progRes.json();
                const alreadyDone = progData.user?.prog?.some((p: { lesson_id: number }) =>
                    String(p.lesson_id) === String(id)
                );
                if (alreadyDone) {
                    const recRes = await fetch(`http://localhost:8000/progress/${user_id}/recommendation`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const recData = await recRes.json();
                    if (recData.lesson_id) setRecommendation(recData);
                }
            }
            if (token && user_id) {
                try {
                    const subRes = await fetch(`http://localhost:8000/submissions?user_id=${user_id}&lesson_id=${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const subData = await subRes.json();
                    setSubmissions(subData.submissions ?? []);
                } catch { setSubmissions([]); }
            }
            setLoading(false);
        };
        fetchLesson();
    }, [id]);

    const runCode = async () => {
        setRunning(true);
        setOutput(null);
        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: lesson?.language || "python" }),
            });
            const result = await res.json();
            setOutput(result.success
                ? { text: result.output || "Code executed successfully!", success: true }
                : { text: result.error || "Error executing code", success: false }
            );
        } catch (error) {
            setOutput({ text: "Failed to execute: " + String(error), success: false });
        } finally {
            setRunning(false);
        }
    };

    const submitProgress = async () => {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        if (!token || !user_id) { toast.error("You must be logged in to submit."); return; }
        if (!code.trim()) { toast.error("Please write some code before submitting."); return; }

        setSubmitting(true);
        try {
            const reviewRes = await fetch("http://localhost:8000/ai-review", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ code, language: lesson?.language || "python", lesson_title: lesson?.title || "", lesson_description: lesson?.description || "", lesson_task: taskTips.map(t => t.message).join("\n") }),
            });
            const result: ReviewResult = (await reviewRes.json()).feedback;
            setReviewResult(result);
            setShowModal(true);

            await fetch("http://localhost:8000/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: parseInt(user_id), lesson_id: parseInt(id as string), code, language: lesson?.language || "python" }),
            });
            const now = new Date();
            const submitted_at = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
            setSubmissions(prev => [{ submission_id: Date.now(), code, language: lesson?.language || "python", submitted_at }, ...prev]);

            if (result.verdict === "CORRECT") {
                toast.success("Lesson completed! Great work 🎉");
                await fetch("http://localhost:8000/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ user_id: parseInt(user_id), lesson_id: parseInt(id as string), status: "completed" }),
                });
                const recRes = await fetch(`http://localhost:8000/progress/${user_id}/recommendation`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const recData = await recRes.json();
                if (recData.lesson_id) setRecommendation(recData);
            }
        } catch {
            toast.error("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="v2-loading">
            <div className="v2-spinner" />
            <p>Loading lesson...</p>
        </div>
    );
    if (!lesson) return <div className="v2-loading"><p style={{ color: "#ef4444" }}>Lesson not found.</p></div>;

    const diffStyle = DIFF_STYLE[lesson.difficulty?.toLowerCase()] ?? { color: "#6b7280", bg: "#f3f4f6" };
    const langStyle = LANG_STYLE[lesson.language?.toLowerCase()] ?? { color: "#6366f1", bg: "#eef2ff" };
    const taskTips = tips.filter(t => t.category === "task");
    const exampleTips = tips.filter(t => t.category === "example");
    const hintTips = tips.filter(t => t.category === "hint");

    const sendHint = async () => {
        if (!chatInput.trim() || chatLoading) return;
        const token = localStorage.getItem("token");
        const question = chatInput.trim();
        const newMessages: ChatMessage[] = [...chatMessages, { role: "user", text: question }];
        setChatMessages(newMessages);
        setChatInput("");
        setChatLoading(true);
        try {
            const history = chatMessages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
            const res = await fetch("http://localhost:8000/ai-hint", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ question, lesson_title: lesson?.title || "", lesson_description: lesson?.description || "", language: lesson?.language || "python", conversation_history: history }),
            });
            const data = await res.json();
            setChatMessages([...newMessages, { role: "ai", text: data.answer }]);
        } catch {
            setChatMessages([...newMessages, { role: "ai", text: "Sorry, I couldn't respond. Please try again." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="v2-root">
            {showModal && reviewResult && <ReviewModal result={reviewResult} code={code} onClose={() => setShowModal(false)} />}

            {/* Top bar */}
            <div className="v2-topbar">
                <a href="/web/lessons" className="v2-back">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Lessons
                </a>
                <div className="v2-topbar-center">
                    <span className="v2-lesson-title">{lesson.title}</span>
                </div>
                <div className="v2-topbar-badges">
                    <span className="v2-badge" style={{ color: langStyle.color, background: langStyle.bg }}>{lesson.language?.toUpperCase()}</span>
                    <span className="v2-badge" style={{ color: diffStyle.color, background: diffStyle.bg }}>{lesson.difficulty}</span>
                    <span className="v2-badge v2-badge-neutral">⏱ {lesson.duration} min</span>
                </div>
            </div>

            {/* Main panels */}
            <div className="v2-panels">

                {/* Left panel */}
                <div className="v2-left">
                    <div className="v2-tabs">
                        {(["theory", "problem", "example", "hints", "askai", "history"] as Tab[]).map(tab => (
                            <button key={tab} className={`v2-tab ${activeTab === tab ? "v2-tab-active" : ""}`} onClick={() => setActiveTab(tab)}>
                                {tab === "theory" && "📖 Theory"}
                                {tab === "problem" && "🎯 Problem"}
                                {tab === "example" && "📝 Example"}
                                {tab === "hints" && "💡 Hints"}
                                {tab === "askai" && "🤖 Ask AI"}
                                {tab === "history" && "🕓 History"}
                            </button>
                        ))}
                    </div>

                    <div className="v2-tab-content">
                        {recommendation && activeTab !== "askai" && activeTab !== "history" && (
                            <a href={`/web/lessons/${recommendation.lesson_id}`} className="v2-next-banner">
                                <div>
                                    <span className="v2-next-label">Up Next</span>
                                    <span className="v2-next-title">{recommendation.title}</span>
                                </div>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                        )}

                        {activeTab === "problem" && (
                            <div className="v2-content-body">
                                <p className="v2-description">{lesson.description}</p>
                                {taskTips.length > 0 ? (
                                    <div className="v2-task-list">
                                        {taskTips.map((t, i) => (
                                            <div key={t.tip_id} className="v2-task-item">
                                                <span className="v2-task-num">{i + 1}</span>
                                                <span className="v2-task-msg">{t.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="v2-empty">No task available yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === "example" && (
                            <div className="v2-content-body">
                                {exampleTips.length > 0
                                    ? exampleTips.map(t => (
                                        <div key={t.tip_id} className="v2-code-block">
                                            <div className="v2-code-header">
                                                <span>Example</span>
                                                <span style={{ color: langStyle.color }}>{lesson.language}</span>
                                            </div>
                                            <pre className="v2-code-pre">{t.message}</pre>
                                        </div>
                                    ))
                                    : <p className="v2-empty">No example available yet.</p>
                                }
                            </div>
                        )}

                        {activeTab === "hints" && (
                            <div className="v2-content-body">
                                {hintTips.length > 0
                                    ? hintTips.map((t, i) => (
                                        <div key={t.tip_id} className="v2-hint-card">
                                            <span className="v2-hint-num">Hint {i + 1}</span>
                                            <p>{t.message}</p>
                                        </div>
                                    ))
                                    : <p className="v2-empty">No hints available yet.</p>
                                }
                            </div>
                        )}

                        {activeTab === "theory" && (
                            <div className="v2-content-body">
                                {lesson.content
                                    ? renderTheory(lesson.content)
                                    : <p className="v2-empty">No content available yet.</p>
                                }
                            </div>
                        )}

                        {activeTab === "askai" && (
                            <div className="v2-chat-root">
                                <div className="v2-chat-messages">
                                    {chatMessages.length === 0 && (
                                        <div className="v2-chat-empty">
                                            <span>🤖</span>
                                            <p>Ask me anything about this lesson.<br/>I won't give you the solution — but I'll help you think it through.</p>
                                        </div>
                                    )}
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`v2-chat-msg ${msg.role === "user" ? "v2-chat-user" : "v2-chat-ai"}`}>
                                            <span className="v2-chat-bubble">{msg.text}</span>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="v2-chat-msg v2-chat-ai">
                                            <span className="v2-chat-bubble v2-chat-typing">Thinking...</span>
                                        </div>
                                    )}
                                </div>
                                <div className="v2-chat-inputrow">
                                    <input
                                        className="v2-chat-input"
                                        placeholder="Ask a question..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && sendHint()}
                                        disabled={chatLoading}
                                    />
                                    <button className="v2-chat-send" onClick={sendHint} disabled={chatLoading || !chatInput.trim()}>
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="v2-content-body">
                                {submissions.length === 0 ? (
                                    <p className="v2-empty">No submissions yet. Submit your code to see your history here.</p>
                                ) : (
                                    <div className="v2-history-list">
                                        {submissions.map((sub, i) => (
                                            <div key={sub.submission_id} className="v2-history-item">
                                                <div className="v2-history-header" onClick={() => setExpandedSubmission(expandedSubmission === sub.submission_id ? null : sub.submission_id)}>
                                                    <span className="v2-history-num">Attempt {submissions.length - i}</span>
                                                    <span className="v2-history-date">{sub.submitted_at}</span>
                                                    <span className="v2-history-chevron">{expandedSubmission === sub.submission_id ? "▲" : "▼"}</span>
                                                </div>
                                                {expandedSubmission === sub.submission_id && (
                                                    <pre className="v2-history-code">{sub.code}</pre>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right panel */}
                <div className="v2-right">
                    <div className="v2-editor-topbar">
                        <div className="v2-file-tab">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6"/></svg>
                            solution.{lesson.language === "javascript" ? "js" : lesson.language === "java" ? "java" : lesson.language === "cpp" ? "cpp" : lesson.language === "c" ? "c" : "py"}
                        </div>
                    </div>
                    <div className="v2-editor-wrap">
                        <Editor
                            height="100%"
                            language={MONACO_LANG_MAP[lesson.language?.toLowerCase()] || "python"}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontLigatures: true }}
                        />
                    </div>
                    <div className="v2-output">
                        <div className="v2-output-header">
                            <span className="v2-output-label">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 17l6-6-6-6M12 19h8"/></svg>
                                Output
                            </span>
                            {output && <span className={`v2-output-status ${output.success ? "v2-status-ok" : "v2-status-err"}`}>{output.success ? "● Passed" : "● Error"}</span>}
                        </div>
                        <pre className={`v2-output-pre ${output && !output.success ? "v2-output-error" : ""}`}>
                            {running ? "Running..." : output?.text || "Click ▶ Run to execute your code"}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="v2-bottombar">
                {recommendation ? (
                    <a href={`/web/lessons/${recommendation.lesson_id}`} className="v2-bottom-next">
                        Next: {recommendation.title} →
                    </a>
                ) : <div />}
                <div className="v2-bottom-actions">
                    <button className="v2-run-btn" onClick={runCode} disabled={running}>
                        {running
                            ? <><span className="v2-btn-spinner" /> Running...</>
                            : <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Run</>
                        }
                    </button>
                    <button className="v2-submit-btn" onClick={submitProgress} disabled={submitting}>
                        {submitting
                            ? <><span className="v2-btn-spinner" /> Reviewing...</>
                            : <><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/></svg> Submit</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
