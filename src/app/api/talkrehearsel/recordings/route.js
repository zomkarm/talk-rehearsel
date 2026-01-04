import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, line_id, audio_src } = body;

    if (!user_id || !line_id || !audio_src) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Overwrite existing recording (1 user per line)
    await prisma.recording.deleteMany({
      where: { user_id, line_id },
    });

    const recording = await prisma.recording.create({
      data: {
        user_id,
        line_id,
        audio_src,
      },
    });

    return NextResponse.json({ recording });
  } catch (err) {
    console.error("Recording POST error:", err);
    return NextResponse.json(
      { error: "Failed to save recording" },
      { status: 500 }
    );
  }
}
