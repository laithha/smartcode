"use client";

interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={onCancel}>
            <div style={{ background: "#fff", borderRadius: 14, padding: "32px 28px", maxWidth: 380, width: "90%", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", textAlign: "center" }}
                onClick={e => e.stopPropagation()}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#1e1b4b" }}>Are you sure?</h3>
                <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6b7280" }}>{message}</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button onClick={onCancel} style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
