import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(_, { params }) {
  try {
    const { lineId } = params;
    const userId = new URL(_.url).searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id" },
        { status: 400 }
      );
    }

    const recording = await prisma.recording.findFirst({
      where: {
        user_id: userId,
        line_id: lineId,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ recording });
  } catch (err) {
    console.error("Recording GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch recording" },
      { status: 500 }
    );
  }
}
