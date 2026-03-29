"use client";

import React, { useState } from "react";
import { Bell, Settings, CheckCheck, X } from "lucide-react";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  icon: React.ReactNode;
};

// Notificações de exemplo para o setor de saneamento
const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: "licitacao",
    title: "Nova licitação de saneamento",
    message: "Pregão Eletrônico — Implantação de sistema de esgotamento sanitário em Recife/PE. Valor estimado: R$ 12,5M.",
    timestamp: "Hoje, 14:30",
    timeAgo: "Há 2 horas",
    isRead: false,
    icon: <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold">PE</span>,
  },
  {
    id: 2,
    type: "noticia",
    title: "Atualização do setor",
    message: "ANA publica nova resolução sobre governança regulatória dos serviços de saneamento básico.",
    timestamp: "Hoje, 11:15",
    timeAgo: "Há 5 horas",
    isRead: false,
    icon: <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">ANA</span>,
  },
  {
    id: 3,
    type: "sistema",
    title: "Dados atualizados",
    message: "O sistema coletou 47 novas licitações e 128 notícias nas últimas 24 horas.",
    timestamp: "Ontem, 22:00",
    timeAgo: "Há 1 dia",
    isRead: true,
    icon: <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400 text-xs font-bold">HuB</span>,
  },
  {
    id: 4,
    type: "legislacao",
    title: "Nova legislação adicionada",
    message: "Decreto n. 12.500/2026 — Metas Intermediárias de Universalização do Saneamento.",
    timestamp: "Ontem, 18:30",
    timeAgo: "Há 1 dia",
    isRead: true,
    icon: <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">LEG</span>,
  },
];

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-dark-hover hover:text-text-primary"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-12 z-50 w-[380px] rounded-xl border border-dark-border bg-dark-card shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-border px-4 py-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Notificações
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllRead}
                  className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-dark-hover hover:text-text-primary"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
                <button
                  className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-dark-hover hover:text-text-primary"
                  title="Configurações"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-dark-hover hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-dark-border px-4">
              {(["all", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                    filter === tab
                      ? "border-accent text-accent"
                      : "border-transparent text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {tab === "all" ? "Todas" : "Não lidas"}
                  {tab === "unread" && unreadCount > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent/20 px-1 text-[10px] font-bold text-accent">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 border-b border-dark-border/50 px-4 py-3 transition-colors hover:bg-dark-hover ${
                      !notification.isRead ? "bg-accent/5" : ""
                    }`}
                  >
                    {notification.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-text-primary">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-text-muted line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] text-text-muted">{notification.timestamp}</span>
                        <span className="text-[10px] text-text-muted">{notification.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 rounded-full bg-dark-hover p-3">
                    <Bell className="h-5 w-5 text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted">
                    Nenhuma notificação por enquanto.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
