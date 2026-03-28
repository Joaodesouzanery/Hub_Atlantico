import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";
import { z } from "zod";

const UF_VALUES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"] as const;
const SEGMENT_VALUES = ["PUBLIC","PRIVATE","CONSULTING","ACADEMIA","OTHER"] as const;

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  phone: z.string().min(10, "Telefone inválido").max(20).optional().or(z.literal("")),
  company: z.string().max(150).optional().or(z.literal("")),
  jobTitle: z.string().max(100).optional().or(z.literal("")),
  uf: z.enum(UF_VALUES).optional().or(z.literal("")),
  segment: z.enum(SEGMENT_VALUES).optional().or(z.literal("")),
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

  const { name, email, password, phone, company, jobTitle, uf, segment } = parsed.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error("[signup] Env vars Supabase ausentes.");
    return NextResponse.json({ error: "Serviço indisponível. Tente novamente." }, { status: 503 });
  }

  let userId: string | undefined;

  // Caminho 1: Admin API com email_confirm:true (sem e-mail de confirmação)
  if (serviceRoleKey) {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone, company, jobTitle, uf, segment },
      email_confirm: true,
    });

    if (adminError) {
      const msg = adminError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("email_exists")) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
      }
      console.warn("[signup] Admin API falhou, tentando fallback:", adminError.message);
    } else {
      userId = adminData.user?.id;
    }
  }

  // Caminho 2: Fallback signUp() — requer "Confirm email" desativado no Supabase Dashboard
  if (!userId) {
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, company, jobTitle, uf, segment } },
    });

    if (signupError) {
      const msg = signupError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("user already registered")) {
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
        update: {
          name,
          phone: phone || null,
          company: company || null,
          jobTitle: jobTitle || null,
          uf: uf || null,
          segment: segment || null,
        },
        create: {
          id: userId,
          email,
          name,
          phone: phone || null,
          company: company || null,
          jobTitle: jobTitle || null,
          uf: uf || null,
          segment: segment || null,
          role: "FREE",
        },
      });
    } catch (dbError) {
      console.error("[signup] Prisma upsert error:", dbError);
    }
  }

  return NextResponse.json({ success: true });
}
