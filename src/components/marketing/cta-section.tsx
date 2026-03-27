import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-primary-600">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Fique por dentro do setor de saneamento
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Assine o Hub Atlântico e tenha acesso a todas as notícias,
            análises e ferramentas para profissionais do setor.
          </p>
          <div className="mt-8">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-colors hover:bg-slate-50"
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
