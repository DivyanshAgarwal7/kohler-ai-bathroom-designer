import { KohlerProduct, ProductCategory } from '@/types/product';
import { UserRequirements, Bundle, WeightPreset } from '@/types/recommendation';
import { validateBudget, checkProductFitsZone } from './constraints';
import { scoreBundle } from './scoring';

export function generateTopBundles(
  catalog: KohlerProduct[],
  reqs: UserRequirements,
  preset: WeightPreset,
  k: number = 3
): Bundle[] {
  // 1. Group by category and pre-filter by zone
  const candidatesByCategory: Record<ProductCategory, KohlerProduct[]> = {
    toilet: [], faucet: [], shower: [], vanity: []
  };
  
  reqs.requiredCategories.forEach(cat => {
    candidatesByCategory[cat] = catalog
      .filter(p => p.category === cat)
      // Hard constraint: Must fit the zone
      .filter(p => checkProductFitsZone(p, reqs.dimensions.widthFt, reqs.dimensions.lengthFt));
  });

  // 2. Generate all combinations
  let bundles: KohlerProduct[][] = [[]];
  
  for (const cat of reqs.requiredCategories) {
    const candidates = candidatesByCategory[cat];
    if (candidates.length === 0) {
      // If any required category has no fitting products, return empty array
      return [];
    }
    
    const newBundles: KohlerProduct[][] = [];
    for (const bundle of bundles) {
      for (const product of candidates) {
        newBundles.push([...bundle, product]);
      }
    }
    bundles = newBundles;
  }
  
  // 3. Filter by budget and score
  const validBundles: Bundle[] = [];
  
  bundles.forEach((productArray, index) => {
    // Hard constraint: Budget
    if (validateBudget(productArray, reqs.budgetINR)) {
      const scores = scoreBundle(productArray, reqs, preset);
      validBundles.push({
        id: `bundle-${Date.now()}-${index}`,
        products: productArray,
        totalPriceINR: productArray.reduce((sum, p) => sum + p.priceINR, 0),
        scores
      });
    }
  });
  
  // 4. Rank by total score descending
  validBundles.sort((a, b) => b.scores.total - a.scores.total);
  
  return validBundles.slice(0, k);
}
