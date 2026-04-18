export const MONACO_LANG_MAP: Record<string, string> = {
    python: "python", javascript: "javascript", java: "java",
    "c++": "cpp", cpp: "cpp", c: "c", "c#": "csharp",
    csharp: "csharp", ruby: "ruby", go: "go", rust: "rust",
    php: "php", typescript: "typescript",
};

export interface Lesson {
    lesson_id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    difficulty: string;
    duration: number;
}

export interface ReviewResult {
    verdict: string;
    ai_solution: string;
    advice: string;
}
