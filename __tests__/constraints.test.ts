import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { validateBudget, validateCategoryCoverage, checkProductFitsZone } from '../lib/engine/constraints';
import { KohlerProduct } from '../types/product';
import { KOHLER_PRODUCTS } from '../data/products';

const mockToilet: KohlerProduct = {
  id: 't1',
  modelNumber: 'K-123',
  name: 'Test Toilet',
  category: 'toilet',
  subcategory: 'two-piece',
  priceINR: 10000,
  dimensions: { widthMM: 400, depthMM: 700, heightMM: 800 },
  installation: { type: 'floor-mount', roughInMM: 305, requiresElectrical: false, electricalSpec: null, plumbingType: 'standard', notes: null },
  waterConsumption: { type: 'flush', valueLPF: 4.8, dualFlush: false },
  style: { themes: ['minimalist-modern'], collection: null, finishes: ['white'], defaultFinish: 'white' },
  smartFeatures: [],
  productUrl: '',
  imageUrl: '',
  topViewSvg: '',
  verificationDate: '',
  dataConfidence: 'placeholder'
};

const mockVanity: KohlerProduct = {
  ...mockToilet,
  id: 'v1',
  category: 'vanity',
  priceINR: 20000,
  dimensions: { widthMM: 900, depthMM: 500, heightMM: 800 }
};

describe('Hard Constraints Engine', () => {
  test('validateBudget rejects bundles over budget', () => {
    assert.strictEqual(validateBudget([mockToilet, mockVanity], 25000), false);
  });
  
  test('validateBudget accepts bundles under or equal to budget', () => {
    assert.strictEqual(validateBudget([mockToilet, mockVanity], 30000), true);
  });
  
  test('validateCategoryCoverage requires exact categories', () => {
    assert.strictEqual(validateCategoryCoverage([mockToilet], ['toilet', 'vanity']), false);
    assert.strictEqual(validateCategoryCoverage([mockToilet, mockVanity], ['toilet', 'vanity']), true);
  });
  
  test('checkProductFitsZone verifies physical dimensions against zone', () => {
    assert.strictEqual(checkProductFitsZone(mockVanity, 8, 8), true);
    
    const hugeVanity: KohlerProduct = {
      ...mockVanity,
      dimensions: { widthMM: 2000, depthMM: 1000, heightMM: 800 }
    };
    // 5x5 ft room (small). Small room template assigns 800x550 zone. Should fail.
    assert.strictEqual(checkProductFitsZone(hugeVanity, 5, 5), false);
  });
});

describe('New product classes fit their assigned zones', () => {
  const smartToilet = KOHLER_PRODUCTS.find((p) => p.id === 't3') as KohlerProduct;
  const thermostaticValve = KOHLER_PRODUCTS.find((p) => p.id === 's3') as KohlerProduct;

  test('smart toilet fits the toilet zone in a typical room', () => {
    assert.ok(smartToilet);
    assert.strictEqual(checkProductFitsZone(smartToilet, 8, 10), true);
  });

  test('smart toilet fits the toilet zone even in a small room', () => {
    assert.strictEqual(checkProductFitsZone(smartToilet, 6, 6), true);
  });

  test('thermostatic valve fits the shower zone (no fake floor footprint)', () => {
    assert.ok(thermostaticValve);
    assert.strictEqual(checkProductFitsZone(thermostaticValve, 8, 10), true);
    assert.strictEqual(checkProductFitsZone(thermostaticValve, 6, 6), true);

    // It should occupy a small fraction of the shower zone, not a
    // fabricated fixture-sized footprint.
    const zoneArea = 900 * 900; // smallest shower zone
    const productArea =
      thermostaticValve.dimensions.widthMM *
      thermostaticValve.dimensions.depthMM;

    assert.ok(productArea < zoneArea * 0.2);
  });

  test('validateBudget and validateCategoryCoverage work with the new products', () => {
    assert.strictEqual(
      validateBudget([smartToilet, thermostaticValve], 500000),
      true
    );
    assert.strictEqual(
      validateBudget([smartToilet, thermostaticValve], 100000),
      false
    );
    assert.strictEqual(
      validateCategoryCoverage([smartToilet, thermostaticValve], [
        'toilet',
        'shower',
      ]),
      true
    );
  });
});
