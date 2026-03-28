"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Gavel,
  FileBarChart,
  Scale,
  Landmark,
  Folder,
  Globe,
  Box,
  Info,
  Search,
  Droplets,
} from "lucide-react";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  newspaper: Newspaper,
  gavel: Gavel,
  "file-bar-chart": FileBarChart,
  scale: Scale,
  landmark: Landmark,
  folder: Folder,
  globe: Globe,
  box: Box,
  info: Info,
};

const navSections = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
      { title: "Notícias", href: "/noticias", icon: "newspaper" },
    ],
  },
  {
    label: "Mercado",
    items: [
      { title: "Licitações", href: "/licitacoes", icon: "gavel" },
      { title: "Relatórios", href: "/relatorios", icon: "file-bar-chart" },
    ],
  },
  {
    label: "Referência",
    items: [
      { title: "Legislação", href: "/legislacao", icon: "scale" },
      { title: "Agências", href: "/agencias", icon: "landmark" },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { title: "Categorias", href: "/categorias", icon: "folder" },
      { title: "Fontes", href: "/fontes", icon: "globe" },
      { title: "Soluções", href: "/solucoes", icon: "box" },
      { title: "Sobre", href: "/sobre", icon: "info" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-dark-border bg-dark-surface lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-dark-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Droplets className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary">
          HuB - Atlântico
        </span>
      </div>

      {/* Search */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <span className="text-sm text-text-muted">Buscar</span>
          <div className="ml-auto flex items-center gap-1 rounded border border-dark-border px-1.5 py-0.5 text-[10px] text-text-muted">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard" || pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:bg-dark-hover hover:text-text-primary"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-dark-border p-4">
        <div className="rounded-xl bg-dark-card p-4">
          <p className="text-sm font-semibold text-text-primary">
            Upgrade para Pro
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Acesso ilimitado a todas as funcionalidades.
          </p>
          <button className="mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
            Assinar Agora
          </button>
        </div>
      </div>
    </aside>
  );
}
