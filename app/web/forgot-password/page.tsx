"use client";
import { useState } from "react";
import { API_URL } from "@/app/lib/api";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_URL}/forgot-password`, {
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
    router.push(`/web/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="d1-root">
      <div className="d1-card">
        <p className="d1-logo">SmartCode</p>
        <h1 className="d1-heading">Forgot password?</h1>
        <p className="d1-sub">Enter your email and we&apos;ll send you a 6-digit reset code.</p>

        <form className="d1-form" onSubmit={handleSubmit}>
          <div className="d1-field">
            <label className="d1-label">Email</label>
            <input
              className="d1-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="d1-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <p className="d1-footer">
            Remember your password? <a href="/web/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
