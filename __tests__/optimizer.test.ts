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

describe('New product classes (smart toilet & thermostatic valve component)', () => {
  const smartToilet = KOHLER_PRODUCTS.find((p) => p.id === 't3');
  const thermostaticValve = KOHLER_PRODUCTS.find((p) => p.id === 's3');

  test('smart toilet is present in the verified catalog', () => {
    assert.ok(smartToilet, 'expected a t3 smart toilet in KOHLER_PRODUCTS');
    assert.strictEqual(smartToilet?.category, 'toilet');
    assert.strictEqual(smartToilet?.subcategory, 'smart');
  });

  test('thermostatic valve (shower-system component) is present in the verified catalog', () => {
    assert.ok(
      thermostaticValve,
      'expected an s3 thermostatic valve component in KOHLER_PRODUCTS'
    );
    assert.strictEqual(thermostaticValve?.category, 'shower');
    assert.strictEqual(
      thermostaticValve?.subcategory,
      'thermostatic-system'
    );
  });

  test('optimizer can select the smart toilet when it is the only toilet candidate', () => {
    const catalog = KOHLER_PRODUCTS.filter(
      (p) => p.category !== 'toilet' || p.id === 't3'
    );

    const bundles = generateTopBundles(
      catalog,
      { ...baseRequirements, requiredCategories: ['toilet'], budgetINR: 500000 },
      'balanced',
      3
    );

    assert.ok(bundles.length > 0);
    assert.strictEqual(bundles[0].products[0].id, 't3');
  });

  test('optimizer can select the thermostatic valve when it is the only shower-category candidate', () => {
    const catalog = KOHLER_PRODUCTS.filter(
      (p) => p.category !== 'shower' || p.id === 's3'
    );

    const bundles = generateTopBundles(
      catalog,
      { ...baseRequirements, requiredCategories: ['shower'], budgetINR: 500000 },
      'balanced',
      3
    );

    assert.ok(bundles.length > 0);
    assert.strictEqual(bundles[0].products[0].id, 's3');
  });

  test('the smart toilet does not get forced into every bundle', () => {
    // With the full catalog and a modest budget, cheaper toilets exist,
    // so the smart toilet (₹379,999) should not dominate every result.
    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      baseRequirements,
      'balanced',
      3
    );

    const allBundlesUseSmartToilet = bundles.every((bundle) =>
      bundle.products.some((p) => p.id === 't3')
    );

    assert.strictEqual(allBundlesUseSmartToilet, false);
  });

  test('budget constraint still excludes the smart toilet when too low', () => {
    const catalog = KOHLER_PRODUCTS.filter(
      (p) => p.category !== 'toilet' || p.id === 't3'
    );

    const bundles = generateTopBundles(
      catalog,
      { ...baseRequirements, requiredCategories: ['toilet'], budgetINR: 100000 },
      'balanced',
      3
    );

    assert.strictEqual(bundles.length, 0);
  });

  test('category coverage still works with the expanded catalog', () => {
    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      { ...baseRequirements, budgetINR: 600000 },
      'luxurious',
      5
    );

    for (const bundle of bundles) {
      const categories = bundle.products.map((p) => p.category);
      assert.strictEqual(new Set(categories).size, 4);
      assert.ok(categories.includes('toilet'));
      assert.ok(categories.includes('faucet'));
      assert.ok(categories.includes('shower'));
      assert.ok(categories.includes('vanity'));
    }
  });

  test('a valid bundle can include both new product classes together', () => {
    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      { ...baseRequirements, budgetINR: 600000 },
      'luxurious',
      20
    );

    const hasBoth = bundles.some(
      (bundle) =>
        bundle.products.some((p) => p.id === 't3') &&
        bundle.products.some((p) => p.id === 's3')
    );

    assert.ok(
      hasBoth,
      'expected at least one high-budget, luxury-weighted bundle to include both the smart toilet and the thermostatic valve'
    );
  });
});