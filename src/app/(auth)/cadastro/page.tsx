"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowRight } from "lucide-react";

const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const SEGMENT_OPTIONS = [
  { value: "PUBLIC",     label: "Setor público / prefeitura / autarquia" },
  { value: "PRIVATE",    label: "Empresa privada de saneamento" },
  { value: "CONSULTING", label: "Consultoria / engenharia" },
  { value: "ACADEMIA",   label: "Academia / pesquisa" },
  { value: "OTHER",      label: "Outro" },
];

const INPUT_CLS = "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const LABEL_CLS = "mb-1.5 block text-sm font-medium text-slate-700";

export default function CadastroPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    uf: "",
    segment: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erro ao criar conta. Tente novamente.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-7 w-7 text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Conta criada!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Bem-vindo ao HuB — Atlântico. Clique abaixo para entrar agora.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
          >
            Entrar na plataforma
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Criar conta grátis</h1>
          <p className="mt-1 text-sm text-slate-500">Acesso completo à plataforma, sem custo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados pessoais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={LABEL_CLS}>Nome completo *</label>
              <input id="name" type="text" autoComplete="name" required value={form.name}
                onChange={(e) => set("name", e.target.value)} placeholder="Seu nome completo"
                className={INPUT_CLS} />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className={LABEL_CLS}>E-mail *</label>
              <input id="email" type="email" autoComplete="email" required value={form.email}
                onChange={(e) => set("email", e.target.value)} placeholder="seu@email.com"
                className={INPUT_CLS} />
            </div>

            <div>
              <label htmlFor="phone" className={LABEL_CLS}>Celular / WhatsApp</label>
              <input id="phone" type="tel" autoComplete="tel" value={form.phone}
                onChange={(e) => set("phone", e.target.value)} placeholder="(11) 99999-9999"
                className={INPUT_CLS} />
            </div>

            <div>
              <label htmlFor="uf" className={LABEL_CLS}>Estado (UF)</label>
              <select id="uf" value={form.uf} onChange={(e) => set("uf", e.target.value)}
                className={INPUT_CLS}>
                <option value="">Selecione...</option>
                {UF_LIST.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          {/* Dados profissionais */}
          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Dados profissionais</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="company" className={LABEL_CLS}>Empresa / Organização</label>
                <input id="company" type="text" value={form.company}
                  onChange={(e) => set("company", e.target.value)} placeholder="Nome da empresa"
                  className={INPUT_CLS} />
              </div>

              <div>
                <label htmlFor="jobTitle" className={LABEL_CLS}>Cargo / Função</label>
                <input id="jobTitle" type="text" value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)} placeholder="Ex: Engenheiro Sanitarista"
                  className={INPUT_CLS} />
              </div>

              <div>
                <label htmlFor="segment" className={LABEL_CLS}>Segmento</label>
                <select id="segment" value={form.segment} onChange={(e) => set("segment", e.target.value)}
                  className={INPUT_CLS}>
                  <option value="">Selecione...</option>
                  {SEGMENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Senha */}
          <div className="border-t border-slate-100 pt-4">
            <label htmlFor="password" className={LABEL_CLS}>Senha *</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                required minLength={8} value={form.password}
                onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 8 caracteres"
                className={`${INPUT_CLS} pr-10`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password.length > 0 && form.password.length < 8 && (
              <p className="mt-1 text-xs text-red-500">Mínimo 8 caracteres</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar conta grátis
          </button>

          <p className="text-center text-xs text-slate-400">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="/sobre" className="text-accent hover:underline">termos de uso</Link>.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-accent hover:text-orange-600">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
