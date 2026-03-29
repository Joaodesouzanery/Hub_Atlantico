import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ role: "FREE" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ role: "FREE" });
    }

    return NextResponse.json(dbUser);
  } catch {
    return NextResponse.json({ role: "FREE" });
  }
}
