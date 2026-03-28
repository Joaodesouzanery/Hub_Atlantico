import { jsPDF } from "jspdf";

interface LicitacaoRow {
  title: string;
  organ?: string | null;
  uf?: string | null;
  estimatedValue?: number | null;
  status: string;
  publishedAt: Date | string;
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "N/I";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

export function generateLicitacoesPDF(data: LicitacaoRow[]): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // --- Header ---
  doc.setFillColor(12, 12, 14); // #0C0C0E
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(249, 115, 22); // #F97316
  doc.text("HuB - Atlântico", margin, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(160, 160, 168); // #A0A0A8
  doc.text("Relatório de Licitações", margin, 22);

  doc.setFontSize(9);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} | Total: ${data.length} registros`,
    pageWidth - margin,
    22,
    { align: "right" }
  );

  // --- Table setup ---
  const columns = [
    { header: "Título", width: 80 },
    { header: "Órgão", width: 55 },
    { header: "UF", width: 15 },
    { header: "Valor", width: 35 },
    { header: "Status", width: 28 },
    { header: "Data", width: 25 },
  ];

  const tableX = margin;
  let tableY = 34;
  const rowHeight = 8;
  const headerHeight = 9;

  function drawTableHeader() {
    doc.setFillColor(26, 26, 29); // #1A1A1D
    doc.rect(
      tableX,
      tableY,
      columns.reduce((sum, c) => sum + c.width, 0),
      headerHeight,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(249, 115, 22); // accent
    let colX = tableX + 2;
    for (const col of columns) {
      doc.text(col.header, colX, tableY + 6);
      colX += col.width;
    }
    tableY += headerHeight;
  }

  function drawRow(row: LicitacaoRow, index: number) {
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(20, 20, 22); // #141416
      doc.rect(
        tableX,
        tableY,
        columns.reduce((sum, c) => sum + c.width, 0),
        rowHeight,
        "F"
      );
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(245, 245, 245); // #F5F5F5

    let colX = tableX + 2;
    const values = [
      truncate(row.title || "", 55),
      truncate(row.organ || "N/I", 35),
      row.uf || "N/I",
      formatCurrency(row.estimatedValue),
      row.status || "N/I",
      formatDate(row.publishedAt),
    ];

    for (let i = 0; i < columns.length; i++) {
      doc.text(values[i], colX, tableY + 5.5);
      colX += columns[i].width;
    }

    tableY += rowHeight;
  }

  drawTableHeader();

  for (let i = 0; i < data.length; i++) {
    // Check if we need a new page
    if (tableY + rowHeight > pageHeight - 15) {
      // Footer on current page
      doc.setFontSize(7);
      doc.setTextColor(107, 107, 115); // muted
      doc.text(
        `HuB - Atlântico | Página ${doc.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      doc.addPage();
      tableY = 14;
      drawTableHeader();
    }

    drawRow(data[i], i);
  }

  // Footer on last page
  doc.setFontSize(7);
  doc.setTextColor(107, 107, 115);
  doc.text(
    `HuB - Atlântico | Página ${doc.getNumberOfPages()}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}

interface NewsRow {
  title: string;
  summary?: string | null;
  source?: { name: string } | null;
  category?: { name: string } | null;
  publishedAt: Date | string;
}

export function generateNoticiasPDF(data: NewsRow[]): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // --- Header ---
  doc.setFillColor(12, 12, 14);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(249, 115, 22);
  doc.text("HuB - Atlântico", margin, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(160, 160, 168);
  doc.text("Relatório de Notícias", margin, 22);

  doc.setFontSize(9);
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} | Total: ${data.length} registros`,
    pageWidth - margin,
    22,
    { align: "right" }
  );

  // --- Table setup ---
  const columns = [
    { header: "Título", width: 90 },
    { header: "Resumo", width: 80 },
    { header: "Fonte", width: 35 },
    { header: "Categoria", width: 30 },
    { header: "Data", width: 25 },
  ];

  const tableX = margin;
  let tableY = 34;
  const rowHeight = 8;
  const headerHeight = 9;

  function drawTableHeader() {
    doc.setFillColor(26, 26, 29);
    doc.rect(
      tableX,
      tableY,
      columns.reduce((sum, c) => sum + c.width, 0),
      headerHeight,
      "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(249, 115, 22);
    let colX = tableX + 2;
    for (const col of columns) {
      doc.text(col.header, colX, tableY + 6);
      colX += col.width;
    }
    tableY += headerHeight;
  }

  function drawRow(row: NewsRow, index: number) {
    if (index % 2 === 0) {
      doc.setFillColor(20, 20, 22);
      doc.rect(
        tableX,
        tableY,
        columns.reduce((sum, c) => sum + c.width, 0),
        rowHeight,
        "F"
      );
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(245, 245, 245);

    let colX = tableX + 2;
    const values = [
      truncate(row.title || "", 60),
      truncate(row.summary || "N/I", 50),
      truncate(row.source?.name || "N/I", 22),
      truncate(row.category?.name || "N/I", 18),
      formatDate(row.publishedAt),
    ];

    for (let i = 0; i < columns.length; i++) {
      doc.text(values[i], colX, tableY + 5.5);
      colX += columns[i].width;
    }

    tableY += rowHeight;
  }

  drawTableHeader();

  for (let i = 0; i < data.length; i++) {
    if (tableY + rowHeight > pageHeight - 15) {
      doc.setFontSize(7);
      doc.setTextColor(107, 107, 115);
      doc.text(
        `HuB - Atlântico | Página ${doc.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      doc.addPage();
      tableY = 14;
      drawTableHeader();
    }

    drawRow(data[i], i);
  }

  doc.setFontSize(7);
  doc.setTextColor(107, 107, 115);
  doc.text(
    `HuB - Atlântico | Página ${doc.getNumberOfPages()}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}
