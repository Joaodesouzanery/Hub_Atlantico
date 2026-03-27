import Link from "next/link";
import { Droplets, ArrowRight, Newspaper, Building2, Zap } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2">
            <Droplets className="h-10 w-10 text-white/90" />
            <span className="text-2xl font-bold text-white">
              Hub Atlântico
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Todas as notícias de{" "}
            <span className="text-accent-300">saneamento</span> em um só lugar
          </h1>

          <p className="mb-8 text-lg text-white/80 sm:text-xl">
            Informações atualizadas diariamente das principais fontes do
            Brasil. Saneamento, engenharia e tecnologia para profissionais do
            setor.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/noticias"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-colors hover:bg-slate-50"
            >
              Ver Notícias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/solucoes"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Nossas Soluções
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur">
            <Newspaper className="h-8 w-8 text-accent-300" />
            <div>
              <p className="text-2xl font-bold text-white">15+</p>
              <p className="text-sm text-white/70">Fontes de notícias</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur">
            <Building2 className="h-8 w-8 text-accent-300" />
            <div>
              <p className="text-2xl font-bold text-white">9</p>
              <p className="text-sm text-white/70">Categorias</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 backdrop-blur">
            <Zap className="h-8 w-8 text-accent-300" />
            <div>
              <p className="text-2xl font-bold text-white">3x/dia</p>
              <p className="text-sm text-white/70">Atualizações</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
