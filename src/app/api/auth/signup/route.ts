import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  // Usa a Service Role Key para criar usuários via Admin API (não requer login)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Cria o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true, // Confirma automaticamente — sem necessidade de clicar em link
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }
    console.error("[signup] Supabase auth error:", authError.message);
    return NextResponse.json({ error: "Erro ao criar conta. Tente novamente." }, { status: 500 });
  }

  // Sincroniza com a tabela `users` do Prisma usando o UUID do Supabase como ID
  if (authData.user) {
    try {
      await prisma.user.upsert({
        where: { email },
        update: { name },
        create: {
          id: authData.user.id,
          email,
          name,
          role: "FREE",
        },
      });
    } catch (dbError) {
      console.error("[signup] Prisma upsert error:", dbError);
      // Não falha o signup — o usuário já foi criado no Supabase Auth
    }
  }

  return NextResponse.json({ success: true });
}
