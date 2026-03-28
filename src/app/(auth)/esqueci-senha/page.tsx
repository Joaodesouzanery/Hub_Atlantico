"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail } from "lucide-react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    if (authError) {
      setError("Erro ao enviar o e-mail. Verifique o endereço e tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-7 w-7 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Verifique seu e-mail</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enviamos as instruções para redefinir sua senha para{" "}
            <strong>{email}</strong>. O link expira em 24 horas.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            Não recebeu? Verifique a pasta de spam ou{" "}
            <button onClick={() => setSent(false)} className="text-accent underline">
              tente novamente
            </button>.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Esqueceu a senha?</h1>
          <p className="mt-1 text-sm text-slate-500">
            Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar instruções
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-medium text-accent hover:text-orange-600">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
