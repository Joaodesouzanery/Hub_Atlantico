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
  Shield,
  Globe,
  TrendingUp,
  Clock,
  Filter,
  Download,
  MapPin,
  Bell,
} from "lucide-react";
// Stats removidos da landing page — sem números exatos para não dar impressão de "poucos" dados

const modules = [
  {
    icon: Newspaper,
    tag: "Notícias",
    title: "Hub especializado em saneamento",
    description:
      "30+ fontes de jornalismo técnico monitoradas diariamente — agências reguladoras, portais governamentais, companhias estaduais e veículos especializados.",
    highlight: true,
    href: "/noticias",
  },
  {
    icon: Gavel,
    tag: "Licitações",
    title: "Radar de oportunidades públicas",
    description:
      "PNCP e portais estaduais em um único lugar. Filtros por UF, modalidade, valor, SRP. Dados completos: contato do órgão, amparo legal, prazos.",
    highlight: true,
    href: "/licitacoes",
  },
  {
    icon: Scale,
    tag: "Legislação",
    title: "Base normativa completa",
    description:
      "Leis, decretos, normas ABNT, resoluções ANA e portarias. Filtros por tipo, categoria, órgão emissor e ano. Busca inteligente.",
    href: "/legislacao",
  },
  {
    icon: Landmark,
    tag: "Agências",
    title: "Diretório regulatório",
    description:
      "Agências reguladoras estaduais e federais com jurisdição, contatos e links diretos para cada portal.",
    href: "/agencias",
  },
  {
    icon: FileBarChart,
    tag: "Relatórios",
    title: "Análise de mercado",
    description:
      "Gráficos por região, tendência mensal, modalidade e top órgãos. Exportação em Excel e PDF. Filtros salvos.",
    href: "/relatorios",
  },
  {
    icon: LayoutDashboard,
    tag: "Dashboard",
    title: "Visão estratégica",
    description:
      "KPIs em tempo real, mapa coroplético do Brasil por estado, prazos próximos e feed de atividade consolidado.",
    href: "/dashboard",
  },
];

