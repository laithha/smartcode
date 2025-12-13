"use client";
import { useState } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.message || "Invalid email or password");
      return;
    }

    localStorage.setItem("token", data.token);
    toast.success("Login successful");
    setDone(true);
    setTimeout(() => router.replace("/"), 700);
  };

  return (
    <div className="login-bg">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: done ? 0 : 1, y: done ? -10 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="/web/forgot-password" className="forgot">Forgot password?</a>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="signup">
            Don't have an account? <a href="/web/register">Click here</a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
