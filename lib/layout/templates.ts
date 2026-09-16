import { ProductCategory } from '@/types/product';

export interface FixtureZone {
  id: string;
  category: ProductCategory;
  widthMM: number;
  depthMM: number;
}

export function getFixtureZonesForRoom(roomWidthMM: number, roomLengthMM: number, requiredCategories: ProductCategory[]): FixtureZone[] {
  // A simplistic mock allocator for the prototype spatial validation
  // It returns standard generous zone sizes based on the room dimensions.
  // If the room is extremely small, it will return smaller zones, forcing product rejections.
  
  const zones: FixtureZone[] = [];
  
  // Very rough heuristic for prototype
  const isSmallRoom = (roomWidthMM * roomLengthMM) < (2000 * 2000); // Less than ~4 sqm
  
  if (requiredCategories.includes('vanity')) {
    zones.push({ 
      id: 'z-vanity', 
      category: 'vanity', 
      widthMM: isSmallRoom ? 800 : 1500, 
      depthMM: isSmallRoom ? 550 : 800 
    });
  }
  
  if (requiredCategories.includes('toilet')) {
    zones.push({ 
      id: 'z-toilet', 
      category: 'toilet', 
      widthMM: isSmallRoom ? 800 : 1000, 
      depthMM: isSmallRoom ? 1100 : 1400 
    });
  }
  
  if (requiredCategories.includes('shower')) {
    zones.push({ 
      id: 'z-shower', 
      category: 'shower', 
      widthMM: isSmallRoom ? 900 : 1200, 
      depthMM: isSmallRoom ? 900 : 1200 
    });
  }
  
  if (requiredCategories.includes('faucet')) {
    // Faucets fit on the vanity; their zone is trivial
    zones.push({ 
      id: 'z-faucet', 
      category: 'faucet', 
      widthMM: 500, 
      depthMM: 300 
    });
  }
  
  return zones;
}
