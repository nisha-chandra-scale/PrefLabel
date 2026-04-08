import { NextRequest, NextResponse } from "next/server";
import { readPairs, readLabels } from "@/lib/store";

export async function GET(req: NextRequest) {
  const pairs = readPairs();
  const labels = readLabels();
  const { searchParams } = new URL(req.url);
  const annotatorId = searchParams.get("annotatorId") || "anonymous";

  // Find pairs not yet labeled by this annotator
  const labeledPairIds = new Set(
    labels.filter((l) => l.annotatorId === annotatorId).map((l) => l.pairId)
  );
  const unlabeled = pairs.filter((p) => !labeledPairIds.has(p.id));

  if (unlabeled.length === 0) {
    return NextResponse.json({ done: true, pair: null });
  }

  // Prioritize low-confidence pairs (pairs with labels but low agreement)
  const pairLabelCounts = pairs.map((p) => ({
    pair: p,
    count: labels.filter((l) => l.pairId === p.id).length,
  }));
  const unlabeledByMe = pairLabelCounts
    .filter((x) => !labeledPairIds.has(x.pair.id))
    .sort((a, b) => b.count - a.count); // prioritize pairs with more labels (needs consensus)

  return NextResponse.json({ done: false, pair: unlabeledByMe[0]?.pair || unlabeled[0] });
}
