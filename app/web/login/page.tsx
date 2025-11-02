"use client";

import { useState } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // ✅ added for cleaner redirect

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success(data.message || "Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Network error");
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2 className="title">Welcome back</h2>
        <div className="subtitle">Sign in to access your SmartCode dashboard.</div>

        <form onSubmit={handleLogin}>
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="row">
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>
          </div>
        </form>

        <div className="small" style={{ marginTop: 14 }}>
          Don't have an account?{" "}
          <span className="link" onClick={() => toast("Signup soon!")}>
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
