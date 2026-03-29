import Link from "next/link";
import {
  Droplets,
  LayoutDashboard,
  Newspaper,
  Gavel,
  FileBarChart,
  Scale,
  Landmark,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Zap,
} from "lucide-react";

// Sem busca no banco — números fixos não criam dependência com DB vazio
const modules = [
  {
    icon: Newspaper,
    tag: "Notícias",
    title: "Hub especializado em saneamento",
    description:
      "18+ fontes de jornalismo técnico monitoradas e indexadas diariamente — agências reguladoras, portais governamentais e veículos especializados.",
    highlight: true,
  },
  {
    icon: Gavel,
    tag: "Licitações",
    title: "Radar de oportunidades públicas",
    description:
      "PNCP, Compras.gov.br e portais estaduais em um único lugar. Filtros por UF, modalidade e valor estimado. Atualizações em tempo real.",
    highlight: true,
  },
  {
    icon: Scale,
    tag: "Legislação",
    title: "Base normativa completa",
    description:
      "Leis, decretos, normas ABNT e resoluções da ANA indexados e pesquisáveis por tema ou órgão emissor.",
  },
  {
    icon: Landmark,
    tag: "Agências",
    title: "Diretório regulatório",
    description:
      "Agências estaduais e federais com links diretos, jurisdição e canais de contato atualizados.",
  },
  {
    icon: FileBarChart,
    tag: "Relatórios",
    title: "Análise de mercado",
    description:
      "Distribuição por região, tendência mensal e top órgãos licitantes. Exportação em Excel e PDF.",
  },
  {
    icon: LayoutDashboard,
    tag: "Dashboard",
    title: "Visão estratégica",
    description:
      "KPIs em tempo real, mapa de licitações por estado e feed de atividade consolidado em um único painel.",
  },
];

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F97316]">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-slate-900">HuB — Atlântico</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Notícias", href: "#modulos" },
              { label: "Licitações", href: "#modulos" },
              { label: "Plataforma", href: "#plataforma" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-medium uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-md px-4 py-2 text-xs font-medium uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900 md:block"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="flex items-center gap-1.5 rounded-md bg-[#F97316] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#EA6C10]"
            >
              Criar conta
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO (dark) ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 lg:py-40"
        style={{ background: "#1E293B" }}
      >
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        {/* orange glow top */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,0.12) 0%, transparent 65%)",
          }}
        />
        {/* fade to dark at bottom */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, #1E293B)" }}
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
          {/* eyebrow pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-[#F97316]" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F97316]">
              Hub de Notícias · Licitações · Legislação
            </span>
          </div>

          <h1
            className="text-5xl font-bold leading-[1.08] tracking-tight text-white lg:text-7xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Tudo que acontece
            <br />
            no setor hídrico,{" "}
            <span className="text-[#F97316]">em tempo real.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
            O HuB — Atlântico é o hub de inteligência do saneamento brasileiro.
            Notícias de 18+ fontes especializadas, licitações do PNCP e portais estaduais,
            legislação e agências reguladoras — tudo consolidado em uma única plataforma.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-md bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-colors hover:bg-[#EA6C10]"
            >
              Acessar gratuitamente
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
            >
              Já tenho conta
            </Link>
          </div>

          {/* mini social proof */}
          <p className="mt-8 text-xs text-slate-600">
            Gratuito · Sem cartão de crédito · Cobertura nacional
          </p>
        </div>
      </section>

      {/* ─── DESTAQUE: Notícias + Licitações ─────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
              O que entregamos
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Notícias e licitações do setor de saneamento,{" "}
              <br className="hidden lg:block" />
              num só lugar.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Notícias card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Newspaper className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Hub de Notícias</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                18+ fontes especializadas, indexadas diariamente
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Agências reguladoras, portais governamentais, veículos de comunicação
                do setor hídrico e de saneamento. Tudo categorizado automaticamente
                para você encontrar o que importa em segundos.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "ANA, FUNASA, SNSA e ministérios",
                  "Portais estaduais de saneamento",
                  "Busca por palavra-chave e categoria",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Licitações card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Gavel className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-green-600">Radar de Licitações</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                PNCP e Compras.gov.br monitorados em tempo real
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Licitações públicas do setor de saneamento coletadas automaticamente
                de portais federais e estaduais. Filtros por UF, modalidade e
                valor estimado para você não perder nenhuma oportunidade.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Portal Nacional de Contratações Públicas (PNCP)",
                  "Compras.gov.br e portais estaduais",
                  "Filtros por UF, modalidade e valor",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATAFORMA ──────────────────────────────────────────── */}
      <section id="plataforma" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
                Plataforma
              </span>
              <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl" style={{ letterSpacing: "-0.02em" }}>
                Sistema operacional do mercado de saneamento.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-500">
                O HuB — Atlântico consolida, filtra e classifica automaticamente
                informações de dezenas de fontes oficiais. Engenheiros, gestores
                públicos e empresas recebem apenas o que é relevante para sua
                atuação — sem ruído, sem perda de tempo.
              </p>
              <Link
                href="/cadastro"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] transition-colors hover:text-[#EA6C10]"
              >
                Criar conta gratuita
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  number: "I",
                  title: "Dados em tempo real",
                  description:
                    "Crawlers automáticos coletam notícias e licitações de dezenas de fontes oficiais todos os dias. Sem curadoria manual.",
                },
                {
                  number: "II",
                  title: "Inteligência filtrada",
                  description:
                    "Categorização automática por relevância para o setor hídrico. Busca por palavra-chave, estado e modalidade.",
                },
                {
                  number: "III",
                  title: "Cobertura nacional",
                  description:
                    "Todos os 26 estados e o DF monitorados. Portais federais, estaduais e municipais integrados.",
                },
              ].map((p) => (
                <div key={p.number} className="py-7">
                  <div className="flex items-start gap-5">
                    <span className="mt-0.5 text-xs font-bold uppercase tracking-widest text-[#F97316]">{p.number}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{p.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MÓDULOS (light gray) ────────────────────────────────── */}
      <section id="modulos" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Módulos</span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Seis módulos integrados.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <div
                key={mod.title}
                className={`rounded-xl border p-7 transition-shadow hover:shadow-md ${
                  mod.highlight
                    ? "border-[#F97316]/20 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <mod.icon
                    className="h-5 w-5"
                    style={{ color: mod.highlight ? "#F97316" : "#94A3B8" }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: mod.highlight ? "#F97316" : "#94A3B8" }}
                  >
                    {mod.tag}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">{mod.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ───────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Como funciona</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
            Acesso imediato. Sem fricção.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-0 md:grid-cols-3">
            <div className="absolute left-1/6 right-1/6 hidden" />
            {[
              { n: "01", title: "Crie sua conta", body: "Cadastro em 30 segundos. Sem cartão de crédito, sem burocracia." },
              { n: "02", title: "Monitore o setor", body: "Notícias, licitações e legislação atualizados diariamente e organizados por relevância." },
              { n: "03", title: "Tome decisões", body: "Relatórios analíticos, busca avançada e exportação de dados para Excel ou PDF." },
            ].map((step) => (
              <div key={step.n} className="px-4 py-8">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#F97316] text-base font-bold text-[#F97316]">
                  {step.n}
                </div>
                <p className="font-semibold text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL (dark) ────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 lg:py-36"
        style={{ background: "#1E293B" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2
            className="text-4xl font-bold leading-tight text-white lg:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            O hub do setor de saneamento.
            <br />
            <span className="text-[#F97316]">Gratuito. Agora.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-400">
            Notícias, licitações, legislação e agências reguladoras em um único lugar.
            Para engenheiros, gestores públicos e empresas do setor hídrico.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-md bg-[#F97316] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-colors hover:bg-[#EA6C10]"
            >
              Criar conta gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md border border-white/10 px-8 py-4 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F97316]">
              <Droplets className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">HuB — Atlântico</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} HuB — Atlântico. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            {[
              { label: "Sobre", href: "/sobre" },
              { label: "Entrar", href: "/login" },
              { label: "Cadastro", href: "/cadastro" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="text-xs text-slate-400 uppercase tracking-widest transition-colors hover:text-slate-700">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
