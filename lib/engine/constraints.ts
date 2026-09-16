import { KohlerProduct, ProductCategory } from '@/types/product';
import { getFixtureZonesForRoom } from '../layout/templates';

const MM_PER_FOOT = 304.8;
const MIN_ROOM_CLEARANCE_MM = 200;

export interface ConstraintResult {
  valid: boolean;
  reasons: string[];
  warnings: string[];
}

export function validateBudget(
  products: KohlerProduct[],
  budgetINR: number
): boolean {
  const totalCost = products.reduce((sum, product) => sum + product.priceINR, 0);
  return totalCost <= budgetINR;
}

export function validateCategoryCoverage(
  products: KohlerProduct[],
  requiredCategories: ProductCategory[]
): boolean {
  if (products.length !== requiredCategories.length) {
    return false;
  }

  const presentCategories = new Set(products.map((product) => product.category));

  return requiredCategories.every((category) =>
    presentCategories.has(category)
  );
}

export function checkProductFitsZone(
  product: KohlerProduct,
  roomWidthFt: number,
  roomLengthFt: number
): boolean {
  const roomWidthMM = roomWidthFt * MM_PER_FOOT;
  const roomLengthMM = roomLengthFt * MM_PER_FOOT;

  const zones = getFixtureZonesForRoom(
    roomWidthMM,
    roomLengthMM,
    [product.category]
  );

  const targetZone = zones.find(
    (zone) => zone.category === product.category
  );

  if (!targetZone) {
    return false;
  }

  const { widthMM, depthMM } = product.dimensions;

  const fitsNormal =
    widthMM <= targetZone.widthMM &&
    depthMM <= targetZone.depthMM;

  const fitsRotated =
    widthMM <= targetZone.depthMM &&
    depthMM <= targetZone.widthMM;

  const fitsRoomNormal =
    widthMM <= roomWidthMM - MIN_ROOM_CLEARANCE_MM &&
    depthMM <= roomLengthMM - MIN_ROOM_CLEARANCE_MM;

  const fitsRoomRotated =
    widthMM <= roomLengthMM - MIN_ROOM_CLEARANCE_MM &&
    depthMM <= roomWidthMM - MIN_ROOM_CLEARANCE_MM;

  return (
    (fitsNormal || fitsRotated) &&
    (fitsRoomNormal || fitsRoomRotated)
  );
}

export function validateProduct(
  product: KohlerProduct,
  roomWidthFt: number,
  roomLengthFt: number
): ConstraintResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  if (!checkProductFitsZone(product, roomWidthFt, roomLengthFt)) {
    reasons.push(
      `${product.name} does not fit the allocated ${product.category} zone.`
    );
  }

  if (product.dataConfidence !== 'verified') {
    warnings.push(
      `${product.name} contains estimated product data and should not be treated as manufacturer-certified CAD data.`
    );
  }

  if (
    product.installation.requiresElectrical &&
    !product.installation.electricalSpec
  ) {
    warnings.push(
      `${product.name} requires electrical installation details that are not fully specified.`
    );
  }

  return {
    valid: reasons.length === 0,
    reasons,
    warnings,
  };
}