import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET() {
  try {
    const situations = await prisma.situation.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ situations });
  } catch (err) {
    console.error("Situations GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch situations" },
      { status: 500 }
    );
  }
}
