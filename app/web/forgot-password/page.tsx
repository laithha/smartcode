"use client";
import { useState } from "react";
import "../login/style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:8000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.detail || "Something went wrong");
      return;
    }

    toast.success("Reset code sent! Check your email.");
    localStorage.setItem("reset_email", email);
    setDone(true);
    setTimeout(() => router.push(`/web/reset-password?email=${encodeURIComponent(email)}`), 800);
  };

  return (
    <div className="lv2-root">

      <motion.div
        className="lv2-left"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: done ? 0 : 1, x: done ? -10 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="lv2-logo">SmartCode</p>

        <h1 className="lv2-heading">Forgot password?</h1>
        <p className="lv2-sub">Enter your email and we'll send you a 6-digit reset code.</p>

        <form className="lv2-form" onSubmit={handleSubmit}>
          <div className="lv2-field">
            <label className="lv2-label">Email</label>
            <input
              className="lv2-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="lv2-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>

          <p className="lv2-footer">
            Remember your password? <a href="/web/login">Sign in</a>
          </p>
        </form>
      </motion.div>

      <div className="lv2-right">
        <div className="lv2-blob1" />
        <div className="lv2-blob2" />

        <h2 className="lv2-tagline">Happens to everyone.</h2>
        <p className="lv2-tagline-sub">We'll send a code to your email. It expires in 15 minutes.</p>

        <div className="lv2-cards">
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Check your inbox</p>
              <p className="lv2-card-desc">A 6-digit code will be sent to your email address.</p>
            </div>
          </div>
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Set a new password</p>
              <p className="lv2-card-desc">Enter the code and choose a new secure password.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
