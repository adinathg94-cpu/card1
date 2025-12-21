import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: "Minimum donation amount is $0.50" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe secret key is not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.NEXT_PUBLIC_VERCEL_URL || 
                    "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to CARD",
              description: "Thank you for your generous donation",
            },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donation/failure`,
      metadata: {
        donation_type: "general",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
