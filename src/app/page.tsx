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
} from "lucide-react";
import { prisma } from "@/lib/db";

async function getStats() {
  try {
    const [licitacoes, newsArticles, agencies, sources] = await Promise.all([
      prisma.licitacao.count(),
      prisma.newsArticle.count(),
      prisma.regulatoryAgency.count(),
      prisma.newsSource.count(),
    ]);
    return { licitacoes, newsArticles, agencies, sources };
  } catch {
    return { licitacoes: 0, newsArticles: 0, agencies: 21, sources: 18 };
  }
}

const modules = [
  {
    icon: LayoutDashboard,
    label: "01 — Dashboard",
    title: "Visão estratégica do setor",
    description:
      "KPIs em tempo real, mapa de licitações por estado e feed de atividade consolidado em um único painel.",
  },
  {
    icon: Newspaper,
    label: "02 — Notícias",
    title: "Agregador especializado",
    description:
      "18+ fontes de jornalismo técnico indexadas diariamente. Apenas o que importa para o setor hídrico.",
  },
  {
    icon: Gavel,
    label: "03 — Licitações",
    title: "Inteligência de mercado",
    description:
      "PNCP, Compras.gov.br e portais estaduais em um único lugar. Filtros por UF, modalidade e valor.",
  },
  {
    icon: FileBarChart,
    label: "04 — Relatórios",
    title: "Análise quantitativa",
    description:
      "Distribuição por região, tendência mensal e top órgãos licitantes. Exportação em Excel e PDF.",
  },
  {
    icon: Scale,
    label: "05 — Legislação",
    title: "Base normativa completa",
    description:
      "Leis, decretos, normas ABNT e resoluções da ANA indexados e pesquisáveis por tema ou órgão emissor.",
  },
  {
    icon: Landmark,
    label: "06 — Agências",
    title: "Diretório regulatório",
    description:
      "Agências estaduais e federais com links diretos, jurisdição e canais de contato atualizados.",
  },
];

