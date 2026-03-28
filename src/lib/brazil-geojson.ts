import type { FeatureCollection, Feature, Polygon } from "geojson";

interface StateProperties {
  UF: string;
  name: string;
}

type BrazilFeature = Feature<Polygon, StateProperties>;

export const brazilGeoJSON: FeatureCollection<Polygon, StateProperties> = {
  type: "FeatureCollection",
  features: [
    // ── Norte ──────────────────────────────────────────────
    {
      type: "Feature",
      properties: { UF: "AC", name: "Acre" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.0, -7.1],
            [-70.0, -7.1],
            [-66.6, -9.5],
            [-66.6, -11.0],
            [-70.0, -11.0],
            [-74.0, -9.5],
            [-74.0, -7.1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "AM", name: "Amazonas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.0, 2.2],
            [-66.0, 2.2],
            [-60.0, 1.4],
            [-56.1, -1.0],
            [-56.1, -5.0],
            [-58.0, -7.5],
            [-62.0, -9.7],
            [-66.6, -9.5],
            [-70.0, -7.1],
            [-74.0, -7.1],
            [-73.6, -2.4],
            [-70.0, 2.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "RR", name: "Roraima" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-64.2, 5.3],
            [-60.0, 5.2],
            [-59.8, 2.5],
            [-60.0, 1.4],
            [-62.0, 0.7],
            [-64.2, 1.5],
            [-64.2, 5.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "AP", name: "Amapá" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-52.0, 4.4],
            [-50.0, 4.0],
            [-49.9, 2.2],
            [-50.5, 0.0],
            [-51.2, -1.0],
            [-52.4, 0.7],
            [-52.0, 2.2],
            [-52.0, 4.4],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "PA", name: "Pará" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-56.1, -1.0],
            [-54.0, -1.0],
            [-51.2, -1.0],
            [-48.5, -1.5],
            [-46.0, -2.5],
            [-46.0, -6.0],
            [-47.5, -9.0],
            [-49.5, -9.3],
            [-51.0, -7.8],
            [-54.3, -6.0],
            [-56.1, -5.0],
            [-56.1, -1.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "RO", name: "Rondônia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-66.6, -9.5],
            [-62.0, -9.7],
            [-60.0, -11.0],
            [-60.0, -13.5],
            [-63.3, -13.5],
            [-66.0, -12.0],
            [-66.6, -11.0],
            [-66.6, -9.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "TO", name: "Tocantins" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-49.5, -5.2],
            [-47.5, -5.3],
            [-46.0, -6.0],
            [-46.5, -10.0],
            [-47.3, -13.3],
            [-49.0, -13.3],
            [-50.5, -11.0],
            [-50.7, -8.0],
            [-49.5, -5.2],
          ],
        ],
      },
    },
    // ── Nordeste ──────────────────────────────────────────
    {
      type: "Feature",
      properties: { UF: "MA", name: "Maranhão" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-48.5, -1.5],
            [-45.0, -1.5],
            [-42.0, -2.5],
            [-41.8, -3.5],
            [-43.0, -7.0],
            [-44.5, -10.4],
            [-46.0, -10.5],
            [-47.5, -9.0],
            [-46.0, -6.0],
            [-46.0, -2.5],
            [-48.5, -1.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "PI", name: "Piauí" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-43.0, -2.8],
            [-41.3, -2.8],
            [-40.5, -5.2],
            [-40.3, -7.5],
            [-40.8, -10.5],
            [-42.5, -11.0],
            [-44.5, -10.4],
            [-43.0, -7.0],
            [-43.0, -2.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "CE", name: "Ceará" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-41.3, -2.8],
            [-39.0, -3.1],
            [-37.3, -3.7],
            [-37.8, -5.1],
            [-38.5, -7.3],
            [-40.3, -7.5],
            [-40.5, -5.2],
            [-41.3, -2.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "RN", name: "Rio Grande do Norte" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-37.3, -4.8],
            [-35.0, -5.1],
            [-35.1, -6.4],
            [-36.6, -6.5],
            [-37.8, -5.8],
            [-37.3, -4.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "PB", name: "Paraíba" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-38.5, -6.3],
            [-36.6, -6.5],
            [-35.0, -6.8],
            [-34.8, -7.4],
            [-36.0, -7.6],
            [-38.2, -7.5],
            [-38.5, -7.0],
            [-38.5, -6.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "PE", name: "Pernambuco" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-40.3, -7.5],
            [-38.5, -7.5],
            [-36.0, -7.6],
            [-34.8, -7.9],
            [-34.9, -8.9],
            [-36.4, -8.9],
            [-38.0, -9.0],
            [-40.2, -9.0],
            [-40.8, -8.3],
            [-40.3, -7.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "AL", name: "Alagoas" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-36.4, -8.9],
            [-35.2, -9.1],
            [-35.5, -10.3],
            [-36.6, -10.5],
            [-37.3, -10.0],
            [-37.5, -9.3],
            [-36.4, -8.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "SE", name: "Sergipe" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-37.5, -9.5],
            [-37.0, -10.0],
            [-36.4, -10.5],
            [-36.4, -11.5],
            [-37.5, -11.4],
            [-38.2, -10.5],
            [-37.5, -9.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "BA", name: "Bahia" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-44.5, -10.4],
            [-42.5, -11.0],
            [-40.8, -10.5],
            [-38.2, -10.5],
            [-37.5, -11.4],
            [-38.0, -13.0],
            [-38.5, -15.0],
            [-39.0, -17.3],
            [-39.8, -17.8],
            [-41.0, -17.0],
            [-43.0, -15.0],
            [-44.5, -14.0],
            [-46.5, -14.0],
            [-46.5, -12.0],
            [-44.5, -10.4],
          ],
        ],
      },
    },
    // ── Centro-Oeste ─────────────────────────────────────
    {
      type: "Feature",
      properties: { UF: "MT", name: "Mato Grosso" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-60.0, -7.5],
            [-56.1, -5.0],
            [-54.3, -6.0],
            [-51.0, -7.8],
            [-50.7, -8.0],
            [-50.5, -11.0],
            [-49.0, -13.3],
            [-50.2, -15.7],
            [-52.0, -17.7],
            [-54.8, -17.7],
            [-57.5, -15.8],
            [-58.2, -13.0],
            [-60.0, -13.5],
            [-60.0, -11.0],
            [-60.0, -7.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "GO", name: "Goiás" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-49.0, -13.0],
            [-47.3, -13.3],
            [-46.5, -14.0],
            [-46.5, -15.5],
            [-47.0, -15.5],
            [-47.6, -15.6],
            [-48.2, -15.6],
            [-48.5, -15.5],
            [-49.5, -16.0],
            [-50.5, -17.7],
            [-51.5, -18.3],
            [-51.0, -16.0],
            [-50.2, -15.7],
            [-49.0, -13.3],
            [-49.0, -13.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "DF", name: "Distrito Federal" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-48.2, -15.5],
            [-47.6, -15.5],
            [-47.3, -15.6],
            [-47.3, -16.0],
            [-47.6, -16.1],
            [-48.2, -16.0],
            [-48.2, -15.5],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "MS", name: "Mato Grosso do Sul" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-57.5, -15.8],
            [-54.8, -17.7],
            [-52.0, -17.7],
            [-51.5, -18.3],
            [-53.0, -20.5],
            [-54.0, -22.0],
            [-54.6, -23.9],
            [-55.7, -24.0],
            [-57.6, -22.3],
            [-57.8, -19.8],
            [-57.5, -15.8],
          ],
        ],
      },
    },
    // ── Sudeste ──────────────────────────────────────────
    {
      type: "Feature",
      properties: { UF: "MG", name: "Minas Gerais" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-51.0, -14.3],
            [-46.5, -14.0],
            [-44.5, -14.0],
            [-43.0, -15.0],
            [-41.0, -17.0],
            [-39.8, -17.8],
            [-40.0, -19.0],
            [-40.8, -20.0],
            [-41.9, -21.0],
            [-43.2, -22.5],
            [-44.6, -23.0],
            [-46.5, -22.5],
            [-47.2, -21.0],
            [-49.0, -20.3],
            [-50.5, -20.0],
            [-51.5, -18.3],
            [-50.5, -17.7],
            [-51.0, -16.0],
            [-51.0, -14.3],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "ES", name: "Espírito Santo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-41.9, -17.9],
            [-39.8, -17.8],
            [-39.7, -19.4],
            [-40.0, -20.0],
            [-40.4, -21.1],
            [-41.0, -21.3],
            [-41.9, -20.0],
            [-41.9, -17.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "RJ", name: "Rio de Janeiro" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-44.6, -21.0],
            [-43.2, -21.5],
            [-41.9, -21.0],
            [-41.0, -21.3],
            [-41.0, -22.0],
            [-41.9, -22.8],
            [-43.2, -23.1],
            [-44.6, -23.0],
            [-44.6, -21.0],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "SP", name: "São Paulo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-53.0, -20.0],
            [-50.5, -20.0],
            [-49.0, -20.3],
            [-47.2, -21.0],
            [-46.5, -22.5],
            [-44.6, -23.0],
            [-44.6, -23.8],
            [-46.0, -24.5],
            [-48.0, -25.3],
            [-50.0, -25.5],
            [-52.0, -24.0],
            [-53.0, -22.5],
            [-53.0, -20.0],
          ],
        ],
      },
    },
    // ── Sul ──────────────────────────────────────────────
    {
      type: "Feature",
      properties: { UF: "PR", name: "Paraná" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-54.6, -23.9],
            [-54.0, -22.0],
            [-53.0, -22.5],
            [-52.0, -24.0],
            [-50.0, -25.5],
            [-48.0, -25.3],
            [-49.0, -26.3],
            [-51.0, -26.3],
            [-53.5, -25.8],
            [-54.6, -25.5],
            [-54.6, -23.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "SC", name: "Santa Catarina" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-53.5, -25.8],
            [-51.0, -26.3],
            [-49.0, -26.3],
            [-48.6, -27.3],
            [-48.6, -28.3],
            [-49.6, -29.3],
            [-51.5, -29.3],
            [-53.5, -28.7],
            [-53.8, -27.1],
            [-53.5, -25.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { UF: "RS", name: "Rio Grande do Sul" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-53.5, -28.7],
            [-51.5, -29.3],
            [-49.6, -29.3],
            [-49.7, -29.8],
            [-50.2, -31.0],
            [-51.0, -32.0],
            [-52.0, -33.0],
            [-53.3, -33.7],
            [-54.5, -33.7],
            [-56.0, -32.0],
            [-57.6, -30.2],
            [-55.5, -28.7],
            [-53.5, -28.7],
          ],
        ],
      },
    },
  ] as BrazilFeature[],
};
