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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error("[signup] Variáveis de ambiente Supabase não configuradas.");
    return NextResponse.json({ error: "Serviço indisponível. Tente novamente." }, { status: 503 });
  }

  let userId: string | undefined;

  // Caminho 1: Admin API (confirma e-mail automaticamente, sem envio de e-mail)
  if (serviceRoleKey) {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (adminError) {
      if (
        adminError.message.toLowerCase().includes("already registered") ||
        adminError.message.toLowerCase().includes("already been registered") ||
        adminError.message.toLowerCase().includes("email_exists")
      ) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
      }
      // Admin API falhou por outra razão — tenta fallback abaixo
      console.warn("[signup] Admin API falhou, tentando fallback:", adminError.message);
    } else {
      userId = adminData.user?.id;
    }
  }

  // Caminho 2: Fallback com signUp() padrão (se admin API indisponível ou falhou)
  if (!userId) {
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signupError) {
      if (
        signupError.message.toLowerCase().includes("already registered") ||
        signupError.message.toLowerCase().includes("user already registered")
      ) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
      }
      console.error("[signup] signUp error:", signupError.message);
      return NextResponse.json({ error: "Erro ao criar conta. Tente novamente." }, { status: 500 });
    }

    userId = signupData.user?.id;
  }

  // Sincroniza com a tabela users (best-effort)
  if (userId) {
    try {
      await prisma.user.upsert({
        where: { email },
        update: { name },
        create: { id: userId, email, name, role: "FREE" },
      });
    } catch (dbError) {
      console.error("[signup] Prisma upsert error:", dbError);
    }
  }

  return NextResponse.json({ success: true });
}
