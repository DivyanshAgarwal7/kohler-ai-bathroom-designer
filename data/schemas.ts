import { z } from 'zod';

export const ProductCategorySchema = z.enum(['toilet', 'faucet', 'shower', 'vanity']);

export const StyleThemeSchema = z.enum([
  'minimalist-modern',
  'classic-luxury',
  'japanese-zen',
  'contemporary',
  'transitional',
  'industrial'
]);

export const FinishSchema = z.enum([
  'polished-chrome',
  'brushed-nickel',
  'matte-black',
  'white',
  'polished-gold',
  'brushed-gold',
  'oil-rubbed-bronze',
  'wood-veneer',
  'ceramic'
]);

export const DimensionsSchema = z.object({
  widthMM: z.number().positive(),
  depthMM: z.number().positive(),
  heightMM: z.number().positive(),
});

export const WaterConsumptionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('flush'),
    valueLPF: z.number().positive(),
    dualFlush: z.literal(false)
  }),
  z.object({
    type: z.literal('flush'),
    dualFlush: z.literal(true),
    fullFlushLPF: z.number().positive(),
    reducedFlushLPF: z.number().positive()
  }),
  z.object({
    type: z.literal('flow'),
    valueLPM: z.number().positive()
  })
]);

export const KohlerProductSchema = z.object({
  id: z.string(),
  modelNumber: z.string(),
  name: z.string(),
  category: ProductCategorySchema,
  subcategory: z.string(),
  priceINR: z.number().positive(),
  dimensions: DimensionsSchema,
  installation: z.object({
    type: z.string(),
    roughInMM: z.number().nullable(),
    requiresElectrical: z.boolean(),
    electricalSpec: z.string().nullable(),
    plumbingType: z.enum(['standard', 'concealed', 'exposed']),
    notes: z.string().nullable()
  }),
  waterConsumption: WaterConsumptionSchema.nullable(),
  style: z.object({
    themes: z.array(StyleThemeSchema),
    collection: z.string().nullable(),
    finishes: z.array(FinishSchema),
    defaultFinish: FinishSchema
  }),
  smartFeatures: z.array(z.string()),
  productUrl: z.string(),
  imageUrl: z.string(),
  topViewSvg: z.string(),
  verificationDate: z.string(),
  dataConfidence: z.enum(['verified', 'estimated', 'placeholder'])
});

export const UserRequirementsSchema = z.object({
  dimensions: z.object({
    lengthFt: z.number().min(3).max(50),
    widthFt: z.number().min(3).max(50)
  }),
  budgetINR: z.number().min(50000).max(1000000),
  selectedThemes: z.array(StyleThemeSchema).min(1),
  requiredCategories: z.array(ProductCategorySchema).min(1),
  householdSize: z.number().min(1).max(20).default(4),
  imageUrl: z.string().optional(),
  freeText: z.string().optional()
});
