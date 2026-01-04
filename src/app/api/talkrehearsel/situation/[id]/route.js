import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(_, { params }) {
  try {
    const { id } = params;

    const situation = await prisma.situation.findUnique({
      where: { id },
      include: {
        actors: {
          orderBy: { order: "asc" },
        },
        lines: {
          orderBy: { order: "asc" },
          include: {
            actor: true,
            voices: true,
          },
        },
      },
    });

    if (!situation) {
      return NextResponse.json(
        { error: "Situation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ situation });
  } catch (err) {
    console.error("Situation GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch situation" },
      { status: 500 }
    );
  }
}
