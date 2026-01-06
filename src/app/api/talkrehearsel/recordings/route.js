import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import fs from "fs";
import path from "path";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getUserFromToken();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recordings = await prisma.recording.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        line: {
          include: {
            actor: true,
            voices: true,
            situation: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    });

    return NextResponse.json({ recordings });
  } catch (err) {
    console.error("GET recordings error:", err);
    return NextResponse.json(
      { error: "Failed to fetch recordings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const user = await getUserFromToken();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user_id = user.id;
    const line_id = formData.get("line_id");
    const file = formData.get("audio");

    if (!user_id || !line_id || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/talkrehearsel/recordings"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${user_id}_${line_id}.webm`;
    const filepath = path.join(uploadDir, filename);

    await fs.promises.writeFile(filepath, buffer);

    const audio_src = `/uploads/talkrehearsel/recordings/${filename}`;

    // overwrite existing recording
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
