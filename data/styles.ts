import { StyleTheme } from '@/types/product';

export const THEME_DEFINITIONS: Record<StyleTheme, { label: string; description: string; colors: string[] }> = {
  'minimalist-modern': {
    label: 'Minimalist Modern',
    description: 'Clean lines, uncluttered spaces, and sleek geometric forms.',
    colors: ['#ffffff', '#000000', '#f5f5f5']
  },
  'classic-luxury': {
    label: 'Classic Luxury',
    description: 'Timeless elegance with rich finishes and ornate details.',
    colors: ['#f4eedd', '#d4af37', '#ffffff']
  },
  'japanese-zen': {
    label: 'Japanese Zen',
    description: 'Harmonious, nature-inspired design promoting tranquility.',
    colors: ['#e4d5b7', '#5d5c61', '#b7c6c9']
  },
  'contemporary': {
    label: 'Contemporary',
    description: 'Current trends featuring bold contrasts and fluid curves.',
    colors: ['#ffffff', '#333333', '#e0e0e0']
  },
  'transitional': {
    label: 'Transitional',
    description: 'A balanced blend of traditional and contemporary styles.',
    colors: ['#eceadd', '#8b7d6b', '#ffffff']
  },
  'industrial': {
    label: 'Industrial',
    description: 'Raw, utilitarian aesthetic with exposed elements and dark tones.',
    colors: ['#3e3e3e', '#7b7b7b', '#b38b6d']
  }
};
