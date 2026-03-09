import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);





export async function POST(req: NextRequest) {
    try {
        const { title, language } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are a coding tutor teaching beginners. For the topic "${title}" in ${language}, return a JSON object with exactly these fields:
1. "explanation": A detailed beginner-friendly explanation of this topic (3-4 paragraphs, teach the concept clearly)
2. "problem": A coding challenge for the student to solve related to this topic
3. "example": A short code example in ${language} that helps understand the concept but does NOT solve the problem
4. "hints": An array of 3 hints that progressively help the student solve the problem, from vague to more specific
Return ONLY valid JSON. No markdown, no code blocks, no extra text.`
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Gemini sometimes wraps JSON in markdown code blocks like ```json ... ```
        const cleanText = text.replace(/```(json)?/g, "").replace(/```/g, "").trim();
        
        const json = JSON.parse(cleanText);
        return NextResponse.json(json);
    } catch (error) {
        console.error("Error generating lesson:", error);
        return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
    }
}



