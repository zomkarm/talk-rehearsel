import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    /* ----------------------------
       KPI STATS
    ----------------------------- */
    const [
      totalUsers,
      activeSubscribers,
      totalSituations,
      totalUnscripted,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.situation.count(),
      prisma.unscriptedQuestion.count(),
    ])

    /* ----------------------------
       USER GROWTH (LAST 6 MONTHS)
    ----------------------------- */
    const now = new Date()
    const start = new Date()
    start.setMonth(now.getMonth() - 5)

    const users = await prisma.user.findMany({
      where: { created_at: { gte: start } },
      select: { created_at: true },
    })

    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(start)
      d.setMonth(start.getMonth() + i)
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        count: 0,
      }
    })

    users.forEach(u => {
      const m = u.created_at.toLocaleString('default', { month: 'short' })
      const bucket = months.find(b => b.month === m)
      if (bucket) bucket.count++
    })

    /* ----------------------------
       MODULE USAGE
    ----------------------------- */
    const [lineCount] = await Promise.all([
      prisma.line.count(),
    ])

    const moduleUsageData = [
      { label: 'Situations', value: totalSituations },
      { label: 'Dialog Lines', value: lineCount },
      { label: 'Unscripted Prompts', value: totalUnscripted },
    ]

    /* ----------------------------
       RECENT ACTIVITY
    ----------------------------- */
    const [recentUsers, recentRecordings, recentQuestions] =
      await Promise.all([
        prisma.user.findMany({
          take: 3,
          orderBy: { created_at: 'desc' },
          select: { name: true, created_at: true },
        }),
        prisma.recording.findMany({
          take: 3,
          orderBy: { created_at: 'desc' },
          include: { line: true },
        }),
        prisma.unscriptedQuestion.findMany({
          take: 3,
          orderBy: { createdAt: 'desc' },
        }),
      ])

    const recentActivity = [
      ...recentUsers.map(u => ({
        action: 'New user registered',
        target: u.name,
        time: u.created_at,
      })),
      ...recentRecordings.map(r => ({
        action: 'Recorded line',
        target: r.line.text.slice(0, 40) + '...',
        time: r.created_at,
      })),
      ...recentQuestions.map(q => ({
        action: 'Added unscripted question',
        target: q.level,
        time: q.createdAt,
      })),
    ]
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        users: totalUsers,
        active: activeSubscribers,
        situations: totalSituations,
        unscripted: totalUnscripted,
      },
      userGrowthData: months,
      moduleUsageData,
      recentActivity,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}
