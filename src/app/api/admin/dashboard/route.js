import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma/client'

export async function GET() {
  try {
    // KPI stats
    const totalUsers = await prisma.user.count()
    const activeLearners = await prisma.progress.count({
      where: { status: 'IN_PROGRESS' }
    })
    const subjects = await prisma.subject.count()
    const lessons = await prisma.lesson.count()

    // User growth (last 6 months registrations)
    const now = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(now.getMonth() - 5)

    const registrations = await prisma.user.findMany({
      where: { created_at: { gte: sixMonthsAgo } },
      select: { created_at: true },
    })

    // Bucket by month
    const monthBuckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(sixMonthsAgo)
      d.setMonth(sixMonthsAgo.getMonth() + i)
      return {
        month: d.toLocaleString('default', { month: 'short' }),
        count: 0,
      }
    })

    registrations.forEach(r => {
      const month = r.created_at.toLocaleString('default', { month: 'short' })
      const bucket = monthBuckets.find(b => b.month === month)
      if (bucket) bucket.count++
    })

    const userGrowthData = monthBuckets

    // Module usage (example: count lessons, pages, components)
    const learnersSpaceUsage = await prisma.lesson.count()
    const pageTutorUsage = await prisma.page.count()
    const semanticBuilderUsage = await prisma.uIComponent.count() // note: check model name casing

    const moduleUsageData = [
      { label: 'Learners Space', value: learnersSpaceUsage },
      { label: 'PageTutor', value: pageTutorUsage },
      { label: 'Semantic Builder', value: semanticBuilderUsage },
    ]

    // Recent activity (latest 5 actions)
    const recentProjectActions = await prisma.projectAction.findMany({
      orderBy: { timestamp: 'desc' },
      take: 5,
      include: { user: true, project: true },
    })
    const recentPageActions = await prisma.pageAction.findMany({
      orderBy: { timestamp: 'desc' },
      take: 5,
      include: { user: true, page: true },
    })

    const recentActivity = [
      ...recentProjectActions.map(a => ({
        type: 'project',
        action: a.action,
        user: a.user?.name ?? 'Unknown',
        target: a.project?.title ?? 'Untitled',
        time: a.timestamp,
      })),
      ...recentPageActions.map(a => ({
        type: 'page',
        action: a.action,
        user: a.user?.name ?? 'Unknown',
        target: a.page?.title ?? 'Untitled',
        time: a.timestamp,
      })),
    ].sort((a, b) => b.time - a.time).slice(0, 5)

    return NextResponse.json({
      stats: {
        users: totalUsers,
        active: activeLearners,
        subjects,
        lessons,
      },
      userGrowthData,
      moduleUsageData,
      recentActivity,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
