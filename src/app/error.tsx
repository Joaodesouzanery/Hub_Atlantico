"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111113] p-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F97316]/10">
          <AlertTriangle className="h-8 w-8 text-[#F97316]" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">
          Algo deu errado
        </h2>
        <p className="mb-6 text-sm text-[#A0A0A8]">
          Ocorreu um erro ao carregar esta página. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
