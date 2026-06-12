import React from "react";

export const MONACO_LANG_MAP: Record<string, string> = {
    python: "python", javascript: "javascript", java: "java",
    "c++": "cpp", cpp: "cpp", c: "c", "c#": "csharp",
    csharp: "csharp", ruby: "ruby", go: "go", rust: "rust",
    php: "php", typescript: "typescript",
};

export interface Lesson {
    lesson_id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: number;
}

export interface ReviewResult {
    verdict: string;
    ai_solution: string;
    advice: string;
}

export interface Recommendation {
    lesson_id: number;
    title: string;
    description: string;
    language: string;
    difficulty: string;
    duration: number;
}

export interface Tip {
    tip_id: number;
    category: string;
    message: string;
}

export interface Submission {
    submission_id: number;
    code: string;
    language: string;
    submitted_at: string;
}

export interface ChatMessage {
    role: "user" | "ai";
    text: string;
}

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

export function renderTheory(content: string) {
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
