import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // If user already has active subscription, redirect to portal
    if (dbUser.subscriptionStatus === "active") {
      return NextResponse.json({ error: "Já possui assinatura ativa" }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = dbUser.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name || undefined,
        metadata: { userId: dbUser.id },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json(
        { error: "Preço não configurado. Configure STRIPE_PRICE_ID." },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?upgrade=success`,
      cancel_url: `${siteUrl}/dashboard?upgrade=canceled`,
      metadata: { userId: dbUser.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
