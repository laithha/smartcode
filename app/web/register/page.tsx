"use client";
import { useState } from "react";
import { API_URL } from "@/app/lib/api";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch(`${API_URL}/register`, {
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
    router.push(`/web/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="d1-root">
      <div className="d1-card">
        <p className="d1-logo">SmartCode</p>
        <h1 className="d1-heading">Create account</h1>
        <p className="d1-sub">Join SmartCode and start learning today.</p>

        <form className="d1-form" onSubmit={handleSubmit}>
          <div className="d1-field">
            <label className="d1-label">Email</label>
            <input
              className="d1-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="d1-field">
            <label className="d1-label">Password</label>
            <input
              className="d1-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d1-field">
            <label className="d1-label">Confirm Password</label>
            <input
              className="d1-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button className="d1-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="d1-footer">
            Already have an account? <a href="/web/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
