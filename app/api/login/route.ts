import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    return Response.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
