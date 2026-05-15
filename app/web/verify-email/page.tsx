"use client";
import { useState, useRef, useEffect } from "react";
import "./style.css";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
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
    router.push("/web/login");
  };

  return (
    <div className="d1-root">
      <div className="d1-card">
        <p className="d1-logo">SmartCode</p>
        <h1 className="d1-heading">Verify your email</h1>
        <p className="d1-sub">
          We sent a 6-digit code to <strong>{email || "your email"}</strong>. Enter it below to activate your account.
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

          <button className="d1-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <p className="d1-footer">
            Wrong email? <a href="/web/register">Go back</a>
          </p>
          <p className="d1-footer">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              style={{ background: "none", border: "none", color: "#6366f1", cursor: cooldown > 0 ? "default" : "pointer", padding: 0, fontWeight: 600, fontSize: "inherit", textDecoration: "underline" }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
