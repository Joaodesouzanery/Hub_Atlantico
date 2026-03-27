import Link from "next/link";
import {
  BarChart3,
  Database,
  FileSpreadsheet,
  Settings,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Soluções",
  description:
    "Softwares e serviços do HuB - Atlântico para o setor de saneamento.",
};

const solutions = [
  {
    icon: BarChart3,
    title: "Gestão de Indicadores",
    description:
      "Software para monitoramento e gestão de indicadores de desempenho operacional. Dashboard em tempo real com métricas SNIS.",
    features: [
      "Indicadores SNIS automatizados",
      "Dashboard em tempo real",
      "Relatórios gerenciais",
      "Alertas configuráveis",
    ],
  },
  {
    icon: Database,
    title: "Banco de Dados Operacional",
    description:
      "Plataforma para centralizar dados operacionais de ETAs e ETEs. Histórico completo e rastreabilidade.",
    features: [
      "Centralização de dados",
      "Histórico operacional",
      "Integração com SCADA",
      "Exportação regulatória",
    ],
  },
  {
    icon: FileSpreadsheet,
    title: "Laudos e Relatórios",
    description:
      "Geração automatizada de laudos de análise de água e relatórios de conformidade regulatória.",
    features: [
      "Geração automática de laudos",
      "Templates customizáveis",
      "Assinatura digital",
      "Conformidade regulatória",
    ],
  },
  {
    icon: Settings,
    title: "Consultoria Técnica",
    description:
      "Consultoria em engenharia sanitária, otimização de processos e adequação ao marco regulatório.",
    features: [
      "Diagnóstico operacional",
      "Otimização de processos",
      "Planos de melhoria",
      "Treinamento de equipes",
    ],
  },
];

export default function SolucoesPage() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Nossas Soluções
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Softwares e serviços especializados para empresas de saneamento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {solutions.map((sol) => (
          <div
            key={sol.title}
            className="rounded-xl border border-dark-border bg-dark-card p-6 transition-colors hover:bg-dark-elevated"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <sol.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-text-primary">
              {sol.title}
            </h3>
            <p className="mb-4 text-sm text-text-muted">{sol.description}</p>
            <ul className="space-y-2">
              {sol.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-8 text-center">
        <h2 className="text-xl font-bold text-text-primary">
          Interessado em nossas soluções?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-text-secondary">
          Entre em contato para uma demonstração personalizada.
        </p>
        <Link
          href="/contato"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Fale Conosco
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
