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
        <div className="rm-overlay" onClick={onClose}>
            <div className="rm-box" onClick={(e) => e.stopPropagation()}>

                <div className="rm-header rm-header-neutral">
                    <div className="rm-header-left">
                        <span className="rm-verdict-icon">🤖</span>
                        <div>
                            <p className="rm-verdict-label">AI Review</p>
                            <h2 className="rm-verdict-title">Code Feedback</h2>
                        </div>
                    </div>
                    <button className="rm-close" onClick={onClose}>✕</button>
                </div>

                <div className="rm-grid">
                    <div className="rm-col">
                        <div className="rm-col-header">
                            <span className="rm-col-dot rm-dot-purple" />
                            Your Solution
                        </div>
                        <pre className="rm-code">{code}</pre>
                    </div>
                    <div className="rm-divider" />
                    <div className="rm-col">
                        <div className="rm-col-header">
                            <span className="rm-col-dot rm-dot-blue" />
                            AI Solution
                        </div>
                        <pre className="rm-code">{result.ai_solution}</pre>
                    </div>
                </div>

                <div className="rm-advice">
                    <p className="rm-advice-label">Feedback</p>
                    <p className="rm-advice-text">{result.advice}</p>
                </div>

                <div className="rm-footer">
                    <button className="rm-close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
