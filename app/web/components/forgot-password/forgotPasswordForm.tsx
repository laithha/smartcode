"use client";
import { useState } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.message || "Something went wrong");
            return;
        }

        toast.success("Check your email!");
        setEmailSent(true);
    };

    return (
        <div className="login-bg">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <h2>Forgot Password</h2>
                {!emailSent ? (
                    <form onSubmit={handleSubmit}>
                        <p className="subtitle">
                            Enter your email and we'll send you a reset link
                        </p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        <p className="signup">
                            Remember your password? <a href="/web/login">Login here</a>
                        </p>
                    </form>
                ) : (
                    <div className="success-box">
                        <p className="success-text">📧 Check your email!</p>
                        <p className="dev-note">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="dev-note">
                            The link will expire in 1 hour.
                        </p>
                        <p className="signup" style={{ marginTop: "2rem" }}>
                            Didn't receive the email?{" "}
                            <a href="#" onClick={(e) => { e.preventDefault(); setEmailSent(false); }}>
                                Try again
                            </a>
                        </p>
                        <p className="signup">
                            <a href="/web/login">← Back to Login</a>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