const pillars = [
  {
    number: "I",
    title: "Dados em tempo real",
    description:
      "Crawlers automáticos coletam notícias e licitações de dezenas de fontes oficiais todos os dias. Sem curadoria manual.",
  },
  {
    number: "II",
    title: "Decisão embasada",
    description:
      "Filtros avançados, busca semântica e categorização automática por relevância para o setor de saneamento.",
  },
  {
    number: "III",
    title: "Cobertura nacional",
    description:
      "Todos os 26 estados e o DF monitorados. Portais federais, estaduais e municipais integrados.",
  },
];

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const stats = await getStats();

  const displayLicitacoes =
    stats.licitacoes > 0 ? stats.licitacoes.toLocaleString("pt-BR") : "5.000+";
  const displayNews =
    stats.newsArticles > 0 ? stats.newsArticles.toLocaleString("pt-BR") : "10.000+";
  const displayAgencies = stats.agencies > 0 ? stats.agencies : 21;
  const displaySources = stats.sources > 0 ? stats.sources : 18;

  return (
    <div style={{ background: "#09090B", color: "#FAFAFA", fontFamily: "inherit" }}>
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(9,9,11,0.92)", borderColor: "#1E1E24", backdropFilter: "blur(12px)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F97316]">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">HuB — Atlântico</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Plataforma", href: "#plataforma" },
              { label: "Módulos", href: "#modulos" },
              { label: "Como funciona", href: "#como-funciona" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-medium uppercase tracking-widest transition-colors"
                style={{ color: "#71717A" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FAFAFA")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#71717A")}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-md px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors md:block"
              style={{ color: "#71717A" }}
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="flex items-center gap-1.5 rounded-md bg-[#F97316] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#FB923C]"
            >
              Criar conta
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 lg:py-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1E1E24 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      >
        {/* gradient overlay to fade grid at edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 50% at 50% 100%, #09090B 0%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
          {/* eyebrow */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-[#F97316]" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#F97316" }}
            >
              Sistema Operacional do Setor de Saneamento
            </span>
          </div>

          <h1
            className="text-5xl font-bold leading-[1.08] tracking-tight lg:text-7xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Inteligência de mercado
            <br />
            <span style={{ color: "#F97316" }}>para quem decide</span>
            <br />
            no setor hídrico.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed" style={{ color: "#71717A" }}>
            Do dado bruto à decisão estratégica — em segundos. Licitações, notícias, legislação
            e agências reguladoras consolidados em uma única plataforma especializada.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-md bg-[#F97316] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#FB923C]"
            >
              Acessar a plataforma
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md border px-7 py-3.5 text-sm font-medium transition-colors hover:border-[#F97316] hover:text-[#F97316]"
              style={{ borderColor: "#2E2E33", color: "#71717A" }}
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────── */}
      <div className="border-y" style={{ borderColor: "#1E1E24" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-2 divide-x md:grid-cols-4" style={{ borderColor: "#1E1E24" }}>
            {[
              { value: displayLicitacoes, label: "Licitações monitoradas", suffix: "" },
              { value: displayNews, label: "Notícias indexadas", suffix: "" },
              { value: displayAgencies, label: "Agências reguladoras", suffix: "" },
              { value: displaySources, label: "Fontes especializadas", suffix: "+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col justify-center px-6 py-10 lg:px-10"
                style={{ borderColor: "#1E1E24" }}
              >
                <p
                  className="text-4xl font-bold tabular-nums lg:text-5xl"
                  style={{ color: "#FAFAFA" }}
                >
                  {stat.value}{stat.suffix}
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "#52525B" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PLATAFORMA ──────────────────────────────────────────── */}
      <section id="plataforma" className="py-28 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Left: copy */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px w-6 bg-[#F97316]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#F97316" }}>
                  Plataforma
                </span>
              </div>
              <h2
                className="text-4xl font-bold leading-tight lg:text-5xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Fundação tecnológica para o mercado de saneamento do Brasil.
              </h2>
              <p className="mt-6 text-base leading-relaxed" style={{ color: "#71717A" }}>
                O HuB — Atlântico agrega, filtra e classifica automaticamente
                informações de dezenas de fontes oficiais. Você recebe apenas o
                que é relevante para sua atuação — sem ruído, sem perda de tempo.
              </p>
              <Link
                href="/cadastro"
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#FB923C]"
                style={{ color: "#F97316" }}
              >
                Começar agora — é gratuito
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: three pillars */}
            <div className="space-y-0 divide-y" style={{ borderColor: "#1E1E24" }}>
              {pillars.map((p) => (
                <div key={p.number} className="py-8">
                  <div className="flex items-start gap-6">
                    <span
                      className="mt-0.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: "#F97316" }}
                    >
                      {p.number}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "#71717A" }}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MÓDULOS ─────────────────────────────────────────────── */}
      <section
        id="modulos"
        className="border-y py-28 lg:py-36"
        style={{ borderColor: "#1E1E24", background: "#0D0D10" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-6 bg-[#F97316]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#F97316" }}>
                Módulos
              </span>
            </div>
            <h2
              className="max-w-xl text-4xl font-bold leading-tight lg:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Seis camadas de inteligência. Uma só plataforma.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "#1E1E24" }}>
            {modules.map((mod) => (
              <div
                key={mod.title}
                className="group flex flex-col p-8 transition-colors"
                style={{ background: "#0D0D10" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#111113")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#0D0D10")}
              >
                <div className="mb-6 flex items-center gap-3">
                  <mod.icon className="h-5 w-5" style={{ color: "#F97316" }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#52525B" }}>
                    {mod.label}
                  </span>
                </div>
                <p className="text-base font-semibold text-white">{mod.title}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#71717A" }}>
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ───────────────────────────────────────── */}
      <section id="como-funciona" className="py-28 lg:py-36">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="h-px w-6 bg-[#F97316]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#F97316" }}>
                Como funciona
              </span>
              <div className="h-px w-6 bg-[#F97316]" />
            </div>
            <h2
              className="text-4xl font-bold leading-tight lg:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Acesso imediato.
              <br />
              Sem fricção.
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-0 md:grid-cols-3">
            {/* connector line desktop */}
            <div
              className="absolute left-0 right-0 top-8 hidden h-px md:block"
              style={{ background: "#1E1E24" }}
            />

            {[
              {
                number: "01",
                title: "Crie sua conta",
                description: "Cadastro em menos de 30 segundos. Sem cartão de crédito, sem burocracia.",
              },
              {
                number: "02",
                title: "Monitore o setor",
                description:
                  "Licitações, notícias e legislação atualizados diariamente, organizados por relevância.",
              },
              {
                number: "03",
                title: "Tome decisões",
                description:
                  "Acesse relatórios analíticos, configure alertas e exporte dados para Excel ou PDF.",
              },
            ].map((step) => (
              <div key={step.number} className="relative px-8 py-12 text-center first:pl-0 last:pr-0 md:px-12">
                <div
                  className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border text-lg font-bold"
                  style={{ borderColor: "#F97316", background: "#09090B", color: "#F97316" }}
                >
                  {step.number}
                </div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#71717A" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA DARK ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-y py-28 lg:py-36"
        style={{ borderColor: "#1E1E24", background: "#0D0D10" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1E1E24 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(249,115,22,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2
            className="text-4xl font-bold leading-tight lg:text-6xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Inteligência de mercado
            <br />
            <span style={{ color: "#F97316" }}>entregue hoje.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed" style={{ color: "#71717A" }}>
            Profissionais de engenharia, gestores públicos e empresas de
            saneamento já usam o HuB — Atlântico para tomar decisões mais
            rápidas e embasadas.
          </p>

          <ul className="mx-auto mt-8 max-w-sm space-y-3">
            {[
              "Plataforma 100% gratuita",
              "Sem cartão de crédito",
              "Dados atualizados diariamente",
              "Cobertura nacional — todos os 26 estados + DF",
            ].map((item) => (
              <li key={item} className="flex items-center justify-center gap-3 text-sm" style={{ color: "#A1A1AA" }}>
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#F97316" }} />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-md bg-[#F97316] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#FB923C]"
            >
              Criar conta gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md border px-8 py-4 text-sm font-medium transition-colors hover:border-[#F97316] hover:text-[#F97316]"
              style={{ borderColor: "#2E2E33", color: "#71717A" }}
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t py-10" style={{ borderColor: "#1E1E24" }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F97316]">
              <Droplets className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">HuB — Atlântico</span>
          </div>

          <p className="text-xs" style={{ color: "#3F3F46" }}>
            © {new Date().getFullYear()} HuB — Atlântico. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            {[
              { label: "Sobre", href: "/sobre" },
              { label: "Entrar", href: "/login" },
              { label: "Cadastro", href: "/cadastro" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest transition-colors hover:text-white"
                style={{ color: "#52525B" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
