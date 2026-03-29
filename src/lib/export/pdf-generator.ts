import { jsPDF } from "jspdf";

interface LicitacaoRow {
  title: string;
  description?: string | null;
  organ?: string | null;
  organCnpj?: string | null;
  uf?: string | null;
  city?: string | null;
  modalidade?: string | null;
  estimatedValue?: number | null;
  status: string;
  publishedAt: Date | string;
  closeDate?: Date | string | null;
  originalUrl?: string | null;
  source?: { name: string } | null;
  category?: { name: string } | null;
}

interface NewsRow {
  title: string;
  summary?: string | null;
  source?: { name: string } | null;
  category?: { name: string } | null;
  publishedAt: Date | string;
  originalUrl?: string | null;
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "N/I";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/I";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

function formatModalidade(mod: string | null | undefined): string {
  if (!mod) return "N/I";
  return mod.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Draw the standard report header with LGPD notice */
function drawReportHeader(doc: jsPDF, title: string, subtitle: string, totalRecords: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // Dark header band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 32, "F");

  // Orange accent line
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 32, pageWidth, 1.5, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(249, 115, 22);
  doc.text("HuB \u2014 Atl\u00e2ntico", margin, 13);

  // Report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(title, margin, 22);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(subtitle, margin, 28);

  // Right side: metadata
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const now = new Date();
  doc.text(`Gerado em: ${now.toLocaleDateString("pt-BR")} \u00e0s ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, pageWidth - margin, 13, { align: "right" });
  doc.text(`Total: ${totalRecords.toLocaleString("pt-BR")} registros`, pageWidth - margin, 19, { align: "right" });
  doc.text("Documento gerado automaticamente", pageWidth - margin, 25, { align: "right" });

  // LGPD notice bar
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 33.5, pageWidth, 8, "F");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    "AVISO LGPD: Este relat\u00f3rio cont\u00e9m apenas dados de \u00f3rg\u00e3os p\u00fablicos e pessoas jur\u00eddicas, conforme a Lei 13.709/2018. Nenhum dado pessoal sens\u00edvel \u00e9 coletado ou armazenado.",
    pageWidth / 2, 38.5,
    { align: "center" }
  );

  return 45; // Y position after header
}

/** Draw page footer */
function drawPageFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const totalPages = doc.getNumberOfPages();

  doc.setDrawColor(30, 41, 59);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text("HuB \u2014 Atl\u00e2ntico | Plataforma de Monitoramento de Saneamento e \u00c1gua", 14, pageHeight - 7);
  doc.text(`P\u00e1gina ${doc.getCurrentPageInfo().pageNumber} de ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: "right" });
}

export function generateLicitacoesPDF(data: LicitacaoRow[]): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  let tableY = drawReportHeader(doc, "Relat\u00f3rio de Licita\u00e7\u00f5es", "Licita\u00e7\u00f5es p\u00fablicas do setor de saneamento e \u00e1gua", data.length);

  // Summary stats
  const totalValue = data.reduce((sum, r) => sum + (r.estimatedValue || 0), 0);
  const abertas = data.filter((r) => r.status === "ABERTA").length;
  const ufs = new Set(data.map((r) => r.uf).filter(Boolean)).size;

