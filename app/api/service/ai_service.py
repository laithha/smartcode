import anthropic
import json
import os
from dotenv import load_dotenv
load_dotenv()

class AIService:
    def review_code(self, code, language, lesson_title, lesson_description):
        client = anthropic.Anthropic()
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=700,
            messages=[{"role": "user", "content": f"Lesson: {lesson_title}\nDescription: {lesson_description}\nLanguage: {language}\nUser's code:\n{code}\n\nEvaluate this solution and respond with ONLY a valid JSON object, no markdown, no code blocks. The JSON must have exactly these fields:\n\"verdict\": \"CORRECT\" or \"INCORRECT\" — mark as CORRECT if the student used the right concept and approach, even if minor details like capitalization or exact string values differ\n\"ai_solution\": your ideal solution code for this lesson\n\"advice\": only give advice if there is something genuinely wrong with the logic or approach. Do NOT mark as incorrect or comment on minor differences like capitalization, spacing, or exact string values — these do not matter. Focus only on whether the student understood the concept and used the right approach. If the solution is correct and there is nothing meaningful to improve, just say 'Great job! Your solution is clean and correct.'"}]
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())
    