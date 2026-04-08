import { NextResponse } from "next/server";
import { readPairs, readLabels } from "@/lib/store";
import { computeDashboard, computeAgreement } from "@/lib/stats";

export async function GET() {
  const pairs = readPairs();
  const labels = readLabels();
  const dashboard = computeDashboard(pairs, labels);
  const agreementStats = pairs.map((p) => computeAgreement(p, labels));
  return NextResponse.json({ dashboard, agreementStats });
}
