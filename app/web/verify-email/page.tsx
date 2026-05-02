"use client";
import { useState, useRef, useEffect } from "react";
import "../login/style.css";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || (typeof window !== "undefined" ? localStorage.getItem("verify_email") : "") || "";

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    const res = await fetch("http://localhost:8000/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setResending(false);
    if (!res.ok) {
      toast.error(data.detail || "Failed to resend");
    } else {
      toast.success("New code sent!");
      setCooldown(60);
    }
  };

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

    setLoading(true);
    const res = await fetch("http://localhost:8000/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.detail || "Invalid code");
      return;
    }

    toast.success("Email verified! Redirecting to login...");
    setDone(true);
    setTimeout(() => router.push("/web/login"), 800);
  };

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

        <h1 className="lv2-heading">Verify your email</h1>
        <p className="lv2-sub">
          We sent a 6-digit code to <strong>{email || "your email"}</strong>. Enter it below to activate your account.
        </p>

        <form className="lv2-form" onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "8px 0 16px" }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                className="lv2-input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: "52px",
                  height: "60px",
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: 700,
                  padding: "0",
                  letterSpacing: 0,
                }}
              />
            ))}
          </div>

          <button className="lv2-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <p className="lv2-footer">
            Wrong email? <a href="/web/register">Go back</a>
          </p>
          <p className="lv2-footer">
            Didn't receive it?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              style={{ background: "none", border: "none", color: "inherit", cursor: cooldown > 0 ? "default" : "pointer", padding: 0, textDecoration: "underline", fontSize: "inherit" }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
            </button>
          </p>
        </form>
      </motion.div>

      {/* Right — decorative panel */}
      <div className="lv2-right">
        <div className="lv2-blob1" />
        <div className="lv2-blob2" />

        <h2 className="lv2-tagline">One last step.</h2>
        <p className="lv2-tagline-sub">Verify your email to secure your account and start learning.</p>

        <div className="lv2-cards">
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Check your inbox</p>
              <p className="lv2-card-desc">The code was sent to your email. It expires in 15 minutes.</p>
            </div>
          </div>
          <div className="lv2-card">
            <div className="lv2-card-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div>
              <p className="lv2-card-title">Secure your account</p>
              <p className="lv2-card-desc">Email verification keeps your account protected.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
