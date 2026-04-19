"use client";
import { useState } from "react";
import { useAdmin } from "./hooks/useAdmin";
import UsersTable from "./components/UsersTable";
import LessonsTable from "./components/LessonsTable";
import CreateLessonForm from "./components/CreateLessonForm";

export default function AdminPage() {
    const [tab, setTab] = useState<"users" | "lessons">("users");
    const { users, lessons, loading, deleteUser, toggleAdmin, deleteLesson, refetchLessons } = useAdmin();

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7ff" }}>
                <p style={{ color: "#6366f1", fontWeight: 600 }}>Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f8f7ff", fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div style={{ background: "#fff", borderBottom: "1px solid #ede9fe", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: 2, textTransform: "uppercase" }}>SmartCode</span>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e1b4b" }}>Admin Panel</h1>
                </div>
                <a href="/web/lessons" style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>← Back to Lessons</a>
            </div>

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px" }}>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                    {(["users", "lessons"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: "8px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                            background: tab === t ? "#6366f1" : "#ede9fe",
                            color: tab === t ? "#fff" : "#6366f1",
                            transition: "all 0.2s",
                        }}>
                            {t === "users" ? `Users (${users.length})` : `Lessons (${lessons.length})`}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {tab === "users" && (
                    <UsersTable users={users} onDelete={deleteUser} onToggleAdmin={toggleAdmin} />
                )}

                {tab === "lessons" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <LessonsTable lessons={lessons} onDelete={deleteLesson} />
                        <CreateLessonForm onCreated={refetchLessons} />
                    </div>
                )}

            </div>
        </div>
    );
}
