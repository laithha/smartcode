import { NextRequest, NextResponse } from "next/server";

const LANGUAGE_IDS: Record<string, number> = {
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
    cpp: 54,
};

export async function POST(req: NextRequest) {
    const { code, language } = await req.json();

    const languageId = LANGUAGE_IDS[language?.toLowerCase()] ?? 71;

    const submitRes = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY ?? "",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
            source_code: code,
            language_id: languageId,
        }),
    });

    const result = await submitRes.json();

    if (result.stderr) {
        return NextResponse.json({ success: false, error: result.stderr });
    }

    if (result.compile_output) {
        return NextResponse.json({ success: false, error: result.compile_output });
    }

    return NextResponse.json({ success: true, output: result.stdout ?? "No output" });
}
