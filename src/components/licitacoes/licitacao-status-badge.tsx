type LicitacaoStatus =
  | "ABERTA"
  | "ENCERRADA"
  | "SUSPENSA"
  | "ANULADA"
  | "HOMOLOGADA"
  | "DESERTA";

const statusConfig: Record<LicitacaoStatus, { label: string; color: string }> = {
  ABERTA: { label: "Aberta", color: "#22C55E" },
  ENCERRADA: { label: "Encerrada", color: "#94A3B8" },
  SUSPENSA: { label: "Suspensa", color: "#F59E0B" },
  ANULADA: { label: "Anulada", color: "#EF4444" },
  HOMOLOGADA: { label: "Homologada", color: "#3B82F6" },
  DESERTA: { label: "Deserta", color: "#8B5CF6" },
};

interface LicitacaoStatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function LicitacaoStatusBadge({
  status,
  size = "sm",
}: LicitacaoStatusBadgeProps) {
  const config = statusConfig[status as LicitacaoStatus] || statusConfig.ENCERRADA;

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
      }}
    >
      <span
        className={`mr-1.5 inline-block rounded-full ${
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
        }`}
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
