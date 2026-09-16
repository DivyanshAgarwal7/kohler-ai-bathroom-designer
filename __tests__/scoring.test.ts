import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { calculateValueScore } from '../lib/engine/scoring';

describe('Weighted Scoring Engine', () => {
  test('calculateValueScore favors lower costs in lower-budget mode', () => {
    const budget = 100000;

    const cheapScore = calculateValueScore(
      20000,
      budget,
      'lower-budget'
    );

    const expensiveScore = calculateValueScore(
      80000,
      budget,
      'lower-budget'
    );

    assert.ok(cheapScore > expensiveScore);
  });

  test('calculateValueScore rewards budget headroom in balanced mode', () => {
    const budget = 100000;

    const lowerCostScore = calculateValueScore(
      20000,
      budget,
      'balanced'
    );

    const higherCostScore = calculateValueScore(
      80000,
      budget,
      'balanced'
    );

    assert.ok(lowerCostScore > higherCostScore);
  });

  test('calculateValueScore favors higher valid costs in luxurious mode', () => {
    const budget = 100000;

    const cheapScore = calculateValueScore(
      20000,
      budget,
      'luxurious'
    );

    const expensiveScore = calculateValueScore(
      90000,
      budget,
      'luxurious'
    );

    assert.ok(expensiveScore > cheapScore);
  });

  test('calculateValueScore rejects over-budget bundles', () => {
    const score = calculateValueScore(
      120000,
      100000,
      'luxurious'
    );

    assert.strictEqual(score, 0);
  });

  test('calculateValueScore handles invalid budgets safely', () => {
    assert.strictEqual(
      calculateValueScore(10000, 0, 'balanced'),
      0
    );
  });
});