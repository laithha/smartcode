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

interface GeneratedContent {
    explanation: string;
    problem: string;
    example: string;
    hints: string[];
}

export default function LessonPage() {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [tips, setTips] = useState<{ tip_id: number; category: string; message: string }[]>([]);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [running, setRunning] = useState(false);

    // Collapsible section toggles
    const [showProblem, setShowProblem] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [hintsRevealed, setHintsRevealed] = useState(0);

    const { id } = useParams();

    useEffect(() => {
        const fetchLesson = async () => {
            const res = await fetch(`/api/lessons/${id}`);
            const data = await res.json();
            setLesson(data);

            const res2 = await fetch(`/api/tips?lesson_id=${id}`);
            const data2 = await res2.json();
            setTips(Array.isArray(data2) ? data2 : []);

            setLoading(false);

            // Fetch AI-generated content
            setGenerating(true);
            try {
                const aiRes = await fetch("/api/generate-lesson", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: data.title,
                        language: data.language,
                    }),
                });
                const aiData = await aiRes.json();
                if (!aiData.error) {
                    setGeneratedContent(aiData);
                }
            } catch (error) {
                console.error("Failed to generate lesson content:", error);
            } finally {
                setGenerating(false);
            }
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

                    {/* AI-Generated Explanation */}
                    <div className="lesson-body">
                        <h2>📖 Lesson Content</h2>
                        <div className="content-text">
                            {generating ? (
                                <div className="generating-loader">
                                    <div className="spinner"></div>
                                    <p>AI is generating your lesson content...</p>
                                </div>
                            ) : generatedContent ? (
                                generatedContent.explanation
                            ) : (
                                lesson.content || "No content available yet."
                            )}
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
                                {generating ? (
                                    <p className="generating-text">Generating problem...</p>
                                ) : generatedContent ? (
                                    <p>{generatedContent.problem}</p>
                                ) : (
                                    <p>Write code in the editor on the right to practice what you learned.</p>
                                )}
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
                                {generating ? (
                                    <p className="generating-text">Generating example...</p>
                                ) : generatedContent ? (
                                    <pre className="example-code">{generatedContent.example}</pre>
                                ) : (
                                    <p>No example available yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Collapsible Hints Section */}
                    <div className="collapsible-section">
                        <button
                            className="collapsible-header"
                            onClick={() => setHintsRevealed(hintsRevealed === 0 ? 1 : hintsRevealed)}
                        >
                            <h2>💡 Hints</h2>
                            <span className={`arrow ${hintsRevealed > 0 ? "arrow-open" : ""}`}>▶</span>
                        </button>
                        {hintsRevealed > 0 && generatedContent && (
                            <div className="collapsible-content">
                                {generatedContent.hints.slice(0, hintsRevealed).map((hint, index) => (
                                    <div key={index} className="hint-card">
                                        <span className="hint-number">Hint {index + 1}</span>
                                        <p>{hint}</p>
                                    </div>
                                ))}
                                {hintsRevealed < generatedContent.hints.length && (
                                    <button
                                        className="reveal-hint-btn"
                                        onClick={() => setHintsRevealed(hintsRevealed + 1)}
                                    >
                                        Reveal next hint ({hintsRevealed}/{generatedContent.hints.length})
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tips from database */}
                    {tips.length > 0 && (
                        <div className="lesson-tips">
                            <h2>� Tips</h2>
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
                        <p className="ai-placeholder">Submit your code to receive personalized feedback and suggestions from AI.</p>
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
                            <button className="submit-btn">
                                Submit ✓
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