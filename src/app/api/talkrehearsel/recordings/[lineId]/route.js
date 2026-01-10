import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(_, { params }) {
  try {
    const { lineId } = params;

    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recording = await prisma.recording.findFirst({
      where: {
        user_id: user.id,
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
