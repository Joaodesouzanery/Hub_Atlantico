import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";

// Rotas que não precisam de autenticação
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/cadastro",
  "/esqueci-senha",
  "/redefinir-senha",
];

// Prefixos públicos (conteúdo, API routes e assets)
const PUBLIC_PREFIXES = [
  "/api/",
  "/_next/",
  "/favicon",
  "/images/",
  "/fonts/",
  // Conteúdo da plataforma — acessível sem login
  "/dashboard",
  "/licitacoes",
  "/noticias",
  "/legislacao",
  "/relatorios",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cria response base para que o middleware possa atualizar cookies de sessão
  const response = NextResponse.next({ request });

  // Se as variáveis do Supabase não estiverem configuradas, deixa passar
  // (evita crash em deploy sem env vars ainda configuradas)
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  // Cria o cliente Supabase e atualiza a sessão a cada request
  const supabase = createMiddlewareClient(request, response);
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase auth failed — treat as unauthenticated
  }

  const isPublic = isPublicPath(pathname);

  // Usuário não autenticado tentando acessar rota protegida
  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário autenticado tentando acessar páginas de auth → redireciona ao dashboard
  if (user && (pathname === "/login" || pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Executa em todos os paths exceto arquivos estáticos do Next.js.
     * O isPublicPath() dentro do middleware faz a filtragem fina.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