  doc.setFillColor(20, 25, 35);
  doc.rect(margin, tableY, pageWidth - margin * 2, 10, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text(`Valor Total Estimado: ${formatCurrency(totalValue)}`, margin + 4, tableY + 6.5);
  doc.text(`Abertas: ${abertas}`, margin + 80, tableY + 6.5);
  doc.text(`Estados: ${ufs}`, margin + 110, tableY + 6.5);
  doc.text(`Per\u00edodo: \u00daltimos 90 dias`, margin + 140, tableY + 6.5);
  tableY += 14;

  // Table columns
  const columns = [
    { header: "T\u00edtulo", width: 70 },
    { header: "\u00d3rg\u00e3o / CNPJ", width: 50 },
    { header: "UF", width: 12 },
    { header: "Modalidade", width: 30 },
    { header: "Valor Estimado", width: 30 },
    { header: "Status", width: 22 },
    { header: "Publica\u00e7\u00e3o", width: 22 },
    { header: "Encerramento", width: 22 },
  ];

  const tableWidth = columns.reduce((s, c) => s + c.width, 0);
  const rowHeight = 7.5;
  const headerHeight = 8;

  function drawTableHeader() {
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, tableY, tableWidth, headerHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(249, 115, 22);
    let colX = margin + 2;
    for (const col of columns) {
      doc.text(col.header, colX, tableY + 5.5);
      colX += col.width;
    }
    tableY += headerHeight;
  }

  function drawRow(row: LicitacaoRow, index: number) {
    if (index % 2 === 0) {
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, tableY, tableWidth, rowHeight, "F");
    } else {
      doc.setFillColor(20, 27, 45);
      doc.rect(margin, tableY, tableWidth, rowHeight, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(226, 232, 240);

    const organText = [row.organ, row.organCnpj].filter(Boolean).join(" - ");

    let colX = margin + 2;
    const values = [
      truncate(row.title || "", 48),
      truncate(organText || "N/I", 32),
      row.uf || "N/I",
      formatModalidade(row.modalidade),
      formatCurrency(row.estimatedValue),
      row.status || "N/I",
      formatDate(row.publishedAt),
      formatDate(row.closeDate),
    ];

    for (let i = 0; i < columns.length; i++) {
      doc.text(values[i], colX, tableY + 5);
      colX += columns[i].width;
    }
    tableY += rowHeight;
  }

  drawTableHeader();

  for (let i = 0; i < Math.min(data.length, 2000); i++) {
    if (tableY + rowHeight > pageHeight - 16) {
      doc.addPage();
      tableY = 14;
      drawTableHeader();
    }
    drawRow(data[i], i);
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc);
  }

  return doc.output("arraybuffer");
}

export function generateNoticiasPDF(data: NewsRow[]): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  let tableY = drawReportHeader(doc, "Relat\u00f3rio de Not\u00edcias", "Not\u00edcias do setor de saneamento e \u00e1gua do Brasil", data.length);

  // Summary
  const sources = new Set(data.map((r) => r.source?.name).filter(Boolean)).size;
  const categories = new Set(data.map((r) => r.category?.name).filter(Boolean)).size;

  doc.setFillColor(20, 25, 35);
  doc.rect(margin, tableY, pageWidth - margin * 2, 10, "F");
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text(`Fontes: ${sources}`, margin + 4, tableY + 6.5);
  doc.text(`Categorias: ${categories}`, margin + 40, tableY + 6.5);
  doc.text(`Total: ${data.length.toLocaleString("pt-BR")} not\u00edcias`, margin + 80, tableY + 6.5);
  tableY += 14;

  const columns = [
    { header: "T\u00edtulo", width: 90 },
    { header: "Resumo", width: 80 },
    { header: "Fonte", width: 35 },
    { header: "Categoria", width: 30 },
    { header: "Data", width: 25 },
  ];

  const tableWidth = columns.reduce((s, c) => s + c.width, 0);
  const rowHeight = 7.5;
  const headerHeight = 8;

  function drawTableHeader() {
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, tableY, tableWidth, headerHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(249, 115, 22);
    let colX = margin + 2;
    for (const col of columns) {
      doc.text(col.header, colX, tableY + 5.5);
      colX += col.width;
    }
    tableY += headerHeight;
  }

  function drawRow(row: NewsRow, index: number) {
    if (index % 2 === 0) {
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, tableY, tableWidth, rowHeight, "F");
    } else {
      doc.setFillColor(20, 27, 45);
      doc.rect(margin, tableY, tableWidth, rowHeight, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(226, 232, 240);

    let colX = margin + 2;
    const values = [
      truncate(row.title || "", 60),
      truncate(row.summary || "N/I", 50),
      truncate(row.source?.name || "N/I", 22),
      truncate(row.category?.name || "N/I", 18),
      formatDate(row.publishedAt),
    ];

    for (let i = 0; i < columns.length; i++) {
      doc.text(values[i], colX, tableY + 5);
      colX += columns[i].width;
    }
    tableY += rowHeight;
  }

  drawTableHeader();

  for (let i = 0; i < Math.min(data.length, 2000); i++) {
    if (tableY + rowHeight > pageHeight - 16) {
      doc.addPage();
      tableY = 14;
      drawTableHeader();
    }
    drawRow(data[i], i);
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc);
  }

  return doc.output("arraybuffer");
}
