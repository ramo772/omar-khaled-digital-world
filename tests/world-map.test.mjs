import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isWalkable, route } from '../src/lib/movement.ts';
import { destinations, obstacles, spawn, stream, worldBounds } from '../src/data/world-map.ts';
import { features } from '../src/config/features.ts';

const at = ([x, z]) => ({ x, z });

test('story order and numbering follow the AI Lab flag', () => {
  const ids = destinations.map((d) => d.id);
  const expected = ['about', 'experience', 'projects', ...(features.aiLab ? ['ai'] : []), 'skills', 'contact'];
  assert.deepEqual(ids, expected);
  assert.deepEqual(
    destinations.map((d) => d.index),
    expected.map((_, i) => String(i + 1).padStart(2, '0')),
  );
});

test('spawn and every stop are walkable', () => {
  assert.ok(isWalkable(at(spawn), obstacles, worldBounds), 'spawn');
  for (const d of destinations) assert.ok(isWalkable(at(d.stop), obstacles, worldBounds), d.id);
});

test('every stop can be reached on foot from the spawn point', () => {
  for (const d of destinations) {
    const path = route(at(spawn), at(d.stop), obstacles, worldBounds);
    assert.ok(path.length > 0, `no route to ${d.id}`);
  }
});

test('the stream can only be crossed on the bridge', { skip: !stream }, () => {
  const { bridge } = stream;
  const skills = destinations.find((d) => d.id === 'skills').stop;
  const contact = destinations.find((d) => d.id === 'contact').stop;
  const path = route(at(skills), at(contact), obstacles, worldBounds);
  assert.ok(path.length > 0);
  // Some waypoint must lie on the bridge deck.
  assert.ok(path.some((p) => Math.abs(p.x - bridge.x) < bridge.length / 2 && Math.abs(p.z - bridge.z) < bridge.width / 2));
  // Just upstream and downstream of the bridge is water.
  assert.ok(!isWalkable({ x: 4.15, z: 3.35 }, obstacles, worldBounds));
  assert.ok(!isWalkable({ x: 3.7, z: 5.0 }, obstacles, worldBounds));
});
