"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnnotationPair, Preference } from "@/types";

const CONFIDENCE_LABELS = ["", "Very Low", "Low", "Medium", "High", "Very High"];

export default function AnnotatePage() {
  const [annotatorId, setAnnotatorId] = useState("");
  const [nameSet, setNameSet] = useState(false);
  const [pair, setPair] = useState<AnnotationPair | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState<Preference>(null);
  const [rationale, setRationale] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const startTime = useRef<number>(Date.now());

  const fetchNext = async (id: string) => {
    setLoading(true);
    setPreference(null);
    setRationale("");
    setConfidence(3);
    setSubmitted(false);
    startTime.current = Date.now();
    const res = await fetch(`/api/pairs/next?annotatorId=${id}`);
    const data = await res.json();
    if (data.done) {
      setDone(true);
      setPair(null);
    } else {
      setPair(data.pair);
    }
    setLoading(false);
  };

  const handleStart = () => {
    if (!annotatorId.trim()) return;
    setNameSet(true);
    fetchNext(annotatorId);
  };

  const handleSubmit = async () => {
    if (!preference || !pair) return;
    setSubmitted(true);
    await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pairId: pair.id,
        annotatorId,
        preference,
        rationale,
        confidenceScore: confidence,
        durationMs: Date.now() - startTime.current,
      }),
    });
    setCount((c) => c + 1);
    setTimeout(() => fetchNext(annotatorId), 600);
  };

  if (!nameSet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card animate-fadein">
            <h2 className="font-mono text-lg font-semibold text-bright mb-1">Annotator ID</h2>
            <p className="text-dim text-sm mb-6">Enter your name or ID to track your annotations.</p>
            <input
              className="w-full bg-surface border border-border rounded px-4 py-3 text-bright font-mono text-sm focus:outline-none focus:border-accent transition-colors mb-4"
              placeholder="e.g. nisha, annotator-01"
              value={annotatorId}
              onChange={(e) => setAnnotatorId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              autoFocus
            />
            <button
              onClick={handleStart}
              disabled={!annotatorId.trim()}
              className="w-full py-3 bg-accent hover:bg-accent-glow disabled:opacity-40 text-white rounded font-mono text-sm font-medium transition-all"
            >
              Start Annotating →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fadein">
            <div className="text-5xl mb-4">◎</div>
            <h2 className="font-mono text-xl font-semibold text-bright mb-2">All done!</h2>
            <p className="text-dim text-sm mb-2">You've labeled all available pairs.</p>
            <p className="text-accent font-mono text-sm mb-8">{count} labeled this session</p>
            <Link href="/dashboard" className="px-6 py-2.5 border border-border hover:border-accent/50 text-ghost hover:text-bright rounded font-mono text-sm transition-all">
              View Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header right={
        <div className="flex items-center gap-4 text-xs font-mono text-dim">
          <span className="text-accent">{annotatorId}</span>
          <span>{count} labeled</span>
        </div>
      } />

      <main className="flex-1 flex flex-col px-6 py-6 max-w-7xl mx-auto w-full">
        {loading || !pair ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-dim font-mono text-sm animate-pulse">Loading next pair…</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fadein">
            {/* Prompt */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-dim uppercase tracking-widest">Prompt</span>
                {pair.category && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border text-dim">{pair.category}</span>
                )}
              </div>
              <p className="text-bright text-sm leading-relaxed font-sans">{pair.prompt}</p>
            </div>

            {/* Responses side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["A", "B"] as const).map((side) => {
                const response = side === "A" ? pair.responseA : pair.responseB;
                const model = side === "A" ? pair.modelA : pair.modelB;
                const selected = preference === side;
                return (
                  <button
                    key={side}
                    onClick={() => setPreference(side)}
                    disabled={submitted}
                    className={`text-left rounded-lg border-2 p-5 transition-all duration-200 ${
                      selected
                        ? "border-accent bg-accent/5 shadow-glow"
                        : "border-border bg-card hover:border-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${selected ? "bg-accent text-white" : "bg-muted text-dim"}`}>
                          {side}
                        </span>
                        {model && <span className="text-xs text-dim font-mono">{model}</span>}
                      </div>
                      {selected && <span className="text-xs text-accent font-mono">✓ Selected</span>}
                    </div>
                    <p className="text-ghost text-sm leading-relaxed font-sans whitespace-pre-wrap">{response}</p>
                  </button>
                );
              })}
            </div>

            {/* Tie option */}
            <div className="flex justify-center">
              <button
                onClick={() => setPreference("tie")}
                disabled={submitted}
                className={`px-6 py-2 rounded border font-mono text-xs transition-all ${
                  preference === "tie"
                    ? "border-amber bg-amber/10 text-amber"
                    : "border-border text-dim hover:border-amber/40 hover:text-ghost"
                }`}
              >
                ⇌ These are equally good (Tie)
              </button>
            </div>

            {/* Rationale + Confidence */}
            {preference && (
              <div className="rounded-lg border border-border bg-card p-5 animate-fadein grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-dim uppercase tracking-widest block mb-2">
                    Rationale <span className="normal-case text-muted">(optional)</span>
                  </label>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    disabled={submitted}
                    placeholder="Why did you prefer this response?"
                    rows={3}
                    className="w-full bg-surface border border-border rounded px-3 py-2.5 text-bright font-sans text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-dim uppercase tracking-widest block mb-2">
                    Confidence — {CONFIDENCE_LABELS[confidence]}
                  </label>
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setConfidence(v)}
                        disabled={submitted}
                        className={`flex-1 py-2.5 rounded border font-mono text-xs transition-all ${
                          confidence === v
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-dim hover:border-accent/30"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted font-mono mt-1.5 px-0.5">
                    <span>uncertain</span>
                    <span>very sure</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => fetchNext(annotatorId)}
                disabled={submitted}
                className="px-5 py-2.5 border border-border text-dim hover:text-ghost rounded font-mono text-sm transition-all"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!preference || submitted}
                className="px-8 py-2.5 bg-accent hover:bg-accent-glow disabled:opacity-40 text-white rounded font-mono text-sm font-medium transition-all"
              >
                {submitted ? "Saved ✓" : "Submit Label →"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Header({ right }: { right?: React.ReactNode }) {
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
        <span className="font-mono text-xs text-dim">annotate</span>
      </div>
      {right}
    </header>
  );
}
