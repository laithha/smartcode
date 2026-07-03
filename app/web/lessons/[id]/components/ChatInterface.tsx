"use client";
import { API_URL } from "@/app/lib/api";
import { ChatMessage, Lesson } from "../utils";

interface Props {
    lesson: Lesson;
    lessonTask: string;
    chatMessages: ChatMessage[];
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    chatInput: string;
    setChatInput: (value: string) => void;
    chatLoading: boolean;
    setChatLoading: (value: boolean) => void;
}

export default function ChatInterface({
    lesson,
    lessonTask,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    setChatLoading,
}: Props) {

    const sendHint = async () => {
        if (!chatInput.trim() || chatLoading) return;
        const token = localStorage.getItem("token");
        const question = chatInput.trim();
        const newMessages: ChatMessage[] = [...chatMessages, { role: "user", text: question }];
        setChatMessages(newMessages);
        setChatInput("");
        setChatLoading(true);
        try {
            const history = chatMessages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
            const res = await fetch(`${API_URL}/ai-hint`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    question,
                    lesson_title: lesson.title,
                    lesson_description: lesson.description,
                    lesson_task: lessonTask,
                    language: lesson.language,
                    conversation_history: history,
                }),
            });
            const data = await res.json();
            setChatMessages([...newMessages, { role: "ai", text: data.answer }]);
        } catch {
            setChatMessages([...newMessages, { role: "ai", text: "Sorry, I couldn't respond. Please try again." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="v2-chat-root">
            <div className="v2-chat-messages">
                {chatMessages.length === 0 && (
                    <div className="v2-chat-empty">
                        <span>🤖</span>
                        <p>Ask me anything about this lesson.<br />I won&apos;t give you the solution — but I&apos;ll help you think it through.</p>
                    </div>
                )}
                {chatMessages.map((msg, i) => (
                    <div key={i} className={`v2-chat-msg ${msg.role === "user" ? "v2-chat-user" : "v2-chat-ai"}`}>
                        <span className="v2-chat-bubble">{msg.text}</span>
                    </div>
                ))}
                {chatLoading && (
                    <div className="v2-chat-msg v2-chat-ai">
                        <span className="v2-chat-bubble v2-chat-typing">Thinking...</span>
                    </div>
                )}
            </div>
            <div className="v2-chat-inputrow">
                <input
                    className="v2-chat-input"
                    placeholder="Ask a question..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendHint()}
                    disabled={chatLoading}
                />
                <button className="v2-chat-send" onClick={sendHint} disabled={chatLoading || !chatInput.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
}
