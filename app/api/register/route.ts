import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "db_smartcode",
  password: "admin",
  port: 5432,
})

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { message: "the password must be longer than 4 characters" },
        { status: 400 }
      )
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    )

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return NextResponse.json(
        { message: "email already in use" },
        { status: 409 }
      )
    }

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    )

    return NextResponse.json(
      { message: "User registered", user: result.rows[0] },
      { status: 201 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "server error" }, { status: 500 })
  }
}
