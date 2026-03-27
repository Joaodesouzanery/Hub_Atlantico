import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateLicitacoesExcel } from "@/lib/export/excel-generator";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build filter query from search params
    const where: Record<string, unknown> = {};

    if (searchParams.get("status")) {
      where.status = searchParams.get("status");
    }
    if (searchParams.get("uf")) {
      where.uf = searchParams.get("uf");
    }
    if (searchParams.get("modalidade")) {
      where.modalidade = searchParams.get("modalidade");
    }
    if (searchParams.get("search")) {
      const search = searchParams.get("search")!;
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { organ: { contains: search } },
      ];
    }

    const licitacoes = await prisma.licitacao.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 5000, // Excel can handle more rows
    });

    const buffer = await generateLicitacoesExcel(licitacoes);

    const date = new Date().toISOString().slice(0, 10);
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="licitacoes_${date}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json(
      { error: "Falha ao gerar Excel" },
      { status: 500 }
    );
  }
}
