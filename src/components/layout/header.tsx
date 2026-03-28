"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Droplets,
  Search,
  Bell,
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
} from "lucide-react";

const mobileNavSections = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Notícias", href: "/noticias", icon: Newspaper },
    ],
  },
  {
    label: "Mercado",
    items: [
      { title: "Licitações", href: "/licitacoes", icon: Gavel },
      { title: "Relatórios", href: "/relatorios", icon: FileBarChart },
    ],
  },
  {
    label: "Referência",
    items: [
      { title: "Legislação", href: "/legislacao", icon: Scale },
      { title: "Agências", href: "/agencias", icon: Landmark },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { title: "Categorias", href: "/categorias", icon: Folder },
      { title: "Fontes", href: "/fontes", icon: Globe },
      { title: "Soluções", href: "/solucoes", icon: Box },
      { title: "Sobre", href: "/sobre", icon: Info },
    ],
  },
];

const allItems = mobileNavSections.flatMap((s) => s.items);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle =
    pathname === "/" || pathname === "/dashboard"
      ? "Dashboard"
      : allItems.find((item) =>
          item.href === "/dashboard" ? false : pathname.startsWith(item.href)
        )?.title || "Página";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-dark-border bg-dark-surface/95 px-4 backdrop-blur lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-text-secondary hover:bg-dark-hover lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-text-primary">HuB - Atlântico</span>
          </div>
          <h1 className="hidden text-lg font-semibold text-text-primary lg:block">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-text-secondary hover:bg-dark-hover">
            <Search className="h-5 w-5" />
          </button>
          <button className="relative rounded-lg p-2 text-text-secondary hover:bg-dark-hover">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            A
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 z-50 h-full w-[280px] border-r border-dark-border bg-dark-surface lg:hidden">
            <div className="flex h-16 items-center gap-3 border-b border-dark-border px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">HuB - Atlântico</span>
              <button className="ml-auto rounded-lg p-1 text-text-secondary hover:bg-dark-hover" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="overflow-y-auto px-3 py-3">
              {mobileNavSections.map((section) => (
                <div key={section.label} className="mb-4">
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = item.href === "/dashboard" ? pathname === "/dashboard" || pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                              isActive ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-dark-hover hover:text-text-primary"
                            }`}
                          >
                            <item.icon className="h-[18px] w-[18px]" />
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
