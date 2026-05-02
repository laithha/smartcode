import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_verification_email(to_email: str, code: str):
    sender = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASS")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "SmartCode — Verify your email"
    msg["From"] = sender
    msg["To"] = to_email

    html = f"""
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8f7ff;border-radius:12px;">
        <h1 style="color:#6366f1;font-size:20px;margin:0 0 8px;">SmartCode</h1>
        <h2 style="color:#1e1b4b;font-size:22px;margin:0 0 16px;">Verify your email</h2>
        <p style="color:#6b7280;font-size:15px;margin:0 0 24px;">Use the code below to complete your registration. It expires in <strong>15 minutes</strong>.</p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#1e1b4b;">{code}</span>
        </div>
        <p style="color:#9ca3af;font-size:13px;margin:0;">If you didn't create a SmartCode account, you can ignore this email.</p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.sendmail(sender, to_email, msg.as_string())
