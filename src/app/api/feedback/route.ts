import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { rating, feedback, suggestion } = await request.json();

    if (!rating || !feedback?.trim()) {
      return NextResponse.json(
        { error: "Rating e feedback são obrigatórios" },
        { status: 400 }
      );
    }

    // Try to get current user
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // Anonymous feedback is OK
    }

    await prisma.feedback.create({
      data: {
        userId,
        rating: Math.min(Math.max(Math.round(rating), 1), 5),
        comment: feedback.trim().slice(0, 2000),
        suggestion: suggestion?.trim()?.slice(0, 2000) || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Erro ao salvar feedback" },
      { status: 500 }
    );
  }
}
