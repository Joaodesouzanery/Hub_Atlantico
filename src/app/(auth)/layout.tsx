import Link from "next/link";
import { Droplets } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header mínimo */}
      <header className="border-b border-slate-200 bg-white px-4 py-4 lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
            <Droplets className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">HuB — Atlântico</span>
        </Link>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} HuB — Atlântico. Todos os direitos reservados.
      </footer>
    </div>
  );
}
