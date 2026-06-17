import crypto from "crypto";
import { NextResponse } from "next/server";
import {
  createShopifyOrder,
  isShopifyConfigured,
  ShopifyLineItem,
  ShopifyShippingAddress,
} from "@/lib/shopify";

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  email?: string;
  lineItems?: ShopifyLineItem[];
  shipping?: ShopifyShippingAddress;
  shippingPrice?: number;
}

export async function POST(request: Request) {
  try {
    const body: VerifyPaymentBody = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      lineItems,
      shipping,
      shippingPrice,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: "Payment gateway is not configured" },
        { status: 500 }
      );
    }

    const signaturePayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(signaturePayload)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    let shopifyOrderName: string | null = null;
    let shopifyOrderError: string | null = null;

    if (isShopifyConfigured() && lineItems?.length && shipping && email) {
      try {
        const order = await createShopifyOrder({
          email,
          lineItems,
          shipping,
          shippingPrice: shippingPrice ?? 0,
          note: `Razorpay payment ${razorpay_payment_id} (order ${razorpay_order_id})`,
        });
        shopifyOrderName = order.name;
      } catch (error: unknown) {
        // Payment is already verified; surface the Shopify failure without
        // failing the customer's checkout.
        shopifyOrderError =
          error instanceof Error ? error.message : "Failed to sync order to Shopify";
        console.error("Shopify order creation failed:", shopifyOrderError);
      }
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      shopifyOrderName,
      shopifyOrderError,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
