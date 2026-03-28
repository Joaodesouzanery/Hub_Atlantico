import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = typeof (body as Record<string, unknown>).email === "string"
    ? ((body as Record<string, unknown>).email as string).toLowerCase().trim()
    : null;

  if (!email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    // No admin access — return ok silently so login can proceed
    return NextResponse.json({ ok: true });
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find user by email
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError || !listData) {
      return NextResponse.json({ ok: true });
    }

    const user = listData.users.find((u) => u.email?.toLowerCase() === email);
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // If already confirmed, nothing to do
    if (user.email_confirmed_at) {
      return NextResponse.json({ ok: true });
    }

    // Confirm email via admin update
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });
  } catch {
    // Best-effort — never block login
  }

  return NextResponse.json({ ok: true });
}
