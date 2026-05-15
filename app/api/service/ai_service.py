import anthropic
import json
from dotenv import load_dotenv
load_dotenv()

class AIService:
    def __init__(self):
        self.client = anthropic.Anthropic()

    def review_code(self, code, language, lesson_title, lesson_description, lesson_task=""):
        task_section = f"\nTask the student must solve:\n{lesson_task}" if lesson_task else ""
        message = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=700,
            messages=[{"role": "user", "content": f"Lesson: {lesson_title}\nDescription: {lesson_description}{task_section}\nLanguage: {language}\nUser's code:\n{code}\n\nEvaluate this solution and respond with ONLY a valid JSON object, no markdown, no code blocks. The JSON must have exactly these fields:\n\"verdict\": \"CORRECT\" or \"INCORRECT\" — mark as CORRECT if the code logically solves the task described above. Be lenient: ignore minor style issues like capitalization, extra prints, slightly different variable names, or spacing — these do not matter. Only mark INCORRECT if the code fundamentally does not implement what the task requires (wrong logic, missing the required function/feature, or completely off-topic).\n\"ai_solution\": your clean ideal solution for this specific task\n\"advice\": always give 1-2 sentences of helpful feedback regardless of verdict. If correct, mention one thing done well or a small tip to improve. If incorrect, explain clearly what is missing or wrong."}]
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text.strip())

    def ask_hint(self, question, lesson_title, lesson_description, language, conversation_history=None):
        system_prompt = (
            f"You are a programming tutor helping a student with the lesson: '{lesson_title}'.\n"
            f"Lesson description: {lesson_description}\n"
            f"Language: {language}\n\n"
            "STRICT RULES you must always follow:\n"
            "- NEVER write the solution code for the student. Not even partial solutions.\n"
            "- NEVER complete their code or show them how to implement the answer.\n"
            "- If the student asks for the solution directly, kindly refuse and guide them instead.\n"
            "- Instead: explain concepts, ask guiding questions, give hints about the approach, explain relevant syntax.\n"
            "- Keep responses short and helpful (2-4 sentences max).\n"
            "- Be encouraging and friendly."
        )
        messages = list(conversation_history) if conversation_history else []
        messages.append({"role": "user", "content": question})
        response = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=system_prompt,
            messages=messages
        )
        return response.content[0].text.strip()
