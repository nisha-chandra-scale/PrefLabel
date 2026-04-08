import { NextResponse } from "next/server";
import { readPairs, readLabels } from "@/lib/store";
import { computeAgreement } from "@/lib/stats";

export async function GET() {
  const pairs = readPairs();
  const labels = readLabels();

  // Build RLHF-compatible output: one record per pair with majority preference
  const records = pairs
    .map((pair) => {
      const stats = computeAgreement(pair, labels);
      if (stats.totalLabels === 0) return null;

      const pairLabels = labels.filter((l) => l.pairId === pair.id);
      const avgConfidence =
        pairLabels.reduce((s, l) => s + l.confidenceScore, 0) / pairLabels.length;

      return {
        id: pair.id,
        prompt: pair.prompt,
        chosen: stats.majorityPreference === "A" ? pair.responseA : pair.responseB,
        rejected: stats.majorityPreference === "A" ? pair.responseB : pair.responseA,
        chosen_model: stats.majorityPreference === "A" ? pair.modelA : pair.modelB,
        rejected_model: stats.majorityPreference === "A" ? pair.modelB : pair.modelA,
        preference: stats.majorityPreference,
        agreement_rate: stats.agreementRate,
        avg_confidence: avgConfidence,
        num_annotators: stats.totalLabels,
        low_confidence: stats.isLowConfidence,
        category: pair.category,
        rationales: pairLabels
          .filter((l) => l.rationale)
          .map((l) => l.rationale),
      };
    })
    .filter(Boolean);

  const jsonl = records.map((r) => JSON.stringify(r)).join("\n");

  return new NextResponse(jsonl, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Content-Disposition": `attachment; filename="preflabel_export_${Date.now()}.jsonl"`,
    },
  });
}
