"use client";
import { useState } from "react";
import { API_URL } from "@/app/lib/api";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.detail || "Invalid email or password");
      return;
    }
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    toast.success("Login successful");
    const userRes = await fetch(`${API_URL}/users/${data.user_id}`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const userData = await userRes.json();
    const isAdmin = userData.user?.is_admin === true;
    router.replace(isAdmin ? "/web/admin" : "/");
  };

  return (
    <div className="d1-root">
      <div className="d1-card">
        <p className="d1-logo">SmartCode</p>
        <h1 className="d1-heading">Welcome back</h1>
        <p className="d1-sub">Sign in to continue your learning journey.</p>

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
          <div className="d1-row">
            <a href="/web/forgot-password" className="d1-forgot">Forgot password?</a>
          </div>
          <button className="d1-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="d1-footer">
            Don&apos;t have an account? <a href="/web/register">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}
