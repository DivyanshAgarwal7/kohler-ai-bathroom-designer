import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { validateBudget, validateCategoryCoverage, checkProductFitsZone } from '../lib/engine/constraints';
import { KohlerProduct } from '../types/product';

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
