import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-white">PL</span>
          </div>
          <span className="font-mono font-semibold text-bright tracking-tight">PrefLabel</span>
          <span className="text-xs text-dim font-mono px-2 py-0.5 border border-border rounded">v0.1</span>
        </div>
        <nav className="flex gap-6 text-sm font-mono text-dim">
          <Link href="/annotate" className="hover:text-bright transition-colors">Annotate</Link>
          <Link href="/dashboard" className="hover:text-bright transition-colors">Dashboard</Link>
          <a href="/api/export" className="hover:text-accent transition-colors">Export JSONL</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            RLHF preference collection
          </div>

          <h1 className="text-5xl font-sans font-light text-bright mb-4 leading-tight tracking-tight">
            Human preference<br />
            <span className="font-semibold text-accent">data at scale</span>
          </h1>

          <p className="text-ghost text-lg font-sans font-light mb-12 leading-relaxed">
            Annotate paired LLM outputs side-by-side, capture ranked preferences
            with rationale, and export structured data for RLHF training pipelines.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/annotate"
              className="px-8 py-3 bg-accent hover:bg-accent-glow text-white rounded font-mono text-sm font-medium transition-all duration-200 glow-on-hover"
            >
              Start Annotating
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 border border-border hover:border-accent/50 text-ghost hover:text-bright rounded font-mono text-sm transition-all duration-200"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-t border-border px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "⇄",
              title: "Side-by-side comparison",
              desc: "Paired model responses presented together for direct comparison with ranked preference capture.",
            },
            {
              icon: "◈",
              title: "Structured RLHF output",
              desc: "Labels stored as JSONL with chosen/rejected format compatible with standard training pipelines.",
            },
            {
              icon: "◎",
              title: "Agreement scoring",
              desc: "Track annotator agreement rates and auto-flag low-confidence labels for targeted review.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-lg border border-border bg-card hover:border-accent/30 transition-colors">
              <div className="text-2xl mb-3 text-accent font-mono">{f.icon}</div>
              <h3 className="font-mono text-sm font-semibold text-bright mb-2">{f.title}</h3>
              <p className="text-dim text-sm font-sans leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
