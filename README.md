# PrefLabel

**Human preference data collection tool for RLHF training pipelines.**

A full-stack annotation tool for collecting human preference data on LLM outputs. Presents paired model responses side-by-side and captures ranked preferences with optional free-text rationale.

![PrefLabel](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Side-by-side comparison** — paired model responses presented together for direct comparison
- **Ranked preference capture** — annotators select A, B, or Tie with a 1–5 confidence score
- **Free-text rationale** — optional field for annotators to explain their reasoning
- **RLHF-compatible export** — one-click JSONL export with `chosen`/`rejected` format
- **Agreement scoring** — tracks annotator agreement rates per pair
- **Low-confidence flagging** — automatically flags pairs with < 60% agreement for review
- **Per-annotator tracking** — each annotator sees only unlabeled pairs, prioritized by consensus need

## Quick Start

```bash
npm install
npm run seed      # load sample annotation pairs
npm run dev       # start at http://localhost:3000
```

## Usage

1. **Annotate** → `/annotate` — enter your annotator ID and start labeling pairs
2. **Dashboard** → `/dashboard` — view agreement stats, label distribution, low-confidence flags
3. **Export** → `/api/export` — download full dataset as RLHF-compatible JSONL

## Adding Annotation Pairs

```bash
curl -X POST http://localhost:3000/api/pairs \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain transformers in NLP",
    "responseA": "Transformers use self-attention...",
    "responseB": "Imagine each word in a sentence...",
    "modelA": "gpt-4",
    "modelB": "claude-3",
    "category": "explanation"
  }'
```

## Export Format

The `/api/export` endpoint returns JSONL where each line is:

```json
{
  "id": "uuid",
  "prompt": "...",
  "chosen": "preferred response text",
  "rejected": "non-preferred response text",
  "chosen_model": "claude-3",
  "rejected_model": "gpt-4",
  "preference": "B",
  "agreement_rate": 0.85,
  "avg_confidence": 4.2,
  "num_annotators": 3,
  "low_confidence": false,
  "category": "explanation",
  "rationales": ["More intuitive explanation", "Better analogies"]
}
```

## Data Storage

Labels are stored locally in `data/pairs.json` and `data/labels.json`. For production, swap `src/lib/store.ts` for a database-backed implementation.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- File-based JSON storage (no database required)

## License

MIT
