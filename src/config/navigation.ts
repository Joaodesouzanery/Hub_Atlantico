export const sidebarSections = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", href: "/", icon: "layout-dashboard" },
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

export const categories = [
  { name: "Saneamento Básico", slug: "saneamento-basico", color: "#F97316" },
  { name: "Tratamento de Água", slug: "tratamento-agua", color: "#3B82F6" },
  { name: "Tratamento de Esgoto", slug: "tratamento-esgoto", color: "#8B5CF6" },
  { name: "Regulação e Política", slug: "regulacao-politica", color: "#EC4899" },
  { name: "Tecnologia e Inovação", slug: "tecnologia-inovacao", color: "#22C55E" },
  { name: "Engenharia", slug: "engenharia", color: "#F59E0B" },
  { name: "Meio Ambiente", slug: "meio-ambiente", color: "#14B8A6" },
  { name: "Mercado e Negócios", slug: "mercado-negocios", color: "#EF4444" },
  { name: "Infraestrutura", slug: "infraestrutura", color: "#6366F1" },
];

export const regions = [
  { label: "Nacional", value: "NACIONAL" },
  { label: "Sudeste", value: "SUDESTE" },
  { label: "Sul", value: "SUL" },
  { label: "Nordeste", value: "NORDESTE" },
  { label: "Centro-Oeste", value: "CENTRO_OESTE" },
  { label: "Norte", value: "NORTE" },
  { label: "Intermunicipal", value: "INTERMUNICIPAL" },
];

export const brazilianStates = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
  "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR",
  "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];
