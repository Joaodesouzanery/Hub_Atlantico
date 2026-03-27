import { NextRequest, NextResponse } from "next/server";
import { fetchAllLicitacoes } from "@/lib/licitacoes/fetcher";

export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await fetchAllLicitacoes();

    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron fetch-licitacoes error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// Vercel cron uses GET
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60 seconds