const features = [
  { icon: Clock, title: "Atualização diária", description: "Crawlers automáticos coletam dados de dezenas de fontes oficiais todos os dias." },
  { icon: Filter, title: "Filtros avançados", description: "Busca por palavra-chave, UF, modalidade, categoria, ano. Salve seus filtros favoritos." },
  { icon: Download, title: "Exportação completa", description: "Exporte licitações e notícias em PDF ou Excel para análise offline e relatórios." },
  { icon: MapPin, title: "Cobertura nacional", description: "Todos os 26 estados + DF monitorados. Portais federais e estaduais integrados." },
  { icon: Shield, title: "LGPD compliant", description: "Apenas dados públicos de portais de transparência. Sem coleta de dados pessoais." },
  { icon: Bell, title: "Tudo centralizado", description: "Notícias, licitações, legislação e agências em uma única plataforma integrada." },
];

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F97316]">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide text-slate-900">HuB — Atlantico</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Noticias", href: "/noticias" },
              { label: "Licitacoes", href: "/licitacoes" },
              { label: "Legislacao", href: "/legislacao" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-medium uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
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

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-28 lg:py-40"
        style={{ background: "#1E293B" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(249,115,22,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, #1E293B)" }}
        />

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-[#F97316]" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F97316]">
              Noticias · Licitacoes · Legislacao · Agencias
            </span>
          </div>

          <h1
            className="text-5xl font-bold leading-[1.08] tracking-tight text-white lg:text-7xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Tudo que acontece
            <br />
            no setor hidrico,{" "}
            <span className="text-[#F97316]">em tempo real.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
            O HuB — Atlantico centraliza noticias, licitacoes, legislacao e agencias
            reguladoras do saneamento brasileiro. Dezenas de fontes monitoradas diariamente,
            filtros avancados e exportacao de dados.
          </p>

          {/* Qualitative highlights — sem números exatos */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-6">
            {[
              { icon: Newspaper, label: "Notícias atualizadas diariamente" },
              { icon: Gavel, label: "Licitações de todo o Brasil" },
              { icon: Scale, label: "Legislação completa do setor" },
              { icon: Globe, label: "Dezenas de fontes monitoradas" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <item.icon className="h-4 w-4 text-[#F97316]" />
                <span className="text-sm text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-md bg-[#F97316] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-colors hover:bg-[#EA6C10]"
            >
              Acessar gratuitamente
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/noticias"
              className="flex items-center gap-2 rounded-md border border-white/10 px-8 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
            >
              Ver noticias agora
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-600">
            Comece gratuito ou assine o Pro por R$ 14,99/mes · Cobertura nacional · LGPD compliant
          </p>
        </div>
      </section>

      {/* ─── DESTAQUE: Noticias + Licitacoes ─────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">
              O que entregamos
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Noticias e licitacoes do setor de saneamento,{" "}
              <br className="hidden lg:block" />
              num so lugar.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Noticias card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Newspaper className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Hub de Noticias</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Dezenas de fontes especializadas, indexadas diariamente
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Companhias de saneamento (Sabesp, Aegea, BRK, Sanepar), agencias reguladoras (ANA, IBAMA),
                portais governamentais e veiculos especializados. Tudo categorizado automaticamente.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "ANA, FUNASA, Ministerio das Cidades e portais gov.br",
                  "Sabesp, Aegea, BRK, Copasa, CAGECE, Sanepar e mais",
                  "G1, Agencia Brasil, Poder360, O Eco e especializados",
                  "Busca por palavra-chave, categoria e fonte",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/noticias" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA6C10]">
                Ver noticias <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Licitacoes card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <Gavel className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-green-600">Radar de Licitacoes</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Milhares de licitacoes do PNCP monitoradas
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Licitacoes publicas de saneamento com dados completos: orgao, CNPJ, valor,
                modalidade, prazos, contato, amparo legal e link para o edital original.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Portal Nacional de Contratacoes Publicas (PNCP)",
                  "7 modalidades: pregao, concorrencia, dispensa e mais",
                  "Filtros por UF, modalidade, valor e status",
                  "Dados LGPD-safe: CNPJ, contato institucional, SRP",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/licitacoes" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA6C10]">
                Ver licitacoes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Funcionalidades</span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Feito para quem trabalha com saneamento.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div key={feat.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                  <feat.icon className="h-5 w-5 text-[#F97316]" />
                </div>
                <p className="font-semibold text-slate-900">{feat.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MODULOS ─────────────────────────────────────────────── */}
      <section id="modulos" className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Modulos</span>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
              Seis modulos integrados.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Link
                key={mod.title}
                href={mod.href}
                className={`group rounded-xl border p-7 transition-all hover:shadow-md ${
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
                <p className="font-semibold text-slate-900 group-hover:text-[#F97316] transition-colors">{mod.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{mod.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ───────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Como funciona</span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl" style={{ letterSpacing: "-0.01em" }}>
            Acesso imediato. Sem friccao.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-0 md:grid-cols-3">
            {[
              { n: "01", title: "Crie sua conta", body: "Cadastro em 30 segundos. Sem cartao de credito, sem burocracia. Login com e-mail salvo." },
              { n: "02", title: "Monitore o setor", body: "Noticias, licitacoes e legislacao atualizados diariamente. Filtre, busque e salve suas preferencias." },
              { n: "03", title: "Tome decisoes", body: "Relatorios analiticos, graficos interativos e exportacao para Excel ou PDF. Dados em suas maos." },
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

      {/* ─── QUEM USA ────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]">Para quem?</span>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 lg:text-3xl">
            Projetado para profissionais do setor
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Globe, label: "Engenheiros sanitaristas" },
              { icon: Landmark, label: "Gestores publicos" },
              { icon: TrendingUp, label: "Empresas de saneamento" },
              { icon: Scale, label: "Consultorias e escritorios" },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200">
                  <p.icon className="h-5 w-5 text-[#F97316]" />
                </div>
                <p className="text-sm font-medium text-slate-700">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────────── */}
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
            Noticias, licitacoes, legislacao e agencias reguladoras do saneamento brasileiro
            em um unico lugar — atualizado diariamente com cobertura nacional.
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
              Ja tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PATROCINADORES ──────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Patrocinadores
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {/* ConstruData */}
            <a
              href="https://www.instagram.com/construdata_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0F172A] shadow-lg">
                <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="18" width="8" height="18" rx="2" fill="#3B82F6" opacity="0.7" />
                  <rect x="15" y="8" width="8" height="28" rx="2" fill="#3B82F6" opacity="0.85" />
                  <rect x="26" y="12" width="8" height="24" rx="2" fill="#3B82F6" />
                  <path d="M8 15 L19 6 L30 10" stroke="#60A5FA" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <circle cx="30" cy="10" r="3" fill="#60A5FA" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">ConstruData</p>
                <p className="text-xs text-slate-500">Intelig&ecirc;ncia Operacional</p>
              </div>
            </a>

            {/* Engelfer */}
            <a
              href="https://www.instagram.com/engelfer_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1B3A2B] shadow-lg">
                <svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                  <polygon points="20,4 36,13 36,27 20,36 4,27 4,13" stroke="white" strokeWidth="1.5" fill="none" />
                  <polygon points="20,10 30,16 30,24 20,30 10,24 10,16" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
                  <rect x="15" y="15" width="10" height="10" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 20 20)" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Engelfer Engenharia</p>
                <p className="text-xs text-slate-500">Saneamento e Infraestrutura</p>
              </div>
            </a>
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
            <span className="text-sm font-bold text-slate-800">HuB — Atlantico</span>
          </div>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} HuB — Atlantico. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            {[
              { label: "Sobre", href: "/sobre" },
              { label: "Noticias", href: "/noticias" },
              { label: "Entrar", href: "/login" },
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
