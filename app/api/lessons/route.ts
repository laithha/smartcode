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
        const result = await pool.query("SELECT * FROM lessons");
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch lessons" },
            { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, description, content, language, difficulty, duration } = await req.json()

        const result = await pool.query(
            `INSERT INTO lessons (title, description, content, language, difficulty, duration) 
             VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [title, description, content, language, difficulty, duration]
        );
        return NextResponse.json({ message: "Lesson created successfully", lesson: result.rows[0] }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
    }
}