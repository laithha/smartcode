"use client";
import { useState } from "react";
import "../login/style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.detail || "Error creating account");
      return;
    }

    toast.success("Account created! Check your email for the verification code.");
    localStorage.setItem("verify_email", email);
    setDone(true);
    setTimeout(() => router.push(`/web/verify-email?email=${encodeURIComponent(email)}`), 700);
  }

  return (
    <div className="lv2-root">

      {/* Left — form */}
      <motion.div
        className="lv2-left"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: done ? 0 : 1, x: done ? -10 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="lv2-logo">SmartCode</p>

        <h1 className="lv2-heading">Create account</h1>
        <p className="lv2-sub">Join SmartCode and start learning today.</p>

        <form className="lv2-form" onSubmit={handleSubmit}>
          <div className="lv2-field">
            <label className="lv2-label">Email</label>
            <input
              className="lv2-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="lv2-field">
            <label className="lv2-label">Password</label>
            <input
              className="lv2-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="lv2-field">
            <label className="lv2-label">Confirm Password</label>
            <input
              className="lv2-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button className="lv2-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="lv2-footer">
            Already have an account? <a href="/web/login">Sign in</a>
          </p>
        </form>
      </motion.div>

      {/* Right — decorative panel */}
      <div className="lv2-right">
        <div className="lv2-blob1" />
        <div className="lv2-blob2" />

        <h2 className="lv2-tagline">Start your journey.</h2>
        <p className="lv2-tagline-sub">Write real code, get AI feedback, and track your progress — all in one place.</p>

        <div className="lv2-cards">
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Real Code Editor</p>
              <p className="lv2-card-desc">Write and run code directly in the browser with Monaco Editor.</p>
            </div>
          </div>
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">AI-Powered Review</p>
              <p className="lv2-card-desc">Get instant feedback on your solutions from Claude AI.</p>
            </div>
          </div>
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 17l4-8 4 4 4-6 4 10"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Track Your Progress</p>
              <p className="lv2-card-desc">Monitor streaks, completion rates, and lesson history.</p>
            </div>
          </div>
        </div>

        <div className="lv2-pills">
          <span className="lv2-pill">Python</span>
          <span className="lv2-pill">JavaScript</span>
          <span className="lv2-pill">Java</span>
          <span className="lv2-pill">C / C++</span>
        </div>
      </div>

    </div>
  );
}
