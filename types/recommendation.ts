import { KohlerProduct, ProductCategory, StyleTheme } from './product';

export interface UserRequirements {
  dimensions: {
    lengthFt: number;
    widthFt: number;
  };
  budgetINR: number;
  selectedThemes: StyleTheme[];
  requiredCategories: ProductCategory[];
  householdSize: number;
  imageUrl?: string;
  freeText?: string;
}

export interface PlacedProduct {
  productId: string;
  x: number;
  y: number;
  rotation: number;
  zone: string;
}

export interface LayoutData {
  room: {
    widthMM: number;
    lengthMM: number;
  };
  zones: {
    id: string;
    category: ProductCategory;
    x: number;
    y: number;
    widthMM: number;
    depthMM: number;
  }[];
  placements: PlacedProduct[];
}

export interface BundleScore {
  styleMatch: number;
  sustainability: number;
  value: number;
  spaceFit: number;
  coherence: number;
  total: number;
}

export interface Bundle {
  id: string;
  products: KohlerProduct[];
  totalPriceINR: number;
  scores: BundleScore;
  isCustomized?: boolean;
}

export type WeightPreset = 'balanced' | 'sustainable' | 'lower-budget' | 'luxurious';

export interface OptimizationWeights {
  styleMatch: number;
  sustainability: number;
  value: number;
  spaceFit: number;
  coherence: number;
  functionality: number;
}

export interface UsageAssumptions {
  householdSize: number;
  toiletFlushesPerPersonPerDay: number;
  faucetMinutesPerPersonPerDay: number;
  showerMinutesPerPersonPerDay: number;
  dualFlushReducedRatio: number;
  dualFlushFullRatio: number;
}
