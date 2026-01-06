import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 6;
    const q = searchParams.get("q") || "";

    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [situations, total] = await Promise.all([
      prisma.situation.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.situation.count({ where }),
    ]);

    return NextResponse.json({
      situations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Situations GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch situations" },
      { status: 500 }
    );
  }
}
