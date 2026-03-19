import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { auth } from "@/auth";
import { getLastOrderInfo } from "@/lib/orders";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const info = await getLastOrderInfo(session.user.id);
    return NextResponse.json(info);
  } catch (error) {
    console.error("Failed to fetch last order info:", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to fetch order info." },
      { status: 500 },
    );
  }
}
