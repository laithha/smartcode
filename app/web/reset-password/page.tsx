"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || (typeof window !== "undefined" ? localStorage.getItem("reset_email") : "") || "";

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...digits];
    updated[i] = value.slice(-1);
    setDigits(updated);
    if (value && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { toast.error("Enter the full 6-digit code"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const res = await fetch("http://localhost:8000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, new_password: password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(data.detail || "Something went wrong");
      return;
    }
    toast.success("Password reset! Redirecting to login...");
    localStorage.removeItem("reset_email");
    router.push("/web/login");
  };

  return (
    <div className="d1-root">
      <div className="d1-card">
        <p className="d1-logo">SmartCode</p>
        <h1 className="d1-heading">Reset your password</h1>
        <p className="d1-sub">
          Enter the 6-digit code sent to <strong>{email || "your email"}</strong> and choose a new password.
        </p>

        <form className="d1-form" onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "8px 0 8px" }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                className="d1-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: "48px",
                  height: "56px",
                  textAlign: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  padding: "0",
                }}
              />
            ))}
          </div>

          <div className="d1-field">
            <label className="d1-label">New Password</label>
            <input
              className="d1-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              required
            />
          </div>
          <button className="d1-btn" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          <p className="d1-footer">
            Wrong email? <a href="/web/forgot-password">Go back</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
