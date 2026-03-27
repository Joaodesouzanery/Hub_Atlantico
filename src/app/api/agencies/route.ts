import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region");

  try {
    const agencies = await prisma.regulatoryAgency.findMany({
      where: {
        isActive: true,
        ...(region ? { region } : {}),
      },
      orderBy: [{ region: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(agencies);
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch agencies" },
      { status: 500 }
    );
  }
}
