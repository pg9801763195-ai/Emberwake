import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { uniqueUsernameFrom } from "@/lib/auth-helpers";

const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Ward must be at least 8 characters.").max(200),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "A valid name of record and a ward of at least 8 characters are required.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { email, password } = parsed.data;

    let existing = null;
    try {
      existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    } catch (dbErr) {
      console.error("Database connection error on user lookup:", dbErr);
    }

    if (existing) {
      return NextResponse.json({ error: "That name of record is already sworn to the gate." }, { status: 409 });
    }

    const username = await uniqueUsernameFrom(email);
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      await prisma.user.create({
        data: {
          email,
          username,
          displayName: username,
          passwordHash,
        },
      });
    } catch (createErr) {
      console.error("Database error creating user:", createErr);
      // In development if DB is not active, allow the request to proceed so dev can continue
      return NextResponse.json(
        { error: "Could not record oath in database. Please check your DATABASE_URL configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error in /api/register:", err);
    return NextResponse.json({ error: "An unexpected disturbance occurred at the gate." }, { status: 500 });
  }
}
