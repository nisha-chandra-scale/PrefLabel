export type Preference = "A" | "B" | "tie" | null;

export interface AnnotationPair {
  id: string;
  prompt: string;
  responseA: string;
  responseB: string;
  modelA?: string;
  modelB?: string;
  category?: string;
  createdAt: string;
}

export interface LabeledPair {
  id: string;
  pairId: string;
  annotatorId: string;
  preference: Preference;
  rationale?: string;
  confidenceScore: number; // 1–5
  labeledAt: string;
  durationMs?: number;
}

export interface AgreementStats {
  pairId: string;
  totalLabels: number;
  preferA: number;
  preferB: number;
  tie: number;
  majorityPreference: Preference;
  agreementRate: number; // 0–1
  isLowConfidence: boolean;
}

export interface DashboardStats {
  totalPairs: number;
  totalLabels: number;
  completedPairs: number;
  lowConfidencePairs: number;
  avgConfidence: number;
  agreementByCategory: Record<string, number>;
  labelDistribution: { preference: string; count: number }[];
  recentActivity: LabeledPair[];
}
