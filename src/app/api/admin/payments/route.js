import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client"; // adjust path to your prisma client

// GET /api/admin/payments
// Supports ?id=... for single, or ?page & ?limit for paginated list
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          subscription: {
            select: {
              id: true,
              planTitle: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });
      if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(payment);
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        include: {
          subscription: {
            select: {
              id: true,
              planTitle: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count(),
    ]);

    return NextResponse.json({
      data: payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching payments:", err);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST /api/admin/payments → create new payment
export async function POST(req) {
  try {
    const body = await req.json();
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: body.subscriptionId,
        provider: body.provider,
        providerPaymentId: body.providerPaymentId,
        amount: body.amount,
        currency: body.currency,
        status: body.status,
        receiptUrl: body.receiptUrl || null,
        payload: body.payload || null,
      },
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    console.error("Error creating payment:", err);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}

// PUT /api/admin/payments?id=... → update payment
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        provider: body.provider,
        providerPaymentId: body.providerPaymentId,
        amount: body.amount,
        currency: body.currency,
        status: body.status,
        receiptUrl: body.receiptUrl,
        payload: body.payload,
      },
    });
    return NextResponse.json(payment);
  } catch (err) {
    console.error("Error updating payment:", err);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

// DELETE /api/admin/payments?id=... → delete payment
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.payment.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 });
  }
}
