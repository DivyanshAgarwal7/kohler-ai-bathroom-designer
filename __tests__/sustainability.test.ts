import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { calculateProductWaterEfficiencyScore, calculateAnnualWaterUsage } from '../lib/engine/sustainability';
import { KohlerProduct } from '../types/product';
import { KOHLER_PRODUCTS } from '../data/products';

const mockEfficientToilet: KohlerProduct = {
  id: 't1', modelNumber: '', name: '', category: 'toilet', subcategory: '', priceINR: 0,
  dimensions: { widthMM: 0, depthMM: 0, heightMM: 0 },
  installation: { type: 'floor-mount', roughInMM: null, requiresElectrical: false, electricalSpec: null, plumbingType: 'standard', notes: null },
  waterConsumption: { type: 'flush', dualFlush: true, fullFlushLPF: 4.8, reducedFlushLPF: 3.0 }, 
  style: { themes: [], collection: null, finishes: [], defaultFinish: 'white' },
  smartFeatures: [], productUrl: '', imageUrl: '', topViewSvg: '', verificationDate: '', dataConfidence: 'estimated'
};

const mockStandardToilet: KohlerProduct = {
  ...mockEfficientToilet,
  waterConsumption: { type: 'flush', valueLPF: 6.0, dualFlush: false },
};

describe('Sustainability Engine', () => {
  test('calculateProductWaterEfficiencyScore rewards efficiency', () => {
    const standardScore = calculateProductWaterEfficiencyScore(mockStandardToilet);
    const efficientScore = calculateProductWaterEfficiencyScore(mockEfficientToilet);
    
    // Efficient should have a higher score
    assert.strictEqual(standardScore, 0); // 1 - (6.0/6.0) = 0
    assert.ok(efficientScore > 0);
  });
  
  test('calculateAnnualWaterUsage calculates estimates and savings correctly', () => {
    const result = calculateAnnualWaterUsage([mockEfficientToilet]);
    
    assert.ok(result.bundleAnnualLiters > 0);
    assert.ok(result.baselineAnnualLiters > 0);
    assert.ok(result.estimatedAnnualSavingsLiters > 0);
    assert.strictEqual(result.bundleAnnualLiters + result.estimatedAnnualSavingsLiters, result.baselineAnnualLiters);
  });
});

describe('New product classes do not break sustainability calculations', () => {
  const smartToilet = KOHLER_PRODUCTS.find((p) => p.id === 't3') as KohlerProduct;
  const thermostaticValve = KOHLER_PRODUCTS.find((p) => p.id === 's3') as KohlerProduct;

  test('smart toilet dual-flush water efficiency score is between 0 and 1', () => {
    const score = calculateProductWaterEfficiencyScore(smartToilet);
    assert.ok(score >= 0 && score <= 1);
  });

  test('thermostatic valve (null waterConsumption) is safely excluded from usage totals', () => {
    assert.strictEqual(thermostaticValve.waterConsumption, null);

    const result = calculateAnnualWaterUsage([thermostaticValve]);

    assert.strictEqual(result.bundleAnnualLiters, 0);
    assert.strictEqual(result.baselineAnnualLiters, 0);
    assert.strictEqual(result.estimatedAnnualSavingsLiters, 0);
  });

  test('a bundle mixing both new products still produces a sane annual usage total', () => {
    const result = calculateAnnualWaterUsage([smartToilet, thermostaticValve]);

    assert.ok(result.bundleAnnualLiters > 0);
    assert.ok(result.baselineAnnualLiters > 0);
  });
});
