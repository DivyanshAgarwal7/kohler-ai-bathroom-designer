import { Bundle, UserRequirements } from '@/types/recommendation';
import { calculateAnnualWaterUsage } from '../engine/sustainability';

export function generateTemplateExplanation(
  bundle: Bundle,
  reqs: UserRequirements
): string {
  const waterData = calculateAnnualWaterUsage(
  bundle.products,
  {
    householdSize: reqs.householdSize,
    toiletFlushesPerPersonPerDay: 5,
    faucetMinutesPerPersonPerDay: 8,
    showerMinutesPerPersonPerDay: 12,
    dualFlushReducedRatio: 0.70,
    dualFlushFullRatio: 0.30,
  }
);
  const budgetPct = Math.round(
    (bundle.totalPriceINR / reqs.budgetINR) * 100
  );

  let text =
    `Based on your \u20B9${reqs.budgetINR.toLocaleString('en-IN')} budget ` +
    `and ${reqs.selectedThemes
      .map((theme) => theme.replace('-', ' '))
      .join(', ')} preferences ` +
    `for a ${reqs.dimensions.widthFt}\u00D7${reqs.dimensions.lengthFt} ft bathroom, ` +
    `we recommend this ${bundle.products.length}-piece bundle from KOHLER.\n\n`;

  const toilet = bundle.products.find((product) => product.category === 'toilet');

  if (toilet?.waterConsumption?.type === 'flush') {
    const waterConsumption = toilet.waterConsumption;

    const lpf = waterConsumption.dualFlush
      ? `${waterConsumption.reducedFlushLPF}/${waterConsumption.fullFlushLPF}`
      : `${waterConsumption.valueLPF}`;

    text +=
      `The ${toilet.name} offers high efficiency at ${lpf} liters per flush. `;
  }

  const vanity = bundle.products.find(
    (product) => product.category === 'vanity'
  );

  if (vanity) {
    text +=
      `The ${vanity.name} fits your aesthetic with a premium ` +
      `${vanity.style.defaultFinish.replace('-', ' ')} finish.\n\n`;
  } else {
    text += '\n\n';
  }

  text +=
    `Total estimated cost: \u20B9${bundle.totalPriceINR.toLocaleString('en-IN')} ` +
    `(${budgetPct}% of your budget).\n`;

  text +=
    `Estimated annual water usage: ` +
    `${waterData.bundleAnnualLiters.toLocaleString('en-IN')} liters.\n`;

  text +=
    `Estimated annual savings vs. baseline: ` +
    `${waterData.estimatedAnnualSavingsLiters.toLocaleString('en-IN')} liters.\n\n`;

  text +=
    'Note: All water estimates are based on assumed household usage patterns.';

  return text;
}