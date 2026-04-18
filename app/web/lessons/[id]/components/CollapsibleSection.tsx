"use client";
import { useState } from "react";

interface Props {
    icon: string;
    title: string;
    children: React.ReactNode;
}

export default function CollapsibleSection({ icon, title, children }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <div className="collapsible-section">
            <button className="collapsible-header" onClick={() => setOpen(!open)}>
                <h2>{icon} {title}</h2>
                <span className={`arrow ${open ? "arrow-open" : ""}`}>▶</span>
            </button>
            {open && <div className="collapsible-content">{children}</div>}
        </div>
    );
}
