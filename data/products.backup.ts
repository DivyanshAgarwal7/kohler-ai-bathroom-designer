import { KohlerProduct } from '@/types/product';

export const KOHLER_PRODUCTS: KohlerProduct[] = [
  // --- TOILETS ---
  {
    id: 't1',
    modelNumber: 'K-3999-0',
    name: 'Highline Comfort Height Two-Piece Elongated',
    category: 'toilet',
    subcategory: 'two-piece',
    priceINR: 18500,
    dimensions: { widthMM: 450, depthMM: 750, heightMM: 790 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Standard 12-inch rough-in.'
    },
    waterConsumption: { type: 'flush', valueLPF: 4.8, dualFlush: false },
    style: {
      themes: ['transitional', 'classic-luxury'],
      collection: 'Highline',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/highline.jpg',
    topViewSvg: '/icons/fixtures/toilet-elongated.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 't2',
    modelNumber: 'K-5401-0',
    name: 'Veil Intelligent Toilet',
    category: 'toilet',
    subcategory: 'intelligent',
    priceINR: 285000,
    dimensions: { widthMM: 435, depthMM: 670, heightMM: 533 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: true,
      electricalSpec: '220V, 50Hz dedicated circuit',
      plumbingType: 'standard',
      notes: 'Requires water supply and dedicated power outlet.'
    },
    waterConsumption: { type: 'flush', dualFlush: true, fullFlushLPF: 4.8, reducedFlushLPF: 3.0 },
    style: {
      themes: ['minimalist-modern', 'contemporary', 'japanese-zen'],
      collection: 'Veil',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: ['bidet', 'heated-seat', 'auto-flush', 'night-light', 'auto-open-close'],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/veil.jpg',
    topViewSvg: '/icons/fixtures/toilet-smart.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 't3',
    modelNumber: 'K-3814-0',
    name: 'Corbelle Skirted Two-Piece',
    category: 'toilet',
    subcategory: 'skirted',
    priceINR: 42000,
    dimensions: { widthMM: 419, depthMM: 724, heightMM: 797 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'ReadyLock installation system.'
    },
    waterConsumption: { type: 'flush', valueLPF: 4.8, dualFlush: false },
    style: {
      themes: ['transitional', 'contemporary'],
      collection: 'Corbelle',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/corbelle.jpg',
    topViewSvg: '/icons/fixtures/toilet-skirted.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 't4',
    modelNumber: 'K-6299-0',
    name: 'Veil Wall-Hung Toilet',
    category: 'toilet',
    subcategory: 'wall-hung',
    priceINR: 55000,
    dimensions: { widthMM: 390, depthMM: 540, heightMM: 345 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes: 'Requires in-wall tank and carrier system.'
    },
    waterConsumption: { type: 'flush', dualFlush: true, fullFlushLPF: 6.0, reducedFlushLPF: 3.0 },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'Veil',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/veil-wall.jpg',
    topViewSvg: '/icons/fixtures/toilet-wallhung.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },

  // --- FAUCETS ---
  {
    id: 'f1',
    modelNumber: 'K-14402-4A-CP',
    name: 'Purist Single-Handle',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 19500,
    dimensions: { widthMM: 50, depthMM: 140, heightMM: 200 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Single-hole installation.'
    },
    waterConsumption: { type: 'flow', valueLPM: 4.5 },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'Purist',
      finishes: ['polished-chrome', 'matte-black', 'brushed-gold'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/purist-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-single.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'f2',
    modelNumber: 'K-73050-7-TT',
    name: 'Composed Single-Handle',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 22000,
    dimensions: { widthMM: 45, depthMM: 152, heightMM: 254 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Tall vessel faucet.'
    },
    waterConsumption: { type: 'flow', valueLPM: 4.5 },
    style: {
      themes: ['minimalist-modern', 'industrial'],
      collection: 'Composed',
      finishes: ['polished-chrome', 'matte-black'],
      defaultFinish: 'matte-black'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/composed-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-single.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'f3',
    modelNumber: 'K-72762-9M-CP',
    name: 'Artifacts Widespread',
    category: 'faucet',
    subcategory: 'widespread',
    priceINR: 35000,
    dimensions: { widthMM: 200, depthMM: 140, heightMM: 150 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: '8-16 inch widespread installation.'
    },
    waterConsumption: { type: 'flow', valueLPM: 4.5 },
    style: {
      themes: ['classic-luxury', 'transitional'],
      collection: 'Artifacts',
      finishes: ['polished-chrome', 'brushed-nickel', 'oil-rubbed-bronze'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/artifacts-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-widespread.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'f4',
    modelNumber: 'K-97093-4-CP',
    name: 'Hint Single-Handle',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 8500,
    dimensions: { widthMM: 48, depthMM: 120, heightMM: 160 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Affordable modern design.'
    },
    waterConsumption: { type: 'flow', valueLPM: 4.5 },
    style: {
      themes: ['contemporary', 'transitional'],
      collection: 'Hint',
      finishes: ['polished-chrome', 'matte-black'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/hint-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-single.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },

  // --- SHOWERS ---
  {
    id: 's1',
    modelNumber: 'K-26290-CP',
    name: 'Statement Round Rainhead',
    category: 'shower',
    subcategory: 'rainhead',
    priceINR: 28000,
    dimensions: { widthMM: 254, depthMM: 254, heightMM: 60 },
    installation: {
      type: 'ceiling-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes: 'Requires shower arm and valve.'
    },
    waterConsumption: { type: 'flow', valueLPM: 9.5 },
    style: {
      themes: ['contemporary', 'minimalist-modern', 'transitional'],
      collection: 'Statement',
      finishes: ['polished-chrome', 'matte-black', 'brushed-gold'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/statement-shower.jpg',
    topViewSvg: '/icons/fixtures/shower-round.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 's2',
    modelNumber: 'K-72419-CP',
    name: 'Awaken B90 Showerhead',
    category: 'shower',
    subcategory: 'showerhead',
    priceINR: 6500,
    dimensions: { widthMM: 90, depthMM: 100, heightMM: 90 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Wall-mount shower arm required.'
    },
    waterConsumption: { type: 'flow', valueLPM: 7.6 },
    style: {
      themes: ['transitional', 'contemporary'],
      collection: 'Awaken',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/awaken-shower.jpg',
    topViewSvg: '/icons/fixtures/shower-round.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 's3',
    modelNumber: 'K-99693-P-NA',
    name: 'DTV+ Digital Interface',
    category: 'shower',
    subcategory: 'digital-valve',
    priceINR: 120000,
    dimensions: { widthMM: 130, depthMM: 20, heightMM: 200 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: true,
      electricalSpec: '220V dedicated',
      plumbingType: 'concealed',
      notes: 'Requires DTV+ system controller and digital valves.'
    },
    waterConsumption: null,
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'DTV+',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: ['digital-control', 'temperature-memory', 'app-integration'],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/dtv-plus.jpg',
    topViewSvg: '/icons/fixtures/shower-digital.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 's4',
    modelNumber: 'K-10257-A-CP',
    name: 'Shift Ellipse Handshower',
    category: 'shower',
    subcategory: 'handshower',
    priceINR: 12000,
    dimensions: { widthMM: 30, depthMM: 30, heightMM: 220 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Requires hose and wall bracket.'
    },
    waterConsumption: { type: 'flow', valueLPM: 7.6 },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'Shift',
      finishes: ['polished-chrome', 'matte-black'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/shift-handshower.jpg',
    topViewSvg: '/icons/fixtures/shower-hand.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },

  // --- VANITIES ---
  {
    id: 'v1',
    modelNumber: 'K-99543-1WA',
    name: 'Jute 36" Wall-Hung Vanity',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 65000,
    dimensions: { widthMM: 914, depthMM: 540, heightMM: 500 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Vanity only. Sink and faucet sold separately.'
    },
    waterConsumption: null,
    style: {
      themes: ['minimalist-modern', 'japanese-zen'],
      collection: 'Jute',
      finishes: ['wood-veneer', 'white'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/jute-vanity.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'v2',
    modelNumber: 'K-99522-1WA',
    name: 'Tailored 48" Freestanding Vanity',
    category: 'vanity',
    subcategory: 'freestanding',
    priceINR: 95000,
    dimensions: { widthMM: 1219, depthMM: 540, heightMM: 850 },
    installation: {
      type: 'floor-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Requires top and sink.'
    },
    waterConsumption: null,
    style: {
      themes: ['classic-luxury', 'transitional'],
      collection: 'Tailored',
      finishes: ['white', 'wood-veneer'],
      defaultFinish: 'white'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/tailored-vanity.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'v3',
    modelNumber: 'K-99506-1WA',
    name: 'Jacquard 30" Vanity',
    category: 'vanity',
    subcategory: 'freestanding',
    priceINR: 48000,
    dimensions: { widthMM: 762, depthMM: 540, heightMM: 850 },
    installation: {
      type: 'floor-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Traditional styling.'
    },
    waterConsumption: null,
    style: {
      themes: ['classic-luxury', 'transitional'],
      collection: 'Jacquard',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/jacquard-vanity.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'v4',
    modelNumber: 'K-81146-1WA',
    name: 'Maxstow 24" Wall-Hung Vanity',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 32000,
    dimensions: { widthMM: 610, depthMM: 540, heightMM: 500 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Compact for small bathrooms.'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'minimalist-modern', 'industrial'],
      collection: 'Maxstow',
      finishes: ['wood-veneer', 'matte-black'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl: 'https://www.kohler.co.in/',
    imageUrl: '/images/products/maxstow-vanity.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  }
];
