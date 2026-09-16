import { KohlerProduct, ProductCategory } from '@/types/product';
import {
  LayoutData,
  PlacedProduct,
} from '@/types/recommendation';
import { getFixtureZonesForRoom } from './templates';

const MM_PER_FOOT = 304.8;

function getZonePosition(
  category: ProductCategory,
  roomWidthMM: number,
  roomLengthMM: number,
  zoneWidthMM: number,
  zoneDepthMM: number
) {
  const margin = 200;

  switch (category) {
    case 'shower':
      return {
        x: margin,
        y: margin,
      };

    case 'vanity':
      return {
        x: Math.max(margin, roomWidthMM - zoneWidthMM - margin),
        y: margin,
      };

    case 'toilet':
      return {
        x: margin,
        y: Math.max(
          margin,
          roomLengthMM - zoneDepthMM - margin
        ),
      };

    case 'faucet':
      // Faucet is associated with the vanity area.
      return {
        x: Math.max(margin, roomWidthMM - zoneWidthMM - margin),
        y: margin,
      };

    default:
      return {
        x: margin,
        y: margin,
      };
  }
}

export function generateLayoutForBundle(
  products: KohlerProduct[],
  roomWidthFt: number,
  roomLengthFt: number
): LayoutData {
  const roomWidthMM = roomWidthFt * MM_PER_FOOT;
  const roomLengthMM = roomLengthFt * MM_PER_FOOT;

  const categories = products.map((product) => product.category);

  const fixtureZones = getFixtureZonesForRoom(
    roomWidthMM,
    roomLengthMM,
    categories
  );

  const zones = fixtureZones.map((zone) => {
    const position = getZonePosition(
      zone.category,
      roomWidthMM,
      roomLengthMM,
      zone.widthMM,
      zone.depthMM
    );

    return {
      id: zone.id,
      category: zone.category,
      x: position.x,
      y: position.y,
      widthMM: zone.widthMM,
      depthMM: zone.depthMM,
    };
  });

  const placements: PlacedProduct[] = products.map((product) => {
  const zone = zones.find(
    (candidate) => candidate.category === product.category
  );

  // Faucets are mounted on the vanity rather than occupying an
  // independent bathroom floor position.
  if (product.category === 'faucet') {
    const vanityZone = zones.find(
      (candidate) => candidate.category === 'vanity'
    );

    if (vanityZone) {
      const faucetX =
        vanityZone.x +
        vanityZone.widthMM / 2 -
        product.dimensions.widthMM / 2;

      const faucetY =
        vanityZone.y + 35;

      return {
        productId: product.id,
        x: faucetX,
        y: faucetY,
        rotation: 0,
        zone: vanityZone.id,
      };
    }
  }

  return {
    productId: product.id,
    x: zone?.x ?? 200,
    y: zone?.y ?? 200,
    rotation: 0,
    zone: zone?.id ?? `z-${product.category}`,
  };
});

  return {
    room: {
      widthMM: roomWidthMM,
      lengthMM: roomLengthMM,
    },
    zones,
    placements,
  };
}