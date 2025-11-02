import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const HARDCODED_EMAIL = "laithhaj4@gmail.com";
    const HARDCODED_PASSWORD = "laithhaj0220";

    const { email, password } = await req.json();

    if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
      return NextResponse.json({
        message: "Login successful",
        user: { id: 1, email: HARDCODED_EMAIL },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
