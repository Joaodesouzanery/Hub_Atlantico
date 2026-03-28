import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/news/fetcher";

async function handler(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await fetchAllNews();
    return NextResponse.json({ success: true, ...summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron fetch-news error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET: used by Vercel cron scheduler
// POST: used for manual triggers (Vercel dashboard "Run" button or curl)
export const GET = handler;
export const POST = handler;

export const dynamic = "force-dynamic";
export const maxDuration = 60;
