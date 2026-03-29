import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchFromPNCP } from "@/lib/licitacoes/adapters/pncp-api";
import { categorizeLicitacao } from "@/lib/licitacoes/categorizer";
import { scoreLicitacaoRelevance } from "@/lib/licitacoes/relevance-scorer";
import slugify from "slugify";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Rotate through modalidades across cron runs (2 per run to fit in 60s)
const ALL_MODALIDADES = [8, 6, 1, 2, 4, 5, 7];
const BATCH_SIZE = 2;

async function handler(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Determine which modalidades to fetch this run
    const lastLog = await prisma.licitacaoFetchLog.findFirst({
      where: { sourceName: "PNCP-cron" },
      orderBy: { createdAt: "desc" },
      select: { errorMessage: true },
    });
    const lastOffset = parseInt(lastLog?.errorMessage || "0", 10);
    const offset = isNaN(lastOffset) ? 0 : (lastOffset + BATCH_SIZE) % ALL_MODALIDADES.length;
    const batch = ALL_MODALIDADES.slice(offset, offset + BATCH_SIZE);

    const config = {
      searchEndpoint: "/v1/contratacoes/publicacao",
      defaultPageSize: 50,
      modalidades: batch,
    };

    // Fetch from PNCP
    const licitacoes = await fetchFromPNCP(
      config as Parameters<typeof fetchFromPNCP>[0],
      "PNCP",
      false // rolling fetch
    );

    // Store new ones
    const sources = await prisma.licitacaoSource.findMany({ where: { isActive: true } });
    const sourceId = sources.find((s) => s.slug === "pncp")?.id || sources[0]?.id;
    const categories = await prisma.licitacaoCategory.findMany();
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    const existingUrls = new Set(
      (await prisma.licitacao.findMany({ select: { originalUrl: true } })).map((l) => l.originalUrl)
    );

    let newCount = 0;
    for (const lic of licitacoes) {
      if (existingUrls.has(lic.originalUrl)) continue;
      if (!sourceId) continue;

      const relevanceScore = scoreLicitacaoRelevance(lic.title, lic.description);
      const categorySlug = await categorizeLicitacao(lic.title, lic.description);
      const categoryId = categoryMap.get(categorySlug) || null;
      const baseSlug = slugify(lic.title, { lower: true, strict: true, locale: "pt" }).slice(0, 100);

      try {
        await prisma.licitacao.create({
          data: {
            slug: `${baseSlug}-${Date.now().toString(36)}`,
            title: lic.title, description: lic.description, process: lic.process,
            modalidade: lic.modalidade, status: lic.status,
            estimatedValue: lic.estimatedValue, currency: "BRL",
            uf: lic.uf, city: lic.city, organ: lic.organ, organCnpj: lic.organCnpj,
            originalUrl: lic.originalUrl, editalUrl: lic.editalUrl,
            sourceId, categoryId, openDate: lic.openDate, closeDate: lic.closeDate,
            publishedAt: lic.publishedAt, relevanceScore,
            itemCount: lic.itemCount, srp: lic.srp ?? false,
            amparoLegal: lic.amparoLegal, contactEmail: lic.contactEmail,
            contactPhone: lic.contactPhone, bidSubmissionEnd: lic.bidSubmissionEnd,
            resultDate: lic.resultDate,
          },
        });
        newCount++;
        existingUrls.add(lic.originalUrl);
      } catch { /* skip duplicates */ }
    }

    // Log the offset for next run (store in errorMessage field as a hack)
    await prisma.licitacaoFetchLog.create({
      data: {
        sourceId: "pncp-cron",
        sourceName: "PNCP-cron",
        status: "success",
        licitacoesFound: licitacoes.length,
        licitacoesNew: newCount,
        errorMessage: String(offset), // Store offset for next rotation
        duration: 0,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      modalidades: batch,
      nextOffset: (offset + BATCH_SIZE) % ALL_MODALIDADES.length,
      fetched: licitacoes.length,
      newLicitacoes: newCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron fetch-licitacoes error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
