import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        error: "Payment gateway is not configured",
        debug: {
          RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "SET" : "MISSING",
          RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? "SET" : "MISSING",
          NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "SET" : "MISSING",
        },
      },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = "INR", receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
