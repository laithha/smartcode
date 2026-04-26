"use client";
import { useState } from "react";
import "./style.css";
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
      toast.error(data.message || "Error creating account");
      return;
    }

    toast.success("Account created");
    setDone(true);
    setTimeout(() => router.push("/web/login"), 700);
  }

  return (
    <div className="login-bg">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: done ? 0 : 1, y: done ? -10 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>
          <p className="signup">
            Already have an account? <a href="/web/login">Login here</a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}