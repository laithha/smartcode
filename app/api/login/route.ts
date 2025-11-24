import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "db_smartcode",
  password: "admin",
  port: 5432,
});

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 401 }
      );
    }
    const user = result.rows[0];
    const isvalid = await bcrypt.compare(password, user.password_hash);
    if (!isvalid){
      return NextResponse.json(
        {message : "incorrect password"},
        {status : 401}
      );
    }

    return NextResponse.json(
      { message: "Login successful", user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}