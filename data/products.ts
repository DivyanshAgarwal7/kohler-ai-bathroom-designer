import { KohlerProduct } from '@/types/product';

/**
 * Curated KOHLER India MVP catalog.
 *
 * Verification policy:
 * - Prices, model numbers, water-use figures, installation details and
 *   vanity/toilet dimensions are taken from current KOHLER India pages or
 *   official KOHLER India literature available during verification.
 * - Faucet/shower overall envelope dimensions are not published in the
 *   accessible product text, so those four records are intentionally marked
 *   "estimated" rather than claiming full verification.
 * - Do not treat an "estimated" dimension as manufacturer-certified CAD data.
 */

export const KOHLER_PRODUCTS: KohlerProduct[] = [
  // ---------------------------------------------------------------------------
  // TOILETS
  // ---------------------------------------------------------------------------
  {
    id: 't1',
    modelNumber: 'K-8688T-S-0',
    name: 'San Raphael Grande One-Piece Elongated Toilet',
    category: 'toilet',
    subcategory: 'one-piece',
    priceINR: 50399,
    dimensions: { widthMM: 521, depthMM: 736, heightMM: 624 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes: 'Standard 12-inch (305 mm) rough-in. Quiet-Close seat included.'
    },
    waterConsumption: {
      type: 'flush',
      valueLPF: 4.8,
      dualFlush: false
    },
    style: {
      themes: ['minimalist-modern', 'transitional'],
      collection: 'San Raphael Grande',
      finishes: ['white', 'ceramic'],
      defaultFinish: 'white'
    },
    smartFeatures: ['quiet-close-seat'],
    productUrl:
      'https://www.kohler.co.in/p/toilets/san-raphael-grande-one-piece-elongated-toilet-with-skirted-trapway-4-8-lpf-8688t-s',
    imageUrl: '/images/products/san-raphael-grande.jpg',
    topViewSvg: '/icons/fixtures/toilet-elongated.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'verified'
  },
  {
    id: 't2',
    modelNumber: 'K-17661K-S-0',
    name: 'Odeon Wall-Hung Toilet with Exposed Tank',
    category: 'toilet',
    subcategory: 'wall-hung',
    priceINR: 23459,
    dimensions: { widthMM: 690, depthMM: 400, heightMM: 754 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'exposed',
      notes: 'KOHLER India lists 69 x 40 x 75.4 cm and P-trap 22 cm.'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Odeon',
      finishes: ['white', 'ceramic'],
      defaultFinish: 'white'
    },
    smartFeatures: ['quiet-close-seat'],
    productUrl:
      'https://www.kohler.co.in/p/toilets/odeon-wall-hung-toilet-with-exposed-tank-with-quiet-close-seat-and-cover-17661k-s',
    imageUrl: '/images/products/odeon.jpg',
    topViewSvg: '/icons/fixtures/toilet-wallhung.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'verified'
  },

  // ---------------------------------------------------------------------------
  // FAUCETS
  // ---------------------------------------------------------------------------
  {
    id: 'f1',
    modelNumber: 'K-38467IN-4ND-CP',
    name: 'Engage Single-Handle Bathroom Sink Faucet',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 7209,
    // Overall envelope is not exposed in the accessible KOHLER India page text.
    // Use only as a visualization envelope, not manufacturer-certified CAD data.
    dimensions: { widthMM: 50, depthMM: 121, heightMM: 97 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Deck-mount, single-hole installation, G 1/2 connection. Published spout reach 12.1 cm and spout height 97 mm.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 5.6
    },
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Engage',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/washbasins/engage-single-handle-bathroom-sink-faucet-5-6-lpm-38467in-4nd',
    imageUrl: '/images/products/engage-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-single.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 'f2',
    modelNumber: 'K-38886IN-4ND-CP',
    name: 'Fluence Single-Handle Bathroom Sink Faucet',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 9669,
    dimensions: { widthMM: 50, depthMM: 110, heightMM: 96 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Single-hole deck-mount installation. Published spout reach 11 cm and spout height 96 mm.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 10.9
    },
    style: {
      themes: ['contemporary', 'transitional'],
      collection: 'Fluence',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/washbasins/fluence-single-handle-bathroom-sink-faucet-10-9-lpm-38886in-4nd',
    imageUrl: '/images/products/fluence-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-single.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },

  // ---------------------------------------------------------------------------
  // SHOWERS
  // ---------------------------------------------------------------------------
  {
    id: 's1',
    modelNumber: 'K-72439IN-EC-CP',
    name: 'Complementary Single-Function Showerhead',
    category: 'shower',
    subcategory: 'showerhead',
    priceINR: 999,
    dimensions: { widthMM: 97, depthMM: 97, heightMM: 60 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'KOHLER India describes a 97 mm round showerhead and wall-mount installation.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 7.6
    },
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Complementary',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/showers/complementary-single-function-showerhead-7-6-lpm-72439in-ec',
    imageUrl: '/images/products/complementary-shower.jpg',
    topViewSvg: '/icons/fixtures/shower-round.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },
  {
    id: 's2',
    modelNumber: 'K-26286IN-G-AF',
    name: 'Statement Iconic Single-Function Handshower',
    category: 'shower',
    subcategory: 'handshower',
    priceINR: 5779,
    dimensions: { widthMM: 100, depthMM: 100, heightMM: 200 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Bracket or slidebar required for wall-mount installation; deck-mount holder required for deck installation.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 6.6
    },
    style: {
      themes: ['minimalist-modern', 'classic-luxury'],
      collection: 'Statement',
      finishes: ['brushed-gold', 'polished-chrome'],
      defaultFinish: 'brushed-gold'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/showers/statement-iconic-single-function-handshower-6-6-lpm-26286in-g',
    imageUrl: '/images/products/statement-handshower.jpg',
    topViewSvg: '/icons/fixtures/shower-hand.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'estimated'
  },

  // ---------------------------------------------------------------------------
  // VANITIES
  // ---------------------------------------------------------------------------
  {
    id: 'v1',
    modelNumber: 'K-31602IN-E64',
    name: 'Forefront 60 cm Wall-Hung Bathroom Vanity Cabinet',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 65069,
    dimensions: { widthMM: 599, depthMM: 460, heightMM: 550 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes: 'Walnut finish. Sink top and faucet are sold separately.'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'minimalist-modern', 'japanese-zen'],
      collection: 'Forefront',
      finishes: ['wood-veneer'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/bathroom-vanity/forefront-600-mm-wall-hung-bathroom-vanity-cabinet-31602in',
    imageUrl: '/images/products/forefront-600.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'verified'
  },
  {
    id: 'v2',
    modelNumber: 'K-31601IN-E64',
    name: 'Forefront 90 cm Wall-Hung Bathroom Vanity Cabinet',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 102739,
    dimensions: { widthMM: 892, depthMM: 517, heightMM: 550 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes: 'Walnut finish. Sink top and faucet are sold separately.'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'minimalist-modern', 'japanese-zen'],
      collection: 'Forefront',
      finishes: ['wood-veneer'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/bathroom-vanity/forefront-900-mm-wall-hung-bathroom-vanity-cabinet-31601in',
    imageUrl: '/images/products/forefront-900.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-15',
    dataConfidence: 'verified'
  }
];
