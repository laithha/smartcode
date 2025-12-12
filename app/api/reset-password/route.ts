import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "db_smartcode",
    password: "admin",
    port: 5432,
});

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 4) {
            return NextResponse.json(
                { message: "Password must be at least 4 characters" },
                { status: 400 }
            );
        }

        const tokenResult = await pool.query(
            `SELECT * FROM password_reset_tokens 
             WHERE token = $1 AND used = FALSE AND expires_at > NOW()`,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return NextResponse.json(
                { message: "Invalid or expired reset link" },
                { status: 400 }
            );
        }

        const resetToken = tokenResult.rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password_hash = $1 WHERE id = $2",
            [hashedPassword, resetToken.user_id]
        );

        await pool.query(
            "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
            [resetToken.id]
        );

        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Reset password error:", err);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
