"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "./style.css";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function ResetPasswordContent() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 4) {
            toast.error("Password must be at least 4 characters");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            toast.error(data.message || "Something went wrong");
            return;
        }

        toast.success("Password reset successful!");
        setDone(true);
        setTimeout(() => router.push("/web/login"), 1500);
    };

    if (!token) {
        return (
            <div className="login-bg">
                <motion.div
                    className="login-container"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <h2>Invalid Link</h2>
                    <p className="error-text">This reset link is invalid or has expired.</p>
                    <p className="signup">
                        <a href="/web/forgot-password">Request a new reset link</a>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="login-bg">
            <motion.div
                className="login-container"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: done ? 0 : 1, y: done ? -10 : 0 }}
                transition={{ duration: 0.35 }}
            >
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <p className="signup">
                        <a href="/web/login">← Back to Login</a>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
