import fs from "fs";
import path from "path";
import { AnnotationPair, LabeledPair } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PAIRS_FILE = path.join(DATA_DIR, "pairs.json");
const LABELS_FILE = path.join(DATA_DIR, "labels.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readPairs(): AnnotationPair[] {
  ensureDataDir();
  if (!fs.existsSync(PAIRS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PAIRS_FILE, "utf-8"));
}

export function writePairs(pairs: AnnotationPair[]) {
  ensureDataDir();
  fs.writeFileSync(PAIRS_FILE, JSON.stringify(pairs, null, 2));
}

export function readLabels(): LabeledPair[] {
  ensureDataDir();
  if (!fs.existsSync(LABELS_FILE)) return [];
  return JSON.parse(fs.readFileSync(LABELS_FILE, "utf-8"));
}

export function writeLabels(labels: LabeledPair[]) {
  ensureDataDir();
  fs.writeFileSync(LABELS_FILE, JSON.stringify(labels, null, 2));
}

export function appendLabel(label: LabeledPair) {
  const labels = readLabels();
  labels.push(label);
  writeLabels(labels);
}
