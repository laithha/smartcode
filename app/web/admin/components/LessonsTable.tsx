"use client";
import { useState } from "react";
import { Lesson, LANG_COLORS, DIFF_CONFIG, th, td, btnSmall } from "../utils";
import ConfirmModal from "./ConfirmModal";

interface Props {
    lessons: Lesson[];
    onDelete: (id: number) => void;
}

export default function LessonsTable({ lessons, onDelete }: Props) {
    const [pendingDelete, setPendingDelete] = useState<Lesson | null>(null);

    return (
        <>
            {pendingDelete && (
                <ConfirmModal
                    message={`This will permanently delete "${pendingDelete.title}".`}
                    onConfirm={() => { onDelete(pendingDelete.lesson_id); setPendingDelete(null); }}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px #6366f110", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f5f3ff" }}>
                            <th style={th}>ID</th>
                            <th style={th}>Title</th>
                            <th style={th}>Language</th>
                            <th style={th}>Difficulty</th>
                            <th style={th}>Duration</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map(l => {
                            const lc = LANG_COLORS[l.language?.toLowerCase()] ?? { color: "#6366f1", bg: "#eef2ff" };
                            const dc = DIFF_CONFIG[l.difficulty?.toLowerCase()] ?? { color: "#6b7280", bg: "#f9fafb" };
                            return (
                                <tr key={l.lesson_id} style={{ borderTop: "1px solid #f3f4f6" }}>
                                    <td style={td}>{l.lesson_id}</td>
                                    <td style={{ ...td, fontWeight: 600 }}>{l.title}</td>
                                    <td style={td}><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: lc.bg, color: lc.color }}>{l.language}</span></td>
                                    <td style={td}><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: dc.bg, color: dc.color }}>{l.difficulty}</span></td>
                                    <td style={td}>{l.duration} min</td>
                                    <td style={td}>
                                        <button onClick={() => setPendingDelete(l)} style={{ ...btnSmall, background: "#fef2f2", color: "#dc2626" }}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
