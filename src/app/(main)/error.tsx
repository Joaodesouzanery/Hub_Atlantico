"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <AlertTriangle className="h-7 w-7 text-accent" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-text-primary">
          Erro ao carregar página
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          Não foi possível carregar os dados. Verifique sua conexão e tente
          novamente.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-dark-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Início
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-600"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
