import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, move, route, isWalkable } from '../src/lib/movement.ts';
const bounds = { x: 9.4, z: 6.35 };
test('diagonal input has the same top speed as a single axis', () => {
  assert.ok(
    Math.abs(Math.hypot(...Object.values(normalize(1, 1))) - 1) < 1e-10,
  );
  assert.deepEqual(normalize(0, 0), { x: 0, z: 0 });
});
test('large movement cannot tunnel through a building', () => {
  const result = move(
    { x: -4, z: 0 },
    { x: 8, z: 0 },
    [{ x: 0, z: 0, halfX: 1, halfZ: 1 }],
    bounds,
  );
  assert.ok(result.x <= -1.28);
  assert.equal(result.z, 0);
});
test('a wall permits sliding along its edge', () => {
  const result = move(
    { x: -1.3, z: 0 },
    { x: 1, z: 1 },
    [{ x: 0, z: 0, halfX: 1, halfZ: 1 }],
    bounds,
  );
  assert.ok(result.x <= -1.28);
  assert.ok(result.z > 0.9);
});
test('rounded island boundaries keep the player on land', () => {
  const result = move({ x: 8, z: 5 }, { x: 20, z: 20 }, [], bounds);
  assert.ok(isWalkable(result, [], bounds));
  assert.ok(!isWalkable({ x: 9, z: 6 }, [], bounds));
});
test('tap route goes around an obstacle and reaches the intended destination', () => {
  const obstacles = [{ x: 0, z: 0, halfX: 1, halfZ: 2 }],
    goal = { x: 3, z: 0 };
  const path = route({ x: -3, z: 0 }, goal, obstacles, bounds);
  assert.ok(path.length > 1);
  assert.deepEqual(path.at(-1), goal);
  assert.ok(path.every((p) => isWalkable(p, obstacles, bounds)));
  assert.ok(path.some((p) => Math.abs(p.z) > 2.28));
});
test('unreachable or blocked tap targets do not create unsafe paths', () => {
  assert.deepEqual(
    route(
      { x: -3, z: 0 },
      { x: 0, z: 0 },
      [{ x: 0, z: 0, halfX: 1, halfZ: 1 }],
      bounds,
    ),
    [],
  );
  assert.deepEqual(route({ x: -3, z: 0 }, { x: 30, z: 0 }, [], bounds), []);
});
