"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileText, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps {
  type: "licitacoes" | "noticias";
  filters?: Record<string, string>;
}

export function ExportButton({ type, filters = {} }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleExport(format: "pdf" | "excel") {
    setLoading(format);
    setOpen(false);

    try {
      const params = new URLSearchParams(filters);
      const url = `/api/export/${type}/${format}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Falha ao exportar");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;

      const ext = format === "pdf" ? "pdf" : "xlsx";
      const label = type === "licitacoes" ? "licitacoes" : "noticias";
      const date = new Date().toISOString().slice(0, 10);
      a.download = `${label}_${date}.${ext}`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading !== null}
        className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-dark-hover disabled:opacity-50"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
        ) : (
          <Download className="h-4 w-4 text-accent" />
        )}
        <span>Exportar</span>
        <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-dark-border bg-dark-card shadow-lg shadow-black/30">
          <button
            onClick={() => handleExport("pdf")}
            className="flex w-full items-center gap-3 rounded-t-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-dark-hover hover:text-text-primary"
          >
            <FileText className="h-4 w-4 text-red-400" />
            Exportar PDF
          </button>
          <div className="mx-3 border-t border-dark-border" />
          <button
            onClick={() => handleExport("excel")}
            className="flex w-full items-center gap-3 rounded-b-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-dark-hover hover:text-text-primary"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-400" />
            Exportar Excel
          </button>
        </div>
      )}
    </div>
  );
}
