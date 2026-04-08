import { NextRequest, NextResponse } from "next/server";
import { readPairs, writePairs } from "@/lib/store";
import { AnnotationPair } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const pairs = readPairs();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const filtered = category ? pairs.filter((p) => p.category === category) : pairs;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pair: AnnotationPair = {
    id: uuidv4(),
    prompt: body.prompt,
    responseA: body.responseA,
    responseB: body.responseB,
    modelA: body.modelA,
    modelB: body.modelB,
    category: body.category || "general",
    createdAt: new Date().toISOString(),
  };
  const pairs = readPairs();
  pairs.push(pair);
  writePairs(pairs);
  return NextResponse.json(pair, { status: 201 });
}
