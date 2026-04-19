"use client";
import { useState } from "react";
import { User, th, td, btnSmall } from "../utils";
import ConfirmModal from "./ConfirmModal";

interface Props {
    users: User[];
    onDelete: (id: number) => void;
    onToggleAdmin: (id: number, current: boolean) => void;
}

export default function UsersTable({ users, onDelete, onToggleAdmin }: Props) {
    const [pendingDelete, setPendingDelete] = useState<User | null>(null);

    return (
        <>
            {pendingDelete && (
                <ConfirmModal
                    message={`This will permanently delete "${pendingDelete.email}".`}
                    onConfirm={() => { onDelete(pendingDelete.id); setPendingDelete(null); }}
                    onCancel={() => setPendingDelete(null)}
                />
            )}

            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px #6366f110", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f5f3ff" }}>
                            <th style={th}>ID</th>
                            <th style={th}>Email</th>
                            <th style={th}>Role</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                                <td style={td}>{u.id}</td>
                                <td style={td}>{u.email}</td>
                                <td style={td}>
                                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: u.is_admin ? "#f0fdf4" : "#f3f4f6", color: u.is_admin ? "#16a34a" : "#9ca3af" }}>
                                        {u.is_admin ? "Admin" : "User"}
                                    </span>
                                </td>
                                <td style={td}>
                                    <button onClick={() => onToggleAdmin(u.id, u.is_admin)} style={{ ...btnSmall, background: "#ede9fe", color: "#6366f1", marginRight: 8 }}>
                                        {u.is_admin ? "Revoke Admin" : "Make Admin"}
                                    </button>
                                    <button onClick={() => setPendingDelete(u)} style={{ ...btnSmall, background: "#fef2f2", color: "#dc2626" }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
