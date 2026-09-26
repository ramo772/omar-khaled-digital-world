/**
 * Pure logic behind the AI Lab simulations. Deterministic, local, no model and
 * no network — these are teaching toys, and the UI says so.
 * (No imports: tests load this file directly with Node.)
 */

export interface Tool {
  name: string;
  description: string;
}

export const tools: Tool[] = [
  { name: 'search_portfolio', description: 'Find facts in Omar’s portfolio' },
  { name: 'calculator', description: 'Do arithmetic' },
  { name: 'open_contact', description: 'Show how to reach Omar' },
];

export interface RouteDecision {
  tool: string | null;
  args?: Record<string, string>;
  reason: string;
}

/**
 * A deliberately naive keyword router. Its flaw ("how long…" always goes to
 * the calculator) is real, and the eval board catches it.
 */
export function routeQuery(query: string): RouteDecision {
  const q = query.toLowerCase();
  if (/\b(how (long|many)|convert|\d+\s*[-+*/x]\s*\d+|sum|total)\b/.test(q))
    return { tool: 'calculator', args: { expression: query }, reason: 'Looks like arithmetic.' };
  if (/\b(email|contact|reach|hire|linkedin|talk)\b/.test(q))
    return { tool: 'open_contact', reason: 'The user wants to get in touch.' };
  if (/\b(project|role|work|skill|laravel|node|react|tobi|vodafone|vois|experience|built|stack)\b/.test(q))
    return { tool: 'search_portfolio', args: { query }, reason: 'This is a question about Omar’s work.' };
  return { tool: null, reason: 'No available tool fits — answer honestly that I can’t help with that.' };
}

export interface EvalCase {
  query: string;
  expected: string | null;
}

/** Synthetic cases, written for this demo. */
export const evalCases: EvalCase[] = [
  { query: 'Which projects used Laravel?', expected: 'search_portfolio' },
  { query: 'What is 12 * 4?', expected: 'calculator' },
  { query: 'How can I contact Omar?', expected: 'open_contact' },
  { query: 'What does Omar work on at VOIS?', expected: 'search_portfolio' },
  { query: 'What is the weather in Cairo?', expected: null },
  { query: 'How long was Omar at Beyond Creation?', expected: 'search_portfolio' },
];

export function runEvals(cases: EvalCase[] = evalCases) {
  const results = cases.map((c) => {
    const got = routeQuery(c.query).tool;
    return { ...c, got, pass: got === c.expected };
  });
  return { results, passed: results.filter((r) => r.pass).length, total: results.length };
}

export interface Chunk {
  id: string;
  title: string;
  text: string;
}

const STOP = new Set(
  'a an and are as at be by for from has have i in is it of on or the to was what which who with did does do my me omar omars about'.split(' '),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9.+#]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/** Keyword retrieval (TF-IDF-style overlap) — a stand-in for embeddings. */
export function retrieve(query: string, corpus: Chunk[], k = 3) {
  const docs = corpus.map((c) => ({ chunk: c, terms: tokenize(`${c.title} ${c.text}`) }));
  const df = new Map<string, number>();
  docs.forEach((d) => new Set(d.terms).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
  const q = [...new Set(tokenize(query))];
  const scored = docs.map((d) => {
    const tf = new Map<string, number>();
    d.terms.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    let score = 0;
    const matched: string[] = [];
    for (const t of q) {
      const f = tf.get(t);
      if (!f) continue;
      matched.push(t);
      score += (1 + Math.log(f)) * Math.log(1 + docs.length / (df.get(t) ?? 1));
    }
    return { chunk: d.chunk, score, matched };
  });
  const top = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  const max = top[0]?.score ?? 1;
  return { terms: q, results: top.map((t) => ({ ...t, relevance: t.score / max })) };
}

/** Rough token estimate (≈ 4 characters per token) for the context-window meter. */
export const estimateTokens = (text: string) => Math.ceil(text.length / 4);
