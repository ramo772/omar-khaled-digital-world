import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeQuery, runEvals, retrieve, tokenize } from '../src/ui/lab/logic.ts';
import { projects, roles } from '../src/content/portfolio.ts';

const corpus = [
  ...projects.map((p) => ({ id: p.id, title: p.name, text: `${p.summary} ${p.sides.flatMap((s) => s.technologies).join(' ')}` })),
  ...roles.map((r) => ({ id: r.id, title: r.title, text: `${r.organization ?? ''} ${r.summary}` })),
];

test('the router is deterministic and declines when no tool fits', () => {
  assert.equal(routeQuery('Which projects used Laravel?').tool, 'search_portfolio');
  assert.equal(routeQuery('What is 12 * 4?').tool, 'calculator');
  assert.equal(routeQuery('What is the weather in Cairo?').tool, null);
});

test('the eval board reports the naive router’s real failure', () => {
  const { passed, total, results } = runEvals();
  assert.equal(total, 6);
  assert.equal(passed, 5);
  assert.equal(results.find((r) => !r.pass).query, 'How long was Omar at Beyond Creation?');
});

test('retrieval over the portfolio finds the relevant project first', () => {
  assert.equal(retrieve('Laravel real estate CRM', corpus).results[0].chunk.id, 'real-estate');
  assert.equal(retrieve('React Native QR payments', corpus).results[0].chunk.id, 'mansour');
  assert.equal(retrieve('LangChain memory streaming', corpus).results[0].chunk.id, 'happy-human');
  assert.deepEqual(retrieve('zzz qqq', corpus).results, []);
});

test('tokenizer keeps technical terms like node.js and c#', () => {
  assert.deepEqual(tokenize('Node.js, C# and React!'), ['node.js', 'c#', 'react']);
});
