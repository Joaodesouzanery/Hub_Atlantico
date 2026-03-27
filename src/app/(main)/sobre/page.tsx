import { Droplets, Target, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Sobre",
  description: "Conheça o HuB - Atlântico - sua fonte de notícias de saneamento.",
};

export default function SobrePage() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <Droplets className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">
            Sobre o HuB - Atlântico
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Sua plataforma de notícias e informações sobre o setor de
            saneamento, engenharia e tecnologia no Brasil.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-dark-border bg-dark-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              Nossa Missão
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              O HuB - Atlântico foi criado para centralizar as informações mais
              relevantes do setor de saneamento brasileiro em um único lugar.
              Profissionais do setor precisam acompanhar múltiplas fontes
              diariamente, e nosso objetivo é simplificar esse processo.
            </p>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-card p-6">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              Como Funciona
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Nosso sistema coleta automaticamente notícias de mais de 15 fontes
              confiáveis, incluindo portais de notícias, institutos de pesquisa
              e empresas do setor. As notícias são categorizadas e apresentadas
              com links diretos para as fontes originais.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-dark-border bg-dark-card p-5 text-center">
              <Target className="mx-auto mb-3 h-8 w-8 text-accent" />
              <h3 className="font-semibold text-text-primary">Curadoria</h3>
              <p className="mt-2 text-xs text-text-muted">
                Fontes selecionadas e verificadas do setor de saneamento.
              </p>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-card p-5 text-center">
              <Shield className="mx-auto mb-3 h-8 w-8 text-accent" />
              <h3 className="font-semibold text-text-primary">LGPD</h3>
              <p className="mt-2 text-xs text-text-muted">
                Conformidade total com a Lei Geral de Proteção de Dados.
              </p>
            </div>
            <div className="rounded-xl border border-dark-border bg-dark-card p-5 text-center">
              <Zap className="mx-auto mb-3 h-8 w-8 text-accent" />
              <h3 className="font-semibold text-text-primary">Atualizado</h3>
              <p className="mt-2 text-xs text-text-muted">
                Notícias atualizadas automaticamente 3 vezes por dia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
