import { AnnotationPair, LabeledPair, AgreementStats, DashboardStats, Preference } from "@/types";

export function computeAgreement(
  pair: AnnotationPair,
  labels: LabeledPair[]
): AgreementStats {
  const pairLabels = labels.filter((l) => l.pairId === pair.id);
  const total = pairLabels.length;
  if (total === 0) {
    return {
      pairId: pair.id,
      totalLabels: 0,
      preferA: 0,
      preferB: 0,
      tie: 0,
      majorityPreference: null,
      agreementRate: 0,
      isLowConfidence: true,
    };
  }

  const preferA = pairLabels.filter((l) => l.preference === "A").length;
  const preferB = pairLabels.filter((l) => l.preference === "B").length;
  const tie = pairLabels.filter((l) => l.preference === "tie").length;

  const maxCount = Math.max(preferA, preferB, tie);
  let majorityPreference: Preference = null;
  if (maxCount === preferA) majorityPreference = "A";
  else if (maxCount === preferB) majorityPreference = "B";
  else majorityPreference = "tie";

  const agreementRate = total > 0 ? maxCount / total : 0;
  const avgConfidence =
    pairLabels.reduce((sum, l) => sum + l.confidenceScore, 0) / total;
  const isLowConfidence = agreementRate < 0.6 || avgConfidence < 3;

  return {
    pairId: pair.id,
    totalLabels: total,
    preferA,
    preferB,
    tie,
    majorityPreference,
    agreementRate,
    isLowConfidence,
  };
}

export function computeDashboard(
  pairs: AnnotationPair[],
  labels: LabeledPair[]
): DashboardStats {
  const stats = pairs.map((p) => computeAgreement(p, labels));
  const completedPairs = stats.filter((s) => s.totalLabels >= 2).length;
  const lowConfidencePairs = stats.filter(
    (s) => s.isLowConfidence && s.totalLabels > 0
  ).length;

  const avgConfidence =
    labels.length > 0
      ? labels.reduce((s, l) => s + l.confidenceScore, 0) / labels.length
      : 0;

  // Agreement by category
  const agreementByCategory: Record<string, number> = {};
  const categoryGroups: Record<string, AgreementStats[]> = {};
  pairs.forEach((p, i) => {
    const cat = p.category || "uncategorized";
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(stats[i]);
  });
  Object.entries(categoryGroups).forEach(([cat, catStats]) => {
    const withLabels = catStats.filter((s) => s.totalLabels > 0);
    if (withLabels.length > 0) {
      agreementByCategory[cat] =
        withLabels.reduce((s, st) => s + st.agreementRate, 0) /
        withLabels.length;
    }
  });

  // Label distribution
  const labelDist = [
    { preference: "A", count: labels.filter((l) => l.preference === "A").length },
    { preference: "B", count: labels.filter((l) => l.preference === "B").length },
    { preference: "Tie", count: labels.filter((l) => l.preference === "tie").length },
  ];

  const recentActivity = [...labels]
    .sort((a, b) => new Date(b.labeledAt).getTime() - new Date(a.labeledAt).getTime())
    .slice(0, 10);

  return {
    totalPairs: pairs.length,
    totalLabels: labels.length,
    completedPairs,
    lowConfidencePairs,
    avgConfidence,
    agreementByCategory,
    labelDistribution: labelDist,
    recentActivity,
  };
}
