import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLastOrderInfo } from "@/lib/orders";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 });
  }

  const info = await getLastOrderInfo(session.user.id);

  return NextResponse.json(info);
}
