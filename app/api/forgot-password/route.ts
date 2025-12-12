import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import nodemailer from "nodemailer";

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "db_smartcode",
    password: "admin",
    port: 5432,
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const userResult = await pool.query(
            "SELECT id, email FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { message: "If this email exists, a reset link has been sent" },
                { status: 200 }
            );
        }

        const user = userResult.rows[0];
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await pool.query(
            "DELETE FROM password_reset_tokens WHERE user_id = $1",
            [user.id]
        );

        await pool.query(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
            [user.id, token, expiresAt]
        );

        const resetLink = `http://localhost:3000/web/reset-password?token=${token}`;

        await transporter.sendMail({
            from: `"SmartCode" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password - SmartCode",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0a1930;">Reset Your Password</h2>
                    <p>You requested to reset your password for your SmartCode account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetLink}" style="display: inline-block; background: linear-gradient(90deg, #0070f3, #004aad); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                        Reset Password
                    </a>
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">
                        This link will expire in 1 hour.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="color: #999; font-size: 12px;">SmartCode - Learn to code interactively</p>
                </div>
            `,
        });

        return NextResponse.json(
            { message: "Password reset link sent to your email" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Forgot password error:", err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
