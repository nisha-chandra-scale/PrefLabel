"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardStats, AgreementStats } from "@/types";

interface DashboardData {
  dashboard: DashboardStats;
  agreementStats: AgreementStats[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [filter, setFilter] = useState<"all" | "low">("all");

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-dim font-mono text-sm animate-pulse">Loading…</span>
        </div>
      </div>
    );
  }

  const { dashboard, agreementStats } = data;
  const filtered = filter === "low"
    ? agreementStats.filter((s) => s.isLowConfidence && s.totalLabels > 0)
    : agreementStats;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Pairs", value: dashboard.totalPairs, color: "text-bright" },
            { label: "Total Labels", value: dashboard.totalLabels, color: "text-bright" },
            { label: "Completed", value: dashboard.completedPairs, color: "text-green" },
            { label: "Low Confidence", value: dashboard.lowConfidencePairs, color: "text-amber" },
            { label: "Avg Confidence", value: dashboard.avgConfidence.toFixed(1) + " / 5", color: "text-cyan" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className={`text-2xl font-mono font-semibold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs font-mono text-dim uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Label distribution */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-mono text-xs text-dim uppercase tracking-widest mb-4">Label Distribution</h3>
            {dashboard.labelDistribution.map((d) => {
              const total = dashboard.totalLabels || 1;
              const pct = Math.round((d.count / total) * 100);
              const color = d.preference === "A" ? "bg-accent" : d.preference === "B" ? "bg-cyan" : "bg-amber";
              return (
                <div key={d.preference} className="mb-3">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-ghost">Prefer {d.preference}</span>
                    <span className="text-dim">{d.count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Agreement by category */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-mono text-xs text-dim uppercase tracking-widest mb-4">Agreement by Category</h3>
            {Object.entries(dashboard.agreementByCategory).length === 0 ? (
              <p className="text-dim text-xs font-mono">No data yet</p>
            ) : (
              Object.entries(dashboard.agreementByCategory).map(([cat, rate]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-ghost capitalize">{cat}</span>
                    <span className={rate >= 0.7 ? "text-green" : rate >= 0.5 ? "text-amber" : "text-red"}>
                      {Math.round(rate * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rate >= 0.7 ? "bg-green" : rate >= 0.5 ? "bg-amber" : "bg-red"}`}
                      style={{ width: `${rate * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="font-mono text-xs text-dim uppercase tracking-widest mb-4">Recent Labels</h3>
            <div className="space-y-2">
              {dashboard.recentActivity.length === 0 ? (
                <p className="text-dim text-xs font-mono">No labels yet</p>
              ) : (
                dashboard.recentActivity.slice(0, 7).map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-dim truncate max-w-[120px]">{l.annotatorId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      l.preference === "A" ? "bg-accent/10 text-accent" :
                      l.preference === "B" ? "bg-cyan/10 text-cyan" : "bg-amber/10 text-amber"
                    }`}>
                      {l.preference === "tie" ? "Tie" : `Prefer ${l.preference}`}
                    </span>
                    <span className="text-muted">conf {l.confidenceScore}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pair agreement table */}
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-mono text-xs text-dim uppercase tracking-widest">Pair Agreement</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${filter === "all" ? "bg-accent/10 text-accent border border-accent/30" : "text-dim border border-border hover:text-ghost"}`}
              >
                All ({agreementStats.filter(s => s.totalLabels > 0).length})
              </button>
              <button
                onClick={() => setFilter("low")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${filter === "low" ? "bg-amber/10 text-amber border border-amber/30" : "text-dim border border-border hover:text-ghost"}`}
              >
                ⚑ Low Confidence ({dashboard.lowConfidencePairs})
              </button>
              <a
                href="/api/export"
                className="px-3 py-1 rounded text-xs font-mono border border-border text-dim hover:text-accent hover:border-accent/30 transition-all"
              >
                Export JSONL ↓
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  {["Pair ID", "Labels", "Prefer A", "Prefer B", "Tie", "Agreement", "Majority", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-dim uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.filter(s => s.totalLabels > 0).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-dim">No labeled pairs yet</td>
                  </tr>
                ) : (
                  filtered.filter(s => s.totalLabels > 0).map((s) => (
                    <tr key={s.pairId} className="border-b border-border/50 hover:bg-surface transition-colors">
                      <td className="px-4 py-3 text-muted">{s.pairId.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-ghost">{s.totalLabels}</td>
                      <td className="px-4 py-3 text-accent">{s.preferA}</td>
                      <td className="px-4 py-3 text-cyan">{s.preferB}</td>
                      <td className="px-4 py-3 text-amber">{s.tie}</td>
                      <td className="px-4 py-3">
                        <span className={s.agreementRate >= 0.7 ? "text-green" : s.agreementRate >= 0.5 ? "text-amber" : "text-red"}>
                          {Math.round(s.agreementRate * 100)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {s.majorityPreference ? (
                          <span className={`px-1.5 py-0.5 rounded ${
                            s.majorityPreference === "A" ? "bg-accent/10 text-accent" :
                            s.majorityPreference === "B" ? "bg-cyan/10 text-cyan" : "bg-amber/10 text-amber"
                          }`}>
                            {s.majorityPreference === "tie" ? "Tie" : `Model ${s.majorityPreference}`}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {s.isLowConfidence ? (
                          <span className="text-amber">⚑ Review</span>
                        ) : (
                          <span className="text-green">✓ OK</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-white">PL</span>
          </div>
          <span className="font-mono font-semibold text-bright text-sm">PrefLabel</span>
        </Link>
        <span className="text-dim font-mono text-xs">/</span>
        <span className="font-mono text-xs text-dim">dashboard</span>
      </div>
      <Link href="/annotate" className="px-4 py-1.5 bg-accent hover:bg-accent-glow text-white rounded font-mono text-xs transition-all">
        + Annotate
      </Link>
    </header>
  );
}
