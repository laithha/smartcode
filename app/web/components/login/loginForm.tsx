"use client";
import { useState } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded test login
    if (email === "laithhaj4@gmail.com" && password === "laithhaj0220") {
      toast.success("Login successful!");
      setTimeout(() => {
        router.push('/');
        }, 800);
    } else {
      toast.error("Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
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

        <p className="forgot">Forgot password?</p>
        <button type="submit">Login</button>
        <p className="signup">
          Don’t have an account? <a href="#">Click here</a>
        </p>
      </form>
    </div>
  );
}
