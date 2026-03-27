import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateLicitacoesPDF } from "@/lib/export/pdf-generator";

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
      take: 500, // Limit to avoid memory issues
    });

    const pdfBuffer = generateLicitacoesPDF(licitacoes);

    const date = new Date().toISOString().slice(0, 10);
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="licitacoes_${date}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Falha ao gerar PDF" },
      { status: 500 }
    );
  }
}
