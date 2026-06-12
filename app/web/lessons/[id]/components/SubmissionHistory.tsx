"use client";
import { useState } from "react";
import { Submission } from "../utils";

interface Props {
    submissions: Submission[];
}

export default function SubmissionHistory({ submissions }: Props) {
    const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);

    if (submissions.length === 0) {
        return <p className="v2-empty">No submissions yet. Submit your code to see your history here.</p>;
    }

    return (
        <div className="v2-history-list">
            {submissions.map((sub, i) => (
                <div key={sub.submission_id} className="v2-history-item">
                    <div
                        className="v2-history-header"
                        onClick={() => setExpandedSubmission(expandedSubmission === sub.submission_id ? null : sub.submission_id)}
                    >
                        <span className="v2-history-num">Attempt {submissions.length - i}</span>
                        <span className="v2-history-date">{sub.submitted_at}</span>
                        <span className="v2-history-chevron">{expandedSubmission === sub.submission_id ? "▲" : "▼"}</span>
                    </div>
                    {expandedSubmission === sub.submission_id && (
                        <pre className="v2-history-code">{sub.code}</pre>
                    )}
                </div>
            ))}
        </div>
    );
}
