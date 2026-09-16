import { generateLayoutForBundle } from '@/lib/layout/generate-layout';
import { NextResponse } from 'next/server';

import { KOHLER_PRODUCTS } from '@/data/products';
import { UserRequirementsSchema } from '@/data/schemas';
import { generateTopBundles } from '@/lib/engine/optimizer';
import { calculateAnnualWaterUsage } from '@/lib/engine/sustainability';

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsed = UserRequirementsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid requirements.',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const requirements = parsed.data;

    const bundles = generateTopBundles(
      KOHLER_PRODUCTS,
      requirements,
      'balanced',
      3
    );

    const waterUsage = calculateAnnualWaterUsage(
  bundles.length > 0 ? bundles[0].products : [],
  {
    householdSize: requirements.householdSize,
    toiletFlushesPerPersonPerDay: 5,
    faucetMinutesPerPersonPerDay: 8,
    showerMinutesPerPersonPerDay: 12,
    dualFlushReducedRatio: 0.70,
    dualFlushFullRatio: 0.30,
  }
);

    const layout =
    bundles.length > 0
    ? generateLayoutForBundle(
        bundles[0].products,
        requirements.dimensions.widthFt,
        requirements.dimensions.lengthFt
      )
    : null;

    return NextResponse.json({
      success: true,
      bundles,
      waterUsage,
      layout,
      catalogSize: KOHLER_PRODUCTS.length,
    });
  } catch (error) {
  console.error('Recommendation API error:', error);

  return NextResponse.json(
    {
      success: false,
      error:
        error instanceof Error
          ? 'Unable to generate recommendations right now.'
          : 'Unexpected recommendation error.',
    },
    { status: 500 }
  );
}
}