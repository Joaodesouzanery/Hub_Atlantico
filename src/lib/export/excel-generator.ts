import ExcelJS from "exceljs";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// ---------- Licitações ----------

export async function generateLicitacoesExcel(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HuB - Atlântico";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Licitações", {
    properties: { defaultColWidth: 20 },
  });

  // Define columns
  sheet.columns = [
    { header: "Título", key: "title", width: 50 },
    { header: "Descrição", key: "description", width: 60 },
    { header: "Órgão", key: "organ", width: 35 },
    { header: "UF", key: "uf", width: 8 },
    { header: "Cidade", key: "city", width: 20 },
    { header: "Modalidade", key: "modalidade", width: 22 },
    { header: "Status", key: "status", width: 15 },
    { header: "Valor Estimado", key: "estimatedValue", width: 20 },
    { header: "Data de Publicação", key: "publishedAt", width: 18 },
    { header: "URL Original", key: "originalUrl", width: 45 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFF5F5F5" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A1A1D" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 24;

  // Add data rows
  for (const item of data) {
    sheet.addRow({
      title: item.title || "",
      description: item.description || "",
      organ: item.organ || "",
      uf: item.uf || "",
      city: item.city || "",
      modalidade: item.modalidade || "",
      status: item.status || "",
      estimatedValue: formatCurrency(item.estimatedValue),
      publishedAt: formatDate(item.publishedAt),
      originalUrl: item.originalUrl || "",
    });
  }

  // Style data rows with alternating colours
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.font = { size: 10, color: { argb: "FFA0A0A8" } };
    if (i % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF141416" },
      };
    }
  }

  // Auto-fit column widths based on content (approximate)
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

// ---------- Notícias ----------

export async function generateNoticiasExcel(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HuB - Atlântico";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Notícias", {
    properties: { defaultColWidth: 20 },
  });

  sheet.columns = [
    { header: "Título", key: "title", width: 50 },
    { header: "Resumo", key: "summary", width: 60 },
    { header: "Fonte", key: "source", width: 25 },
    { header: "Categoria", key: "category", width: 20 },
    { header: "Data de Publicação", key: "publishedAt", width: 18 },
    { header: "URL Original", key: "originalUrl", width: 50 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFF5F5F5" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1A1A1D" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 24;

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

  // Style data rows
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    row.font = { size: 10, color: { argb: "FFA0A0A8" } };
    if (i % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF141416" },
      };
    }
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
