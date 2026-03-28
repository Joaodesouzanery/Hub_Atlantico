import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111113] p-4">
      <div className="max-w-md text-center">
        <p className="mb-2 text-6xl font-bold text-[#F97316]">404</p>
        <h2 className="mb-2 text-xl font-bold text-white">
          Página não encontrada
        </h2>
        <p className="mb-6 text-sm text-[#A0A0A8]">
          A página que você procura não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#EA580C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
