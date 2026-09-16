import { ProductCategory } from '@/types/product';

export const CATEGORY_DEFINITIONS: Record<ProductCategory, { label: string; description: string }> = {
  toilet: {
    label: 'Toilets',
    description: 'Intelligent, wall-hung, and one-piece toilets with advanced flushing.'
  },
  faucet: {
    label: 'Faucets',
    description: 'Bathroom sink faucets blending style and water efficiency.'
  },
  shower: {
    label: 'Shower Systems',
    description: 'Rainheads, handshowers, and thermostatic valves.'
  },
  vanity: {
    label: 'Vanities',
    description: 'Bathroom furniture with integrated storage and premium finishes.'
  }
};
