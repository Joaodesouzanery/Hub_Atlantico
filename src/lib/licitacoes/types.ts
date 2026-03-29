export interface RawLicitacao {
  title: string;
  description: string;
  process?: string;
  modalidade: string;
  status: string;
  estimatedValue?: number;
  uf?: string;
  city?: string;
  organ?: string;
  organCnpj?: string;
  originalUrl: string;
  editalUrl?: string;
  openDate?: Date;
  closeDate?: Date;
  publishedAt: Date;
  sourceName: string;
  // Campos adicionais
  itemCount?: number;
  srp?: boolean;
  amparoLegal?: string;
  contactEmail?: string;
  contactPhone?: string;
  bidSubmissionEnd?: Date;
  resultDate?: Date;
}

export interface LicitacaoFetchConfig {
  searchEndpoint?: string;
  proposalEndpoint?: string;
  defaultPageSize?: number;
  keywords?: string[];
  format?: string;
  articleListSelector?: string;
  titleSelector?: string;
  linkSelector?: string;
  dateSelector?: string;
}

export interface LicitacaoSourceAdapter {
  sourceSlug: string;
  sourceName: string;
  fetch(): Promise<RawLicitacao[]>;
}

export interface LicitacaoFetchResult {
  sourceSlug: string;
  sourceName: string;
  licitacoes: RawLicitacao[];
  error?: string;
  duration: number;
}
