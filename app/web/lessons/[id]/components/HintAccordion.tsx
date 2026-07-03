"use client";
import { useState } from "react";
import { Tip } from "../utils";

export default function HintAccordion({ hints }: { hints: Tip[] }) {
    // Each hint is collapsed by default; clicking its header reveals it.
    const [openIds, setOpenIds] = useState<Set<number>>(new Set());

    const toggle = (id: number) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="v2-content-body">
            {hints.map((t, i) => {
                const open = openIds.has(t.tip_id);
                return (
                    <div key={t.tip_id} className={`v2-hint-card ${open ? "v2-hint-open" : ""}`}>
                        <button
                            type="button"
                            className="v2-hint-toggle"
                            onClick={() => toggle(t.tip_id)}
                            aria-expanded={open}
                        >
                            <span className="v2-hint-num">Hint {i + 1}</span>
                            <span className="v2-hint-chevron">{open ? "▲" : "▼"}</span>
                        </button>
                        {open && <p className="v2-hint-text">{t.message}</p>}
                    </div>
                );
            })}
        </div>
    );
}
