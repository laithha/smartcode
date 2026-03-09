import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"



const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "db_smartcode",
    password: "admin",
    port: 5432,
})


export async function GET(req: NextRequest) {
    try {
        const lesson_id = req.nextUrl.searchParams.get("lesson_id");
        const result = await pool.query("SELECT * FROM tips WHERE lesson_id = $1", [lesson_id])
        return NextResponse.json(result.rows)
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch tips" }, { status: 500 })
    }
}