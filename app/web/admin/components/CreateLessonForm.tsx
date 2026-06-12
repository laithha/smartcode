"use client";
import { useState } from "react";
import type { CreateLessonForm } from "../utils";
import { inputStyle } from "../utils";

interface Props {
    onCreated: () => void;
}

const EMPTY_FORM: CreateLessonForm = { title: "", description: "", content: "", language: "python", difficulty: "beginner", duration: "" };

export default function CreateLessonForm({ onCreated }: Props) {
    const [form, setForm] = useState<CreateLessonForm>(EMPTY_FORM);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!form.title || !form.description || !form.content || !form.duration) {
            setError("All fields are required."); return;
        }
        setLoading(true);
        const token = localStorage.getItem("token")!;
        const res = await fetch("http://localhost:8000/lessons", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, duration: parseInt(form.duration) }),
        });
        setLoading(false);
        if (!res.ok) { setError("Failed to create lesson."); return; }
        setSuccess("Lesson created successfully!");
        setForm(EMPTY_FORM);
        onCreated();
    };

    const set = (key: keyof CreateLessonForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [key]: e.target.value }));

    return (
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px #6366f110", padding: 28 }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800, color: "#1e1b4b" }}>Add New Lesson</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <input placeholder="Title" value={form.title} onChange={set("title")} style={inputStyle} />
                    <input placeholder="Duration (minutes)" type="number" value={form.duration} onChange={set("duration")} style={inputStyle} />
                </div>
                <input placeholder="Description" value={form.description} onChange={set("description")} style={inputStyle} />
                <textarea placeholder="Content (lesson instructions)" value={form.content} onChange={set("content")} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <select value={form.language} onChange={set("language")} style={inputStyle}>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                    </select>
                    <select value={form.difficulty} onChange={set("difficulty")} style={inputStyle}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}
                {success && <p style={{ color: "#16a34a", fontSize: 13, margin: 0 }}>{success}</p>}
                <button type="submit" disabled={loading} style={{ padding: "11px 28px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, background: "#6366f1", color: "#fff", alignSelf: "flex-start", opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Creating..." : "Create Lesson"}
                </button>
            </form>
        </div>
    );
}
