import { test } from 'node:test';
import assert from 'node:assert/strict';
import { facts, factIds } from '../src/content/provenance.ts';
import {
  identity,
  roles,
  projects,
  moreProjects,
  skills,
  education,
  courses,
  contact,
  languages,
  workshopDisplays,
} from '../src/content/portfolio.ts';
import { explorationTopics, simulations } from '../src/content/exploration.ts';

const sourced = [
  identity,
  ...roles,
  ...projects,
  ...moreProjects,
  ...skills,
  education,
  ...courses,
  ...contact,
  languages,
  ...Object.values(workshopDisplays),
];

test('provenance fact IDs are unique', () => {
  assert.equal(factIds.size, facts.length);
});

test('every professional record cites at least one existing CV fact', () => {
  for (const record of sourced) {
    assert.ok(record.sources.length > 0, `no sources on ${JSON.stringify(record).slice(0, 60)}`);
    for (const id of record.sources) assert.ok(factIds.has(id), `unknown fact ${id}`);
  }
});

test('the phone number is never published', () => {
  const everything = JSON.stringify({ facts, sourced });
  assert.ok(!/\+?20\s?1\d{9}/.test(everything));
});

test('roles are in chronological order and only the latest is current', () => {
  const keys = roles.map((r) => r.sortKey);
  assert.deepEqual(keys, [...keys].sort());
  assert.deepEqual(
    roles.filter((r) => r.current).map((r) => r.id),
    ['vois'],
  );
});

test('every external link is https and backed by a CV fact quoting that URL', () => {
  const links = [...projects, ...moreProjects].flatMap((p) => p.links ?? []);
  links.push(...contact.filter((c) => c.href?.startsWith('http')).map((c) => ({ url: c.href })));
  for (const { url } of links) {
    assert.ok(url.startsWith('https://'), url);
    assert.ok(
      facts.some((f) => f.quote.includes(url)),
      `link ${url} does not appear in any CV fact`,
    );
  }
});

test('each workshop station is bound to exactly one CV project', () => {
  const stations = projects.map((p) => p.station).filter(Boolean);
  assert.deepEqual(new Set(stations).size, stations.length);
  assert.deepEqual(
    [...stations].sort((a, b) => a.localeCompare(b)),
    ['happy-human', 'mansour', 'real-estate', 'tobi'],
  );
});

test('AI exploration stays labelled as learning, never as professional experience', () => {
  const allowed = new Set(['Currently exploring', 'Learning', 'Experiment']);
  for (const t of explorationTopics) assert.ok(allowed.has(t.status), t.id);
  for (const s of simulations) assert.equal(s.status, 'Experiment');
  // LangChain/OpenAI are professional only through the CV-backed Happy Human project.
  const professionalAi = skills.find((s) => s.label.startsWith('AI integration'));
  assert.ok(professionalAi.sources.every((id) => id.startsWith('proj.happyhuman')));
});
