import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscriptionId = session.subscription as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

        await prisma.user.update({
          where: { id: userId },
          data: {
            role: "PREMIUM",
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items?.data?.[0]?.price?.id,
            subscriptionStatus: "active",
            subscriptionEndsAt: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : undefined,
          },
        });

        console.log(`[Stripe] User ${userId} upgraded to PREMIUM`);
        break;
      }

      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subscriptionId = String(invoice.subscription || "");
        if (!subscriptionId) break;

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "active",
              subscriptionEndsAt: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : undefined,
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subscriptionId = String(invoice.subscription || "");
        if (!subscriptionId) break;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { subscriptionStatus: "past_due" },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            role: "FREE",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
            stripePriceId: null,
          },
        });

        console.log(`[Stripe] Subscription ${subscription.id} canceled`);
        break;
      }

      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const status = subscription.status;
        const role = status === "active" ? "PREMIUM" : "FREE";

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            role,
            subscriptionStatus: status,
            subscriptionEndsAt: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : undefined,
          },
        });
        break;
      }
    }
  } catch (error) {
    console.error(`Webhook handler error for ${event.type}:`, error);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
