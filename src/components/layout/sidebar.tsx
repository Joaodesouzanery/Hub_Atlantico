"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { AdEngelferSidebar } from "@/components/ads/ad-engelfer-sidebar";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.user_metadata?.name ?? null);
        setUserEmail(user.email ?? null);
      }
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r lg:flex"
      style={{ background: "#1E293B", borderColor: "#334155" }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-3 border-b px-6"
        style={{ borderColor: "#334155" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Droplets className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white">
          HuB - Atlântico
        </span>
      </div>

      {/* Search */}
      <div className="px-4 pt-5 pb-2">
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: "#253449", borderColor: "#334155" }}
        >
          <Search className="h-4 w-4" style={{ color: "#7C8CA3" }} />
          <span className="text-sm" style={{ color: "#7C8CA3" }}>Buscar</span>
          <div
            className="ml-auto flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px]"
            style={{ borderColor: "#2E2E33", color: "#6B6B73" }}
          >
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p
              className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "#7C8CA3" }}
            >
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
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      style={
                        isActive
                          ? { background: "rgba(249,115,22,0.12)", color: "#F97316" }
                          : { color: "#94A3B8" }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = "#2D3D53";
                          (e.currentTarget as HTMLElement).style.color = "#F1F5F9";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                        }
                      }}
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
      <div className="border-t p-4 space-y-3" style={{ borderColor: "#334155" }}>
        {/* Upgrade para Pro */}
        <div className="rounded-xl p-4" style={{ background: "#253449" }}>
          <p className="text-sm font-semibold text-white">
            Upgrade para Pro
          </p>
          <p className="mt-1 text-xs" style={{ color: "#7C8CA3" }}>
            Acesso ilimitado a todas as funcionalidades.
          </p>
          <button className="mt-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500">
            Assinar Agora
          </button>
        </div>

        {/* User info + logout */}
        <div
          className="flex items-center gap-3 rounded-xl p-3"
          style={{ background: "#253449" }}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {userName ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {userName ?? "Usuário"}
            </p>
            <p className="truncate text-xs" style={{ color: "#7C8CA3" }}>
              {userEmail ?? ""}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: "#7C8CA3" }}
            title="Sair"
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#F97316"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6B6B73"; }}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Anúncio Engelfer — após o usuário para não bloquear navegação */}
        <AdEngelferSidebar />
      </div>
    </aside>
  );
}
