import { test, describe } from 'node:test';
import * as assert from 'node:assert';

import { KOHLER_PRODUCTS } from '../data/products';
import { generateTopBundles } from '../lib/engine/optimizer';
import { UserRequirements } from '../types/recommendation';

const baseRequirements: UserRequirements = {
  dimensions: {
    widthFt: 8,
    lengthFt: 10,
  },
  budgetINR: 200000,
  selectedThemes: ['contemporary'],
  requiredCategories: ['toilet', 'faucet', 'shower', 'vanity'],
  householdSize: 4,
};

describe('Bundle Optimizer', () => {
  test('generates recommendations from the verified catalog', () => {
    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      baseRequirements,
      'balanced',
      3
    );

    assert.ok(bundles.length > 0);
    assert.ok(bundles.length <= 3);

    for (const bundle of bundles) {
      assert.strictEqual(bundle.products.length, 4);
      assert.ok(bundle.totalPriceINR <= baseRequirements.budgetINR);

      const categories = bundle.products.map(
        (product) => product.category
      );

      assert.ok(categories.includes('toilet'));
      assert.ok(categories.includes('faucet'));
      assert.ok(categories.includes('shower'));
      assert.ok(categories.includes('vanity'));

      assert.ok(bundle.scores.total >= 0);
      assert.ok(bundle.scores.total <= 100);
    }
  });

  test('returns results ordered by total score', () => {
    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      baseRequirements,
      'balanced',
      3
    );

    for (let i = 1; i < bundles.length; i++) {
      assert.ok(
        bundles[i - 1].scores.total >= bundles[i].scores.total
      );
    }
  });

  test('returns no bundles when the budget is too low', () => {
    const impossibleRequirements: UserRequirements = {
      ...baseRequirements,
      budgetINR: 10000,
    };

    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      impossibleRequirements,
      'balanced',
      3
    );

    assert.strictEqual(bundles.length, 0);
  });
});