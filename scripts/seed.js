const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const pairs = [
  {
    id: uuidv4(),
    prompt: "Explain the concept of gradient descent in machine learning to a beginner.",
    responseA: "Gradient descent is an optimization algorithm used to minimize a function by iteratively moving in the direction of steepest descent. In ML, we use it to minimize the loss function. We compute the gradient (slope) and move in the opposite direction. The learning rate controls step size.",
    responseB: "Imagine you're blindfolded on a hilly landscape trying to find the lowest valley. Gradient descent is exactly that process — you feel which way the ground slopes downhill under your feet, take a small step in that direction, and repeat until you stop going lower. In ML, the 'landscape' is your model's error, and each step adjusts your model's weights to reduce mistakes.",
    modelA: "gpt-4",
    modelB: "claude-3",
    category: "explanation",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    prompt: "Write a Python function to check if a string is a palindrome.",
    responseA: `def is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]`,
    responseB: `def is_palindrome(s: str) -> bool:\n    \"\"\"Check if a string is a palindrome, ignoring case and spaces.\"\"\"\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n\n# Examples:\n# is_palindrome("racecar") -> True\n# is_palindrome("A man a plan a canal Panama") -> True`,
    modelA: "gpt-3.5",
    modelB: "claude-3",
    category: "coding",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    prompt: "What are the main causes of the French Revolution?",
    responseA: "The French Revolution (1789) was caused by: 1) Financial crisis from wars and royal debt, 2) Social inequality between the three estates, 3) Enlightenment ideas about liberty and equality, 4) Food shortages and famine, 5) Weak leadership by Louis XVI.",
    responseB: "The French Revolution emerged from a perfect storm of crises. Decades of costly wars, including support for American independence, had bankrupted France. Meanwhile, rigid social stratification — the clergy and nobility paid almost no taxes while commoners bore enormous burdens — created seething resentment. Enlightenment thinkers like Rousseau and Voltaire had spread ideas about natural rights that made the old order seem not just unfair but illegitimate. A series of harvest failures in the late 1780s pushed ordinary people to the edge of starvation. When Louis XVI proved unable to navigate these pressures or reform the tax system, the system collapsed.",
    modelA: "gpt-4",
    modelB: "claude-3",
    category: "history",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    prompt: "How should I handle exceptions in Python?",
    responseA: "Use try/except blocks. Catch specific exceptions rather than bare except. Use finally for cleanup. You can raise exceptions with raise. Create custom exceptions by subclassing Exception.",
    responseB: `Use try/except to catch exceptions, but be specific — catching broad Exception or bare except hides bugs:\n\n\`\`\`python\ntry:\n    result = int(user_input)\nexcept ValueError:\n    print("Please enter a valid number")\nexcept (TypeError, AttributeError) as e:\n    print(f"Unexpected error: {e}")\nfinally:\n    cleanup()  # runs regardless\n\`\`\`\n\nKey rules: catch the most specific exception possible, never silently swallow errors, and use custom exception classes for domain-specific errors.`,
    modelA: "gpt-3.5",
    modelB: "claude-3",
    category: "coding",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    prompt: "Summarize the plot of 1984 by George Orwell.",
    responseA: "1984 is a dystopian novel set in a totalitarian society ruled by 'Big Brother'. The protagonist Winston Smith works for the Party rewriting history. He rebels by having a secret affair and joining what he believes is a resistance movement, but is eventually caught, tortured, and broken.",
    responseB: "Set in a perpetually war-torn future England, 1984 follows Winston Smith, a low-ranking functionary who secretly despises the omnipotent Party and its figurehead Big Brother. His job — rewriting historical records to match the Party's current narrative — fills him with quiet dread. He begins a forbidden love affair with Julia and believes he's found allies in the underground resistance. But the Party's surveillance is total. Winston is eventually betrayed, subjected to psychological torture in the Ministry of Love, and forced to genuinely love Big Brother. Orwell's novel is less a plot-driven story than a meditation on how power destroys truth, memory, and the self.",
    modelA: "gpt-4",
    modelB: "claude-3",
    category: "literature",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    prompt: "What is the difference between supervised and unsupervised learning?",
    responseA: "Supervised learning uses labeled training data to learn a mapping from inputs to outputs (e.g., classification, regression). Unsupervised learning finds patterns in unlabeled data (e.g., clustering, dimensionality reduction). Supervised learning has a target variable; unsupervised does not.",
    responseB: "The key difference is whether you're giving the algorithm answers to learn from. In supervised learning, every training example comes with the correct answer — show the model thousands of emails labeled 'spam' or 'not spam', and it learns the pattern. In unsupervised learning, you hand the algorithm raw data and say 'find the structure yourself' — it might discover that your customers naturally cluster into five distinct groups, without you ever defining those groups upfront.",
    modelA: "gpt-3.5",
    modelB: "claude-3",
    category: "explanation",
    createdAt: new Date().toISOString(),
  },
];

// Some seed labels for demo data
const labels = [
  { id: uuidv4(), pairId: pairs[0].id, annotatorId: "alice", preference: "B", rationale: "The analogy makes it much easier to understand", confidenceScore: 5, labeledAt: new Date().toISOString(), durationMs: 45000 },
  { id: uuidv4(), pairId: pairs[0].id, annotatorId: "bob", preference: "B", rationale: "More engaging and intuitive", confidenceScore: 4, labeledAt: new Date().toISOString(), durationMs: 32000 },
  { id: uuidv4(), pairId: pairs[1].id, annotatorId: "alice", preference: "B", rationale: "Better documentation and edge case handling", confidenceScore: 5, labeledAt: new Date().toISOString(), durationMs: 28000 },
  { id: uuidv4(), pairId: pairs[1].id, annotatorId: "bob", preference: "A", rationale: "More concise, easier to read", confidenceScore: 3, labeledAt: new Date().toISOString(), durationMs: 21000 },
  { id: uuidv4(), pairId: pairs[2].id, annotatorId: "alice", preference: "B", rationale: "More nuanced and narrative", confidenceScore: 4, labeledAt: new Date().toISOString(), durationMs: 60000 },
  { id: uuidv4(), pairId: pairs[3].id, annotatorId: "bob", preference: "B", rationale: "Code example is very helpful", confidenceScore: 5, labeledAt: new Date().toISOString(), durationMs: 40000 },
];

fs.writeFileSync(path.join(DATA_DIR, "pairs.json"), JSON.stringify(pairs, null, 2));
fs.writeFileSync(path.join(DATA_DIR, "labels.json"), JSON.stringify(labels, null, 2));
console.log(`✓ Seeded ${pairs.length} pairs and ${labels.length} labels`);
