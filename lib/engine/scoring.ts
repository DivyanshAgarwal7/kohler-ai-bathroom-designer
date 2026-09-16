import { KohlerProduct, StyleTheme } from '@/types/product';
import { BundleScore, OptimizationWeights, UserRequirements, WeightPreset } from '@/types/recommendation';
import { calculateBundleSustainabilityScore } from './sustainability';
import { getFixtureZonesForRoom } from '../layout/templates';

const PRESET_WEIGHTS: Record<WeightPreset, OptimizationWeights> = {
  'balanced': { styleMatch: 0.30, sustainability: 0.15, value: 0.20, spaceFit: 0.15, coherence: 0.20, functionality: 0.00 },
  'sustainable': { styleMatch: 0.15, sustainability: 0.40, value: 0.15, spaceFit: 0.15, coherence: 0.15, functionality: 0.00 },
  'lower-budget': { styleMatch: 0.15, sustainability: 0.10, value: 0.40, spaceFit: 0.15, coherence: 0.20, functionality: 0.00 },
  'luxurious': { styleMatch: 0.35, sustainability: 0.10, value: 0.05, spaceFit: 0.15, coherence: 0.35, functionality: 0.00 }
};

export function calculateStyleMatch(products: KohlerProduct[], userThemes: StyleTheme[]): number {
  if (userThemes.length === 0) return 1.0;
  
  let totalMatch = 0;
  products.forEach(p => {
    const overlap = p.style.themes.filter(t => userThemes.includes(t)).length;
    // Score based on whether there's at least one match
    totalMatch += overlap > 0 ? 1.0 : 0.0;
  });
  
  return totalMatch / products.length;
}

export function calculateSpaceFit(products: KohlerProduct[], roomWidthFt: number, roomLengthFt: number): number {
  const roomWidthMM = roomWidthFt * 304.8;
  const roomLengthMM = roomLengthFt * 304.8;
  
  const zones = getFixtureZonesForRoom(roomWidthMM, roomLengthMM, products.map(p => p.category));
  
  let totalFit = 0;
  products.forEach(p => {
    const zone = zones.find(z => z.category === p.category);
    if (!zone) {
      totalFit += 1.0; // If no zone constraint, assume it fits perfectly
      return;
    }
    
    const productArea = p.dimensions.widthMM * p.dimensions.depthMM;
    const zoneArea = zone.widthMM * zone.depthMM;
    
    // Scale the fit: 0.5 means it takes half the zone, 1.0 means it takes 0% of the zone (impossible but mathematical max)
    // A comfortable fit taking 30% of the zone returns 0.7
    const fit = Math.max(0, Math.min(1.0, 1 - (productArea / zoneArea)));
    
    // Normalize it so a typical comfortable fit (e.g. 0.6) scores closer to 1.0.
    totalFit += Math.min(1.0, fit * 1.5);
  });
  
  return totalFit / products.length;
}

export function calculateValueScore(
  totalCost: number,
  budget: number,
  preset: WeightPreset
): number {
  if (budget <= 0 || totalCost > budget) {
    return 0;
  }

  const utilization = totalCost / budget;
  const remainingBudget = 1 - utilization;

  switch (preset) {
    case 'lower-budget':
      return remainingBudget;

    case 'balanced':
      return 0.5 + remainingBudget * 0.5;

    case 'sustainable':
      return 0.5 + remainingBudget * 0.5;

    case 'luxurious':
      return utilization;

    default:
      return remainingBudget;
  }
}

export function calculateCoherence(products: KohlerProduct[]): number {
  if (products.length === 0) return 1.0;
  
  // Count how many share the same collection
  const collections = products.map(p => p.style.collection).filter(c => c !== null);
  const maxCollectionCount = collections.length > 0 
    ? Math.max(...Object.values(collections.reduce((acc, c) => { acc[c as string] = (acc[c as string] || 0) + 1; return acc; }, {} as Record<string, number>)))
    : 1;
    
  // Count how many share the same finish
  const finishes = products.map(p => p.style.defaultFinish);
  const maxFinishCount = finishes.length > 0
    ? Math.max(...Object.values(finishes.reduce((acc, f) => { acc[f] = (acc[f] || 0) + 1; return acc; }, {} as Record<string, number>)))
    : 1;

  const collectionScore = maxCollectionCount / products.length;
  const finishScore = maxFinishCount / products.length;
  
  return (collectionScore * 0.5) + (finishScore * 0.5);
}

export function scoreBundle(products: KohlerProduct[], reqs: UserRequirements, preset: WeightPreset): BundleScore {
  const weights = PRESET_WEIGHTS[preset];
  const totalCost = products.reduce((sum, p) => sum + p.priceINR, 0);
  
  const styleMatch = calculateStyleMatch(products, reqs.selectedThemes);
  const sustainability = calculateBundleSustainabilityScore(products);
  const value = calculateValueScore(totalCost, reqs.budgetINR, preset);
  const spaceFit = calculateSpaceFit(products, reqs.dimensions.widthFt, reqs.dimensions.lengthFt);
  const coherence = calculateCoherence(products);
  
  const total = (
    (styleMatch * weights.styleMatch) +
    (sustainability * weights.sustainability) +
    (value * weights.value) +
    (spaceFit * weights.spaceFit) +
    (coherence * weights.coherence)
  );
  
  return {
    styleMatch: Math.round(styleMatch * 100),
    sustainability: Math.round(sustainability * 100),
    value: Math.round(value * 100),
    spaceFit: Math.round(spaceFit * 100),
    coherence: Math.round(coherence * 100),
    total: Math.round(total * 100)
  };
}
