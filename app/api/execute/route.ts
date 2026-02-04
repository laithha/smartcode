import { NextRequest, NextResponse } from "next/server";

// Piston API for code execution (free, 50+ languages)
const PISTON_API = "https://emkc.org/api/v2/piston";

// Map common language names to Piston language identifiers
const languageMap: { [key: string]: { language: string; version: string } } = {
    python: { language: "python", version: "3.10.0" },
    javascript: { language: "javascript", version: "18.15.0" },
    java: { language: "java", version: "15.0.2" },
    "c++": { language: "cpp", version: "10.2.0" },
    cpp: { language: "cpp", version: "10.2.0" },
    c: { language: "c", version: "10.2.0" },
    "c#": { language: "csharp", version: "6.12.0" },
    csharp: { language: "csharp", version: "6.12.0" },
    ruby: { language: "ruby", version: "3.0.1" },
    go: { language: "go", version: "1.16.2" },
    rust: { language: "rust", version: "1.68.2" },
    php: { language: "php", version: "8.2.3" },
    typescript: { language: "typescript", version: "5.0.3" },
    kotlin: { language: "kotlin", version: "1.8.20" },
    swift: { language: "swift", version: "5.3.3" },
};

export async function POST(req: NextRequest) {
    try {
        const { code, language } = await req.json();

        if (!code || !language) {
            return NextResponse.json(
                { message: "Code and language are required" },
                { status: 400 }
            );
        }

        // Get Piston language config
        const langConfig = languageMap[language.toLowerCase()];
        if (!langConfig) {
            return NextResponse.json(
                { message: `Language '${language}' is not supported` },
                { status: 400 }
            );
        }

        // Execute code via Piston API
        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    {
                        content: code,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error("Piston API request failed");
        }

        const result = await response.json();

        // Format the response
        const output = result.run?.output || "";
        const stderr = result.run?.stderr || "";
        const exitCode = result.run?.code || 0;

        return NextResponse.json({
            success: exitCode === 0,
            output: output,
            error: stderr,
            exitCode: exitCode,
        });
    } catch (error) {
        console.error("Code execution error:", error);
        return NextResponse.json(
            { message: "Failed to execute code", error: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint to list supported languages
export async function GET() {
    return NextResponse.json({
        languages: Object.keys(languageMap).map((lang) => ({
            name: lang,
            ...languageMap[lang],
        })),
    });
}
