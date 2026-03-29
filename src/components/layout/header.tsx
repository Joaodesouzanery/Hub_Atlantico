"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Droplets,
  Search,
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
  TrendingUp,
  Zap,
  BookOpen,
  Building,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NotificationsMenu } from "@/components/notifications/notifications-menu";

const navMenu = [
  { title: "Dashboard", href: "/dashboard" },
  {
    title: "Mercado",
    items: [
      {
        title: "Notícias",
        description: "Últimas notícias do setor de saneamento",
        icon: <Newspaper className="h-5 w-5 shrink-0" />,
        href: "/noticias",
      },
      {
        title: "Licitações",
        description: "Oportunidades públicas de saneamento e água",
        icon: <Gavel className="h-5 w-5 shrink-0" />,
        href: "/licitacoes",
      },
      {
        title: "Relatórios",
        description: "Análises e exportação de dados do setor",
        icon: <FileBarChart className="h-5 w-5 shrink-0" />,
        href: "/relatorios",
      },
    ],
  },
  {
    title: "Referência",
    items: [
      {
        title: "Legislação",
        description: "Leis, normas e regulamentações do setor",
        icon: <Scale className="h-5 w-5 shrink-0" />,
        href: "/legislacao",
      },
      {
        title: "Agências Reguladoras",
        description: "Órgãos reguladores federais e estaduais",
        icon: <Landmark className="h-5 w-5 shrink-0" />,
        href: "/agencias",
      },
      {
        title: "Fontes",
        description: "Todas as fontes monitoradas pela plataforma",
        icon: <Globe className="h-5 w-5 shrink-0" />,
        href: "/fontes",
      },
    ],
  },
  { title: "Sobre", href: "/sobre" },
];

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("?");
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name: string = user.user_metadata?.name ?? user.email ?? "?";
        setUserInitial(name.charAt(0).toUpperCase());
      }
    });
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const pageTitle =
    pathname === "/" || pathname === "/dashboard"
      ? "Dashboard"
      : allItems.find((item) =>
          item.href === "/dashboard" ? false : pathname.startsWith(item.href)
        )?.title || "Página";

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 backdrop-blur lg:px-8"
        style={{ background: "rgba(248,250,252,0.95)", borderColor: "#E2E8F0" }}
      >
        {/* Left: mobile menu + logo/title */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-800">HuB - Atlântico</span>
          </div>

          {/* Desktop: page title + nav menu */}
          <div className="hidden items-center gap-6 lg:flex">
            <h1 className="text-base font-semibold text-slate-700">{pageTitle}</h1>

            <nav className="flex items-center gap-1">
              {navMenu.map((item) =>
                item.items ? (
                  <div key={item.title} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.title ? null : item.title)}
                      className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        openDropdown === item.title
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                    >
                      {item.title}
                      <svg className={`h-3 w-3 transition-transform ${openDropdown === item.title ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>

                    {openDropdown === item.title && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                          {item.items.map((sub) => (
                            <Link
                              key={sub.title}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
                            >
                              <span className="mt-0.5 text-slate-400">{sub.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{sub.title}</p>
                                <p className="text-xs text-slate-500">{sub.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href || (item.href === "/dashboard" && pathname === "/")
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Right: search, notifications, avatar */}
        <div className="flex items-center gap-1.5">
          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Search className="h-5 w-5" />
          </button>
          <NotificationsMenu />
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {userInitial}
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed left-0 top-0 z-50 h-full w-[280px] border-r lg:hidden"
            style={{ background: "#1E293B", borderColor: "#334155" }}
          >
            <div
              className="flex h-16 items-center gap-3 border-b px-6"
              style={{ borderColor: "#334155" }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">HuB - Atlântico</span>
              <button
                className="ml-auto rounded-lg p-1"
                style={{ color: "#94A3B8" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="overflow-y-auto px-3 py-3">
              {mobileNavSections.map((section) => (
                <div key={section.label} className="mb-4">
                  <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#7C8CA3" }}>
                    {section.label}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive =
                        item.href === "/dashboard"
                          ? pathname === "/dashboard" || pathname === "/"
                          : pathname.startsWith(item.href);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                            style={isActive ? { background: "rgba(249,115,22,0.12)", color: "#F97316" } : { color: "#A0A0A8" }}
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
