export interface User {
    id: number;
    email: string;
    is_admin: boolean;
}

export interface Lesson {
    lesson_id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: number;
}

export interface CreateLessonForm {
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: string;
}

export const LANG_COLORS: Record<string, { color: string; bg: string }> = {
    python:     { color: "#3b82f6", bg: "#eff6ff" },
    javascript: { color: "#d97706", bg: "#fffbeb" },
    java:       { color: "#dc2626", bg: "#fef2f2" },
    c:          { color: "#7c3aed", bg: "#f5f3ff" },
    cpp:        { color: "#0891b2", bg: "#ecfeff" },
};

export const DIFF_CONFIG: Record<string, { color: string; bg: string }> = {
    beginner:     { color: "#16a34a", bg: "#f0fdf4" },
    intermediate: { color: "#d97706", bg: "#fffbeb" },
    advanced:     { color: "#dc2626", bg: "#fef2f2" },
};

export const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 };
export const td: React.CSSProperties = { padding: "12px 16px", fontSize: 14, color: "#374151" };
export const btnSmall: React.CSSProperties = { padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12 };
export const inputStyle: React.CSSProperties = { padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit", color: "#111827" };
