import ExcelJS from "exceljs";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatModalidade(mod: string | null | undefined): string {
  if (!mod) return "";
  return mod.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Add LGPD notice + metadata header rows */
function addReportHeader(sheet: ExcelJS.Worksheet, title: string, totalRecords: number, colCount: number) {
  const now = new Date();

  // Row 1: Title
  const titleRow = sheet.addRow([title]);
  titleRow.font = { bold: true, size: 14, color: { argb: "FFF97316" } };
  titleRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  titleRow.height = 28;
  sheet.mergeCells(1, 1, 1, colCount);

  // Row 2: Metadata
  const metaRow = sheet.addRow([
    `Gerado em: ${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} | Total: ${totalRecords.toLocaleString("pt-BR")} registros | Plataforma: HuB — Atlântico`
  ]);
  metaRow.font = { size: 9, color: { argb: "FF94A3B8" } };
  metaRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
  metaRow.height = 20;
  sheet.mergeCells(2, 1, 2, colCount);

  // Row 3: LGPD notice
  const lgpdRow = sheet.addRow([
    "AVISO LGPD: Este relatório contém apenas dados de órgãos públicos e pessoas jurídicas, conforme a Lei 13.709/2018 (LGPD). Nenhum dado pessoal sensível é coletado ou armazenado pela plataforma."
  ]);
  lgpdRow.font = { size: 8, italic: true, color: { argb: "FF64748B" } };
  lgpdRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
  lgpdRow.height = 18;
  sheet.mergeCells(3, 1, 3, colCount);

  // Row 4: empty separator
  sheet.addRow([]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateLicitacoesExcel(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HuB — Atlântico";
  workbook.created = new Date();
  workbook.company = "HuB — Atlântico | Plataforma de Saneamento";

  const sheet = workbook.addWorksheet("Licitações", {
    properties: { defaultColWidth: 20 },
    views: [{ state: "frozen", ySplit: 5 }], // Freeze header rows
  });

  const columns = [
    { header: "Título", key: "title", width: 50 },
    { header: "Órgão", key: "organ", width: 35 },
    { header: "CNPJ", key: "organCnpj", width: 20 },
    { header: "UF", key: "uf", width: 8 },
    { header: "Cidade", key: "city", width: 20 },
    { header: "Modalidade", key: "modalidade", width: 22 },
    { header: "Status", key: "status", width: 15 },
    { header: "Valor Estimado", key: "estimatedValue", width: 22 },
    { header: "Data Publicação", key: "publishedAt", width: 16 },
    { header: "Data Encerramento", key: "closeDate", width: 16 },
    { header: "Categoria", key: "category", width: 20 },
    { header: "Fonte", key: "source", width: 15 },
    { header: "URL Original", key: "originalUrl", width: 45 },
  ];

  // Header rows (title, metadata, LGPD)
  addReportHeader(sheet, "Relatório de Licitações — Saneamento e Água", data.length, columns.length);

  // Row 5: Column headers
  sheet.columns = columns;
  const headerRow = sheet.getRow(5);
  headerRow.values = columns.map((c) => c.header);
  headerRow.font = { bold: true, color: { argb: "FFF97316" }, size: 10 };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 22;
  headerRow.border = {
    bottom: { style: "medium", color: { argb: "FFF97316" } },
  };

  // Data rows
  for (const item of data) {
    sheet.addRow({
      title: item.title || "",
      organ: item.organ || "",
      organCnpj: item.organCnpj || "",
      uf: item.uf || "",
      city: item.city || "",
      modalidade: formatModalidade(item.modalidade),
      status: item.status || "",
      estimatedValue: formatCurrency(item.estimatedValue),
      publishedAt: formatDate(item.publishedAt),
      closeDate: formatDate(item.closeDate),
      category: item.category?.name || "",
      source: item.source?.name || "",
      originalUrl: item.originalUrl || "",
    });
  }

  // Style data rows
  for (let i = 6; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.font = { size: 9, color: { argb: "FFE2E8F0" } };
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: i % 2 === 0 ? "FF0F172A" : "FF1E293B" },
    };
  }

  // Auto-fit
  sheet.columns.forEach((column) => {
    if (!column || !column.eachCell) return;
    let maxLength = (column.header as string)?.length || 10;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLength) maxLength = len;
    });
    column.width = Math.min(maxLength + 4, 70);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateNoticiasExcel(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HuB — Atlântico";
  workbook.created = new Date();
  workbook.company = "HuB — Atlântico | Plataforma de Saneamento";

  const sheet = workbook.addWorksheet("Notícias", {
    properties: { defaultColWidth: 20 },
    views: [{ state: "frozen", ySplit: 5 }],
  });

  const columns = [
    { header: "Título", key: "title", width: 50 },
    { header: "Resumo", key: "summary", width: 60 },
    { header: "Fonte", key: "source", width: 25 },
    { header: "Categoria", key: "category", width: 20 },
    { header: "Data de Publicação", key: "publishedAt", width: 18 },
    { header: "URL Original", key: "originalUrl", width: 50 },
  ];

  addReportHeader(sheet, "Relatório de Notícias — Saneamento e Água", data.length, columns.length);

  sheet.columns = columns;
  const headerRow = sheet.getRow(5);
  headerRow.values = columns.map((c) => c.header);
  headerRow.font = { bold: true, color: { argb: "FFF97316" }, size: 10 };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 22;
  headerRow.border = {
    bottom: { style: "medium", color: { argb: "FFF97316" } },
  };

  for (const item of data) {
    sheet.addRow({
      title: item.title || "",
      summary: item.summary || "",
      source: item.source?.name || "",
      category: item.category?.name || "",
      publishedAt: formatDate(item.publishedAt),
      originalUrl: item.originalUrl || "",
    });
  }

  for (let i = 6; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.font = { size: 9, color: { argb: "FFE2E8F0" } };
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: i % 2 === 0 ? "FF0F172A" : "FF1E293B" },
    };
  }

  sheet.columns.forEach((column) => {
    if (!column || !column.eachCell) return;
    let maxLength = (column.header as string)?.length || 10;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLength) maxLength = len;
    });
    column.width = Math.min(maxLength + 4, 70);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
