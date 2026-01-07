import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [totalRecordings, situations] = await Promise.all([
      prisma.recording.count({
        where: { user_id: user.id },
      }),

      prisma.recording.findMany({
        where: { user_id: user.id },
        select: {
          line: {
            select: {
              situation_id: true,
            },
          },
        },
      }),
    ])

    // Count unique situations
    const uniqueSituationCount = new Set(
      situations.map(r => r.line.situation_id)
    ).size

    const recentActivity = await prisma.recording.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        line: {
          include: {
            actor: true,
            situation: {
              select: { id: true, title: true },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    })
    const activity = recentActivity.map(r => ({
      situationId: r.line.situation.id,
      situationTitle: r.line.situation.title,
      actorName: r.line.actor.name,
      lineText: r.line.text,
      recordedAt: r.created_at,
    }))



    return NextResponse.json({
      situations: uniqueSituationCount,
      recordings: totalRecordings,
      practiceMinutes: 0, // intentionally 0 (no duration tracking yet)
      recentActivity: activity,
    })
  } catch (err) {
    console.error('Dashboard API error:', err)
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}
