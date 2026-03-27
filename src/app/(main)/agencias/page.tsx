import { prisma } from "@/lib/db";
import { Landmark } from "lucide-react";
import { AgencyCard } from "@/components/agencies/agency-card";
import { RegionFilter } from "@/components/agencies/region-filter";

export const metadata = {
  title: "Agências Reguladoras",
  description:
    "Conheça as agências reguladoras do setor de saneamento no Brasil.",
};

export const dynamic = "force-dynamic";

const regionOrder = [
  "NACIONAL",
  "SUDESTE",
  "SUL",
  "NORDESTE",
  "CENTRO_OESTE",
  "NORTE",
  "INTERMUNICIPAL",
];

const regionLabels: Record<string, string> = {
  NACIONAL: "Nacional",
  SUDESTE: "Sudeste",
  SUL: "Sul",
  NORDESTE: "Nordeste",
  CENTRO_OESTE: "Centro-Oeste",
  NORTE: "Norte",
  INTERMUNICIPAL: "Intermunicipal",
};

const regionColors: Record<string, string> = {
  NACIONAL: "#F97316",
  SUDESTE: "#3B82F6",
  SUL: "#22C55E",
  NORDESTE: "#8B5CF6",
  CENTRO_OESTE: "#F59E0B",
  NORTE: "#14B8A6",
  INTERMUNICIPAL: "#EC4899",
};

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

export default async function AgenciasPage({ searchParams }: PageProps) {
  const { region } = await searchParams;

  const agencies = await prisma.regulatoryAgency.findMany({
    where: {
      isActive: true,
      ...(region ? { region } : {}),
    },
    orderBy: [{ region: "asc" }, { name: "asc" }],
  });

  // Group agencies by region
  const grouped = new Map<string, typeof agencies>();
  for (const agency of agencies) {
    const list = grouped.get(agency.region) || [];
    list.push(agency);
    grouped.set(agency.region, list);
  }

  // Sort groups by the defined region order
  const sortedRegions = regionOrder.filter((r) => grouped.has(r));

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Landmark className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Agências Reguladoras
            </h1>
            <p className="mt-0.5 text-sm text-text-muted">
              {agencies.length} agência{agencies.length !== 1 ? "s" : ""}{" "}
              ativa{agencies.length !== 1 ? "s" : ""}
              {region ? ` na região ${regionLabels[region] || region}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Region Filter */}
      <div className="mb-6">
        <RegionFilter />
      </div>

      {/* Grouped Agencies */}
      {sortedRegions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dark-border bg-dark-card py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-dark-surface">
            <Landmark className="h-7 w-7 text-text-muted" />
          </div>
          <p className="text-text-secondary">
            Nenhuma agência encontrada
            {region ? ` para a região ${regionLabels[region] || region}` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedRegions.map((regionKey) => {
            const regionAgencies = grouped.get(regionKey)!;
            const color = regionColors[regionKey] || "#F97316";

            return (
              <section key={regionKey}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h2 className="text-lg font-semibold text-text-primary">
                    {regionLabels[regionKey] || regionKey}
                  </h2>
                  <span className="text-sm text-text-muted">
                    ({regionAgencies.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {regionAgencies.map((agency) => (
                    <AgencyCard
                      key={agency.id}
                      slug={agency.slug}
                      name={agency.name}
                      fullName={agency.fullName}
                      region={agency.region}
                      uf={agency.uf}
                      description={agency.description}
                      websiteUrl={agency.websiteUrl}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
