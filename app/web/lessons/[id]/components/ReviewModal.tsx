"use client";

interface ReviewResult {
    verdict: string;
    ai_solution: string;
    advice: string;
}

interface Props {
    result: ReviewResult;
    code: string;
    onClose: () => void;
}

export default function ReviewModal({ result, code, onClose }: Props) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className={`modal-header ${result.verdict === "CORRECT" ? "modal-correct" : "modal-incorrect"}`}>
                    <h2>{result.verdict === "CORRECT" ? "✅ Correct!" : "❌ Incorrect"}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-solutions">
                    <div className="solution-column">
                        <h3>🤖 AI Solution</h3>
                        <pre className="solution-code">{result.ai_solution}</pre>
                    </div>
                    <div className="solution-divider" />
                    <div className="solution-column">
                        <h3>👤 Your Solution</h3>
                        <pre className="solution-code">{code}</pre>
                    </div>
                </div>
                <div className="modal-advice">
                    <h3>💡 Advice</h3>
                    <p>{result.advice}</p>
                </div>
            </div>
        </div>
    );
}
