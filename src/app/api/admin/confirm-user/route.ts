import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  return !!secret && auth === `Bearer ${secret}`;
}

/**
 * POST /api/admin/confirm-user
 * Confirma o e-mail de um usuário existente no Supabase Auth.
 * Body: { email: string }
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Env vars ausentes." }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { email } = body;
  if (!email) {
    return NextResponse.json({ error: "Campo email obrigatório." }, { status: 400 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Busca o usuário pelo e-mail
  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    return NextResponse.json({ error: "Erro ao listar usuários.", detail: listError.message }, { status: 500 });
  }

  const user = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    return NextResponse.json({ error: `Usuário '${email}' não encontrado.` }, { status: 404 });
  }

  if (user.email_confirmed_at) {
    return NextResponse.json({ message: `E-mail de '${email}' já está confirmado.`, confirmed: true });
  }

  // Confirma o e-mail
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (updateError) {
    return NextResponse.json({ error: "Erro ao confirmar.", detail: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: `E-mail de '${email}' confirmado. Já pode fazer login.` });
}
