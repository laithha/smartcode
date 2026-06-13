// Base URL of the FastAPI backend. Override per environment by setting
// NEXT_PUBLIC_API_URL (e.g. in production); falls back to localhost for dev.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
