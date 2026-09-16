import { UsageAssumptions } from '@/types/recommendation';

export const SUSTAINABILITY_BASELINES = {
  toilet: {
    standardLPF: 6.0,
    waterSenseLPF: 4.8,
  },
  faucet: {
    standardLPM: 8.3,
    waterSenseLPM: 5.7,
  },
  shower: {
    standardLPM: 9.5,
    waterSenseLPM: 7.6,
  }
};

export const DEFAULT_USAGE_ASSUMPTIONS: UsageAssumptions = {
  householdSize: 4,
  toiletFlushesPerPersonPerDay: 5,
  faucetMinutesPerPersonPerDay: 8,
  showerMinutesPerPersonPerDay: 8,
  dualFlushReducedRatio: 0.70,
  dualFlushFullRatio: 0.30
};
