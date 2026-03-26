import { NextRequest, NextResponse } from "next/server";
import { verifyAccessCode, createAdminToken } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code = body?.code;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Access code is required" }, { status: 400 });
  }

  if (!verifyAccessCode(code)) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("fm_admin", createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("fm_admin");
  return response;
}
