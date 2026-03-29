"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, BookmarkCheck, Trash2, ChevronDown } from "lucide-react";

interface SavedFilter {
  id: string;
  name: string;
  params: Record<string, string>;
  createdAt: string;
}

interface SavedFiltersProps {
  /** Unique key per module (e.g. "licitacoes", "noticias", "legislacao") */
  moduleKey: string;
  /** Base path for the module (e.g. "/licitacoes") */
  basePath: string;
  /** Which search param keys to save (e.g. ["status","uf","modalidade","search"]) */
  filterKeys: string[];
}

function getStorageKey(moduleKey: string) {
  return `hub-filtros-${moduleKey}`;
}

function loadFilters(moduleKey: string): SavedFilter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(moduleKey));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistFilters(moduleKey: string, filters: SavedFilter[]) {
  localStorage.setItem(getStorageKey(moduleKey), JSON.stringify(filters));
}

export function SavedFilters({ moduleKey, basePath, filterKeys }: SavedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState<SavedFilter[]>([]);
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    setSaved(loadFilters(moduleKey));
  }, [moduleKey]);

  const currentParams: Record<string, string> = {};
  filterKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) currentParams[key] = val;
  });

  const hasActiveFilters = Object.keys(currentParams).length > 0;

  const handleSave = useCallback(() => {
    if (!filterName.trim() || !hasActiveFilters) return;
    const newFilter: SavedFilter = {
      id: Date.now().toString(36),
      name: filterName.trim(),
      params: currentParams,
      createdAt: new Date().toISOString(),
    };
    const updated = [...saved, newFilter];
    setSaved(updated);
    persistFilters(moduleKey, updated);
    setFilterName("");
    setNaming(false);
  }, [filterName, hasActiveFilters, currentParams, saved, moduleKey]);

  const handleLoad = useCallback(
    (filter: SavedFilter) => {
      const params = new URLSearchParams(filter.params);
      router.push(`${basePath}?${params.toString()}`);
      setOpen(false);
    },
    [router, basePath]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = saved.filter((f) => f.id !== id);
      setSaved(updated);
      persistFilters(moduleKey, updated);
    },
    [saved, moduleKey]
  );

  const handleClear = useCallback(() => {
    router.push(basePath);
  }, [router, basePath]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Save current filter */}
      {hasActiveFilters && !naming && (
        <button
          onClick={() => setNaming(true)}
          className="flex items-center gap-1.5 rounded-lg border border-dark-border bg-dark-card px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-dark-hover hover:text-text-primary transition-colors"
        >
          <Bookmark className="h-3.5 w-3.5" />
          Salvar filtro
        </button>
      )}

      {/* Naming input */}
      {naming && (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setNaming(false);
            }}
            placeholder="Nome do filtro..."
            autoFocus
            className="w-40 rounded-lg border border-dark-border bg-dark-card px-3 py-1.5 text-xs text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={handleSave}
            disabled={!filterName.trim()}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-600 disabled:opacity-50"
          >
            Salvar
          </button>
          <button
            onClick={() => setNaming(false)}
            className="rounded-lg px-2 py-1.5 text-xs text-text-muted hover:text-text-primary"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 rounded-lg border border-dark-border bg-dark-card px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-dark-hover hover:text-text-primary transition-colors"
        >
          Limpar filtros
        </button>
      )}

      {/* Saved filters dropdown */}
      {saved.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            Meus filtros ({saved.length})
            <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-lg border border-dark-border bg-dark-card shadow-lg">
                {saved.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between gap-2 border-b border-dark-border px-3 py-2 last:border-b-0"
                  >
                    <button
                      onClick={() => handleLoad(filter)}
                      className="flex-1 text-left text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {filter.name}
                      <span className="ml-1.5 text-text-muted">
                        ({Object.keys(filter.params).length})
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(filter.id);
                      }}
                      className="rounded p-1 text-text-muted hover:text-danger transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
