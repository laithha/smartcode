import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "db_smartcode",
    password: "admin",
    port: 5432,
})


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const result = await pool.query(" SELECT * FROM lessons WHERE lesson_id = $1", [id]);
    if (result.rows.length == 0) {
        return NextResponse.json(
            { error: "lessons not found" },
            { status: 404 }
        )
    }
    else {
        return NextResponse.json(result.rows[0])
    }
}
