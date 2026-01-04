import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

// GET /api/admin/subscriptions?page=1&limit=20
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // If ?id=... is passed → fetch single subscription
    if (id) {
      const sub = await prisma.subscription.findUnique({
        where: { id },
        include: { user: true, name: true, email: true, payments: true },
      });
      if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(sub);
    }

    // Pagination params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Fetch paginated subscriptions
    const [subs, total] = await Promise.all([
      prisma.subscription.findMany({
        skip,
        take: limit,
        include: { user: true, payments: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.subscription.count(),
    ]);

    return NextResponse.json({
      data: subs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}


// POST /api/admin/subscriptions → create new subscription
export async function POST(req) {
  try {
    const body = await req.json();
    const sub = await prisma.subscription.create({
      data: {
        userId: body.userId,
        provider: body.provider,
        providerCustomerId: body.providerCustomerId || null,
        providerSubscriptionId: body.providerSubscriptionId || null,
        providerCheckoutId: body.providerCheckoutId || null,
        planTitle: body.planTitle,
        planPrice: body.planPrice,
        planCurrency: body.planCurrency,
        planBillingCycle: body.planBillingCycle || null,
        status: body.status || "ACTIVE",
        currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : null,
        currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : null,
        cancelAtPeriodEnd: body.cancelAtPeriodEnd || false,
      },
    });
    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    console.error("Error creating subscription:", err);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}

// PUT /api/admin/subscriptions?id=... → update subscription
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const sub = await prisma.subscription.update({
      where: { id },
      data: {
        planTitle: body.planTitle,
        planPrice: body.planPrice,
        planCurrency: body.planCurrency,
        planBillingCycle: body.planBillingCycle,
        status: body.status,
        currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : undefined,
        currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : undefined,
        cancelAtPeriodEnd: body.cancelAtPeriodEnd,
      },
    });
    return NextResponse.json(sub);
  } catch (err) {
    console.error("Error updating subscription:", err);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}

// DELETE /api/admin/subscriptions?id=... → delete subscription
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.subscription.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting subscription:", err);
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
