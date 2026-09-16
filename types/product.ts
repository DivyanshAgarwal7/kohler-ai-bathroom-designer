export type ProductCategory = 'toilet' | 'faucet' | 'shower' | 'vanity';

export type InstallationType =
  | 'floor-mount'
  | 'wall-mount'
  | 'countertop'
  | 'undermount'
  | 'freestanding'
  | 'ceiling-mount';

export type StyleTheme =
  | 'minimalist-modern'
  | 'classic-luxury'
  | 'japanese-zen'
  | 'contemporary'
  | 'transitional'
  | 'industrial';

export type Finish =
  | 'polished-chrome'
  | 'brushed-nickel'
  | 'matte-black'
  | 'white'
  | 'polished-gold'
  | 'brushed-gold'
  | 'oil-rubbed-bronze'
  | 'wood-veneer'
  | 'ceramic';

export type DataConfidence = 'verified' | 'estimated' | 'placeholder';

export type WaterConsumptionData =
  | {
      type: 'flush';
      valueLPF: number;
      dualFlush: false;
    }
  | {
      type: 'flush';
      dualFlush: true;
      fullFlushLPF: number;
      reducedFlushLPF: number;
    }
  | {
      type: 'flow';
      valueLPM: number;
    };

export interface KohlerProduct {
  id: string;
  modelNumber: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  priceINR: number;
  dimensions: {
    widthMM: number;
    depthMM: number;
    heightMM: number;
  };
  installation: {
    type: InstallationType;
    roughInMM: number | null;
    requiresElectrical: boolean;
    electricalSpec: string | null;
    plumbingType: 'standard' | 'concealed' | 'exposed';
    notes: string | null;
  };
  waterConsumption: WaterConsumptionData | null;
  style: {
    themes: StyleTheme[];
    collection: string | null;
    finishes: Finish[];
    defaultFinish: Finish;
  };
  smartFeatures: string[];
  productUrl: string;
  imageUrl: string;
  topViewSvg: string;
  verificationDate: string;
  dataConfidence: DataConfidence;
}
