import { NextRequest, NextResponse } from "next/server";
import { appendLabel, readLabels } from "@/lib/store";
import { LabeledPair } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  return NextResponse.json(readLabels());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const label: LabeledPair = {
    id: uuidv4(),
    pairId: body.pairId,
    annotatorId: body.annotatorId || "anonymous",
    preference: body.preference,
    rationale: body.rationale || "",
    confidenceScore: Number(body.confidenceScore) || 3,
    labeledAt: new Date().toISOString(),
    durationMs: body.durationMs,
  };
  appendLabel(label);
  return NextResponse.json(label, { status: 201 });
}
