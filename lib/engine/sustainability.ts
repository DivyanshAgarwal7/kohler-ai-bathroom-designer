import { KohlerProduct } from '@/types/product';
import { UsageAssumptions } from '@/types/recommendation';
import {
  SUSTAINABILITY_BASELINES,
  DEFAULT_USAGE_ASSUMPTIONS,
} from '@/data/sustainability-baselines';

export function calculateProductWaterEfficiencyScore(
  product: KohlerProduct
): number {
  if (!product.waterConsumption) {
    return 0.5;
  }

  const wc = product.waterConsumption;
  let actualConsumption = 0;
  let baselineConsumption = 1;

  if (product.category === 'toilet' && wc.type === 'flush') {
    baselineConsumption = SUSTAINABILITY_BASELINES.toilet.standardLPF;

    if (wc.dualFlush) {
      actualConsumption =
        DEFAULT_USAGE_ASSUMPTIONS.dualFlushReducedRatio *
          wc.reducedFlushLPF +
        DEFAULT_USAGE_ASSUMPTIONS.dualFlushFullRatio * wc.fullFlushLPF;
    } else {
      actualConsumption = wc.valueLPF;
    }
  } else if (product.category === 'faucet' && wc.type === 'flow') {
    baselineConsumption = SUSTAINABILITY_BASELINES.faucet.standardLPM;
    actualConsumption = wc.valueLPM;
  } else if (product.category === 'shower' && wc.type === 'flow') {
    baselineConsumption = SUSTAINABILITY_BASELINES.shower.standardLPM;
    actualConsumption = wc.valueLPM;
  }

  return Math.max(
    0,
    Math.min(1, 1 - actualConsumption / baselineConsumption)
  );
}

export function calculateBundleSustainabilityScore(
  products: KohlerProduct[]
): number {
  const waterProducts = products.filter(
    (product) => product.waterConsumption !== null
  );

  if (waterProducts.length === 0) {
    return 0.5;
  }

  const scores = waterProducts.map(calculateProductWaterEfficiencyScore);

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function calculateAnnualWaterUsage(
  products: KohlerProduct[],
  assumptions: UsageAssumptions = DEFAULT_USAGE_ASSUMPTIONS
) {
  let bundleAnnualLiters = 0;
  let baselineAnnualLiters = 0;

  products.forEach((product) => {
    if (!product.waterConsumption) {
      return;
    }

    const wc = product.waterConsumption;

    if (product.category === 'toilet' && wc.type === 'flush') {
      const actualLPF = wc.dualFlush
        ? assumptions.dualFlushReducedRatio * wc.reducedFlushLPF +
          assumptions.dualFlushFullRatio * wc.fullFlushLPF
        : wc.valueLPF;

      const flushesPerYear =
        assumptions.householdSize *
        assumptions.toiletFlushesPerPersonPerDay *
        365;

      bundleAnnualLiters += flushesPerYear * actualLPF;

      baselineAnnualLiters +=
        flushesPerYear * SUSTAINABILITY_BASELINES.toilet.standardLPF;
    } else if (product.category === 'faucet' && wc.type === 'flow') {
      const minutesPerYear =
        assumptions.householdSize *
        assumptions.faucetMinutesPerPersonPerDay *
        365;

      bundleAnnualLiters += minutesPerYear * wc.valueLPM;

      baselineAnnualLiters +=
        minutesPerYear * SUSTAINABILITY_BASELINES.faucet.standardLPM;
    } else if (product.category === 'shower' && wc.type === 'flow') {
      const minutesPerYear =
        assumptions.householdSize *
        assumptions.showerMinutesPerPersonPerDay *
        365;

      bundleAnnualLiters += minutesPerYear * wc.valueLPM;

      baselineAnnualLiters +=
        minutesPerYear * SUSTAINABILITY_BASELINES.shower.standardLPM;
    }
  });

  return {
    bundleAnnualLiters: Math.round(bundleAnnualLiters),
    baselineAnnualLiters: Math.round(baselineAnnualLiters),
    estimatedAnnualSavingsLiters: Math.round(
      baselineAnnualLiters - bundleAnnualLiters
    ),
  };
}