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
  CheckCircle,
  Bell,
  Search,
} from "lucide-react";
import { prisma } from "@/lib/db";

async function getStats() {
  try {
    const [licitacoes, newsArticles, agencies] = await Promise.all([
      prisma.licitacao.count(),
      prisma.newsArticle.count(),
      prisma.regulatoryAgency.count(),
    ]);
    return { licitacoes, newsArticles, agencies };
  } catch {
    return { licitacoes: 0, newsArticles: 0, agencies: 21 };
  }
}

const modules = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Visão geral do setor com KPIs, mapa de licitações por estado e atividade recente em tempo real.", color: "#F97316" },
  { icon: Newspaper, title: "Notícias", description: "Aggregador de notícias de 18+ fontes especializadas em saneamento, atualizado diariamente.", color: "#0077B6" },
  { icon: Gavel, title: "Licitações", description: "Monitoramento de licitações públicas do PNCP, Compras.gov.br e portais estaduais com filtros avançados.", color: "#22C55E" },
  { icon: FileBarChart, title: "Relatórios", description: "Análises de mercado, distribuição por região e exportação em Excel ou PDF.", color: "#8B5CF6" },
  { icon: Scale, title: "Legislação", description: "Base de dados de leis, decretos, normas ABNT e resoluções da ANA relevantes para o setor.", color: "#F59E0B" },
  { icon: Landmark, title: "Agências", description: "Diretório completo de agências reguladoras estaduais e federais com links e informações.", color: "#EF4444" },
];

const steps = [
  { number: "01", title: "Cadastre-se gratuitamente", description: "Crie sua conta em segundos com e-mail e senha. Sem cartão de crédito." },
  { number: "02", title: "Monitore o setor", description: "Acesse notícias, licitações e legislação atualizadas diariamente em um só lugar." },
  { number: "03", title: "Seja alertado", description: "Configure alertas por palavra-chave, estado ou modalidade e nunca perca uma oportunidade." },
];

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">HuB — Atlântico</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-800">
              Entrar
            </Link>
            <Link href="/cadastro" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Plataforma especializada em saneamento
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-6xl">
            A inteligência do setor de{" "}
            <span className="text-accent">saneamento</span>{" "}
            em um só lugar
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Monitore licitações públicas, acompanhe notícias especializadas, consulte legislação
            e fique por dentro de todas as movimentações do setor hídrico e de saneamento no Brasil.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/cadastro" className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-500">
              Começar gratuitamente
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-4xl font-bold text-slate-900">
                {stats.licitacoes > 0 ? `+${stats.licitacoes.toLocaleString("pt-BR")}` : "+5.000"}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">Licitações monitoradas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">
                {stats.newsArticles > 0 ? `+${stats.newsArticles.toLocaleString("pt-BR")}` : "+10.000"}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">Notícias indexadas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">{stats.agencies > 0 ? stats.agencies : 21}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">Agências reguladoras</p>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Tudo que você precisa para o setor</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Seis módulos integrados para profissionais de engenharia, gestores públicos e empresas de saneamento.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <div key={mod.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${mod.color}15` }}>
                  <mod.icon className="h-6 w-6" style={{ color: mod.color }} />
                </div>
                <h3 className="mb-2 font-semibold text-slate-800">{mod.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl">Como funciona</h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500">Comece em minutos e tenha acesso imediato a todo o ecossistema de informações do setor.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-2 font-semibold text-slate-800">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="rounded-3xl bg-[#18181B] px-8 py-16 lg:px-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-white lg:text-4xl">Feito para profissionais do saneamento</h2>
                <p className="mt-4 text-slate-400">
                  Engenheiros, gestores públicos, consultores e empresas de saneamento já usam o HuB — Atlântico para tomar decisões mais rápidas e embasadas.
                </p>
                <ul className="mt-8 space-y-4">
                  {["Licitações filtradas por relevância para o setor", "Notícias de 18+ fontes especializadas", "Legislação sempre atualizada", "Alertas por e-mail (em breve)"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500">
                  Criar conta grátis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[{ icon: Search, label: "Busca avançada", sub: "por palavra-chave" }, { icon: Bell, label: "Alertas", sub: "em tempo real" }, { icon: FileBarChart, label: "Relatórios", sub: "exportáveis" }, { icon: Landmark, label: "Agências", sub: "reguladoras" }].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/5 p-6 text-center">
                    <item.icon className="mx-auto mb-3 h-8 w-8 text-accent" />
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Pronto para começar?</h2>
          <p className="mt-4 text-slate-500">Cadastre-se gratuitamente e tenha acesso imediato à plataforma.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/cadastro" className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-500">
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="rounded-xl px-8 py-3.5 text-base font-medium text-slate-600 transition-colors hover:text-slate-800">
              Já tenho conta →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-accent">
              <Droplets className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">HuB — Atlântico</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} HuB — Atlântico. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/sobre" className="text-xs text-slate-400 hover:text-slate-600">Sobre</Link>
            <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600">Entrar</Link>
            <Link href="/cadastro" className="text-xs text-slate-400 hover:text-slate-600">Cadastro</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
