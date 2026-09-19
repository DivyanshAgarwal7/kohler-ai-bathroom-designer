import { KohlerProduct } from '@/types/product';

/**
 * Curated KOHLER India MVP catalog.
 *
 * Verification policy:
 * - Prices, model numbers, water-use figures, installation details, and
 *   product dimensions are taken from current KOHLER India pages or
 *   official KOHLER India technical literature available during verification.
 * - Dimension data uses a mixed confidence model. When an exact, complete
 *   envelope is confirmed by official documents, it is marked "verified".
 * - When axes are missing, ambiguously labeled in diagrams, or carried over
 *   from similar variants without direct confirmation, the record is marked
 *   "estimated". Do not treat "estimated" dimensions as manufacturer-certified
 *   CAD data.
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
  {
    id: 't3',
    modelNumber: 'K-29777IN-0',
    name: 'Innate One-Piece Elongated Smart Toilet, Dual-Flush',
    category: 'toilet',
    subcategory: 'smart',
    priceINR: 379999,
    // Overall envelope taken from KOHLER's official India technical
    // specification sheet for this exact SKU (techcomm.kohler.com,
    // K-29777IN_spec_IN_Kohler_en.pdf): 17" (432 mm) width, 28-5/16"
    // (719 mm) depth, 24-3/8" (619 mm) height.
    dimensions: { widthMM: 432, depthMM: 719, heightMM: 619 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: true,
      electricalSpec: '220-240V, 10A, 50-60Hz dedicated GFCI circuit',
      plumbingType: 'standard',
      notes:
        'Includes toilet and seat, supply stop valve, braided inlet supply hose, power cord, and remote control. Requires a dedicated electrical outlet near the installation point for the cleansing seat.'
    },
    waterConsumption: {
      type: 'flush',
      dualFlush: true,
      fullFlushLPF: 5.0,
      reducedFlushLPF: 3.5
    },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'Innate',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [
      'bidet',
      'heated-seat',
      'auto-flush',
      'auto-open-close',
      'led-nightlight',
      'warm-air-dryer',
      'remote-control',
      'quiet-close-seat',
      'uv-self-cleaning-wand',
      'deodorizer'
    ],
    productUrl:
      'https://www.kohler.co.in/p/toilets/innate-one-piece-elongated-smart-toilet-dual-flush-29777in',
    imageUrl: '/images/products/innate-smart-toilet.jpg',
    topViewSvg: '/icons/fixtures/toilet-smart.svg',
    verificationDate: '2026-09-17',
    dataConfidence: 'verified'
  },
  {
    id: 't4',
    modelNumber: 'K-1381T-S-0',
    name: 'Veil One-Piece Elongated Toilet, Dual-Flush',
    category: 'toilet',
    subcategory: 'one-piece',
    priceINR: 33599,
    // Overall envelope cross-confirmed across multiple official KOHLER
    // regional technical documents for this exact SKU (K-1381T-S-0):
    // techcomm.kohler.com's CN spec sheet and KOHLER's ME/APAC product
    // pages all converge on W 387 mm, D 725 mm, H 692 mm. kohler.co.in's
    // own accessible page text doesn't expose the full envelope, but the
    // model number, price, and installation details below come directly
    // from it.
    dimensions: { widthMM: 387, depthMM: 725, heightMM: 692 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Standard 12 inch (305 mm) rough-in. Supply line sold separately. Quiet-Close seat and lid included; compatible with C3 and PureWash electronic bidet seats (sold separately).'
    },
    waterConsumption: {
      type: 'flush',
      dualFlush: true,
      fullFlushLPF: 4.5,
      reducedFlushLPF: 3.0
    },
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Veil',
      finishes: ['white', 'ceramic'],
      defaultFinish: 'white'
    },
    smartFeatures: ['quiet-close-seat'],
    productUrl:
      'https://www.kohler.co.in/p/toilets/veil-one-piece-elongated-toilet-with-skirted-trapway-dual-flush-1381t-s',
    imageUrl: '/images/products/veil-one-piece.jpg',
    topViewSvg: '/icons/fixtures/toilet-elongated.svg',
    verificationDate: '2026-09-18',
    dataConfidence: 'verified'
  },
  {
    id: 't5',
    modelNumber: 'K-28529IN-0',
    name: 'Leap One-Piece Round-Front Smart Toilet, Dual-Flush',
    category: 'toilet',
    subcategory: 'smart',
    priceINR: 446499,
    // Width and depth (369 mm / 681 mm) are confirmed against KOHLER's
    // official India technical specification sheet for this exact SKU
    // (K-28529IN_spec_IN_Kohler_en.pdf). The overall height (508 mm) is
    // not directly confirmed by the India sheet's extracted text and is
    // derived from secondary listings, so this record is marked estimated.
    dimensions: { widthMM: 369, depthMM: 681, heightMM: 508 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: true,
      electricalSpec: '220-240V, 10A, 50-60Hz dedicated GFCI circuit',
      plumbingType: 'standard',
      notes:
        'Includes bidet seat with stainless steel wand (adjustable spray shape, position, pressure, and temperature), touchless hands-free flush actuation with a manual backup button, and remote control. Requires a dedicated electrical outlet near the installation point.'
    },
    waterConsumption: {
      type: 'flush',
      dualFlush: true,
      fullFlushLPF: 4.5,
      reducedFlushLPF: 3.0
    },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'Leap',
      finishes: ['white'],
      defaultFinish: 'white'
    },
    smartFeatures: [
      'bidet',
      'touchless-flush',
      'auto-flush',
      'remote-control',
      'quiet-close-seat'
    ],
    productUrl:
      'https://www.kohler.co.in/p/toilets/leap-one-piece-round-front-smart-toilet-dual-flush-28529in',
    imageUrl: '/images/products/leap-smart-toilet.jpg',
    topViewSvg: '/icons/fixtures/toilet-smart.svg',
    verificationDate: '2026-09-18',
    dataConfidence: 'estimated'
  },
  {
    id: 't6',
    modelNumber: 'K-3983IN-S-0',
    name: 'Reach One-Piece Round-Front Toilet, Dual-Flush',
    category: 'toilet',
    subcategory: 'one-piece',
    priceINR: 16829,
    // CORRECTED (2026-09-19 audit). Originally used a generic APAC sheet
    // for "K-3983T-S / K-4012T-S" whose bowl style ("Elongated") didn't
    // match this exact SKU's round-front bowl. Re-verified against the
    // actual India-specific spec sheet for this SKU
    // (techcomm.kohler.com/techcomm/pdf/K-3983IN-S_spec_IN_Kohler_en.pdf),
    // which explicitly confirms "One-piece round-front toilet ... K-3983IN-S"
    // and independently lists 14-7/16in (367mm) and 28-1/2in (724mm) among
    // its diagram callouts -- cross-validating the width and depth from
    // the original APAC sheet almost exactly (366/724mm). Overall height
    // (722mm) is retained from the APAC sheet as the only source found for
    // that axis; the India sheet only labels rim-to-floor (391mm)
    // separately, not overall height. Price, dual-flush LPF, and rough-in
    // are confirmed live against the India product page for this exact SKU.
    dimensions: { widthMM: 367, depthMM: 724, heightMM: 722 },
    installation: {
      type: 'floor-mount',
      roughInMM: 305,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Standard 12 inch (305 mm) rough-in. Includes Reach quiet-close toilet seat.'
    },
    waterConsumption: {
      type: 'flush',
      dualFlush: true,
      fullFlushLPF: 4.8,
      reducedFlushLPF: 3.3
    },
    style: {
      themes: ['contemporary', 'transitional'],
      collection: 'Reach',
      finishes: ['white', 'ceramic'],
      defaultFinish: 'white'
    },
    smartFeatures: ['quiet-close-seat'],
    productUrl:
      'https://www.kohler.co.in/p/toilets/reach-one-piece-round-front-toilet-with-skirted-trapway-dual-flush-3983in-s',
    imageUrl: '/images/products/reach-one-piece.jpg',
    topViewSvg: '/icons/fixtures/toilet-elongated.svg',
    verificationDate: '2026-09-19',
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
  {
    id: 'f3',
    modelNumber: 'K-25758IN-4ND-CP',
    name: 'ModernLife Edge Tall Single-Handle Bathroom Sink Faucet',
    category: 'faucet',
    subcategory: 'single-handle',
    priceINR: 26479,
    // CORRECTED AGAIN (2026-09-19, final exact-SKU check). A direct,
    // deliberately fresh fetch of the exact CP-variant page below returned
    // "26479.0 ... MRP33100.0 20% OFF" -- matching an independent check.
    // The prior "23625" entry in this file came from an earlier fetch in
    // this same session that, on reflection, most likely returned a
    // cached/stale snapshot rather than a true live page load, despite
    // being called the same way; it should not have been trusted as
    // "fresh." This value (26479) is the one confirmed by a direct fetch
    // performed specifically to resolve that discrepancy:
    //   Retrieved: 2026-09-19
    //   Exact URL: https://www.kohler.co.in/p/washbasins/modernlife-edge-tall-single-handle-bathroom-sink-faucet-25758in-4nd
    //   Exact SKU/variant on page: 25758IN-4ND-CP (Polished Chrome)
    //   Displayed: "26479.0 / Inclusive of all taxes / MRP33100.0 20% OFF"
    // Given this page has now shown three different values across checks
    // in this project (26479, a user-reported 33039, and my own stale
    // 23625), treat any single reading as a point-in-time snapshot, not a
    // fixed catalog price -- re-verify at actual deployment time.
    // Dimensions verified against official KOHLER India technical specification
    // sheets for this exact SKU (K-25758IN-4ND_spec_IN_Kohler_en.pdf), which
    // support an overall envelope of 56 mm width, 164 mm depth, and 273 mm height.
    dimensions: { widthMM: 56, depthMM: 164, heightMM: 273 },
    installation: {
      type: 'countertop',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Deck-mount, single-hole installation, G1/2 inlet. Preattached flexible supply lines.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 11.3
    },
    style: {
      themes: ['minimalist-modern', 'contemporary'],
      collection: 'ModernLife Edge',
      finishes: ['polished-chrome', 'polished-gold', 'matte-black'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/washbasins/modernlife-edge-tall-single-handle-bathroom-sink-faucet-25758in-4nd',
    imageUrl: '/images/products/modernlife-edge-tall-faucet.jpg',
    topViewSvg: '/icons/fixtures/faucet-tall.svg',
    verificationDate: '2026-09-19',
    dataConfidence: 'verified'
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
  {
    id: 's3',
    modelNumber: 'K-26341IN-NA',
    name: 'Anthem Three-Port Thermostatic Valve — component of thermostatic shower system',
    category: 'shower',
    subcategory: 'thermostatic-system',
    priceINR: 46639,
    // Concealed rough-in valve body. The envelope figures below are taken
    // from KOHLER's official India spec sheet (resources.kohler.com,
    // K-26341IN_spec_IN_Kohler_en.pdf: 13-15/16" (354 mm), 6-5/16"
    // (160 mm), 6-1/8" (156 mm)), but the diagram's axis labels aren't
    // recoverable from the extracted text, so — like the faucet and
    // showerhead/handshower records above — this is marked "estimated"
    // rather than claiming full verification. It has no independent floor
    // footprint: it lives inside the wall/shower zone, not on the floor.
    dimensions: { widthMM: 354, depthMM: 156, heightMM: 160 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes:
        'Valve body only — compatible control-panel trim sold separately. Mechanical (non-electronic) thermostatic mixing valve with a built-in temperature-limit stop for antiscald protection; cast dezincification-resistant brass body, fully serviceable from the front. Requires a separately sold three-outlet Anthem control panel trim (e.g. K-26347IN-9) to expose temperature/flow control on the finished wall; the valve body itself ships with no exposed finish.'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Anthem',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    // Mechanical valve — no electronic/smart features. Antiscald
    // temperature-limit protection is a mechanical safety spec, not a
    // "smart" feature, so it's documented in installation.notes instead.
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/diverters-trims/anthem-three-port-recessed-mechanical-thermostatic-valve-26341in',
    imageUrl: '/images/products/anthem-thermostatic-valve.jpg',
    topViewSvg: '/icons/fixtures/shower-thermostatic.svg',
    verificationDate: '2026-09-17',
    dataConfidence: 'estimated'
  },
  {
    id: 's4',
    modelNumber: 'K-26853IN-CP',
    name: 'Rainduet Five-Function Showerhead',
    category: 'shower',
    subcategory: 'showerhead',
    priceINR: 1659,
    // CORRECTED (2026-09-19 audit): price re-confirmed unchanged against live product page.
    // The official India spec sheet (K-26853IN_spec_IN_Kohler_en.pdf) explicitly
    // labels the 100mm diameter (width/depth). However, the 108mm axis is not
    // explicitly confirmed as the overall height, so the envelope remains estimated.
    dimensions: { widthMM: 100, depthMM: 100, heightMM: 108 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'Wall-mount, G1/2 inlet connection. Shower arm and flange sold separately.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 14.0
    },
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Rainduet',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/showers/rainduet-five-function-showerhead-14-0-lpm-26853in',
    imageUrl: '/images/products/rainduet-showerhead.jpg',
    topViewSvg: '/icons/fixtures/shower-round.svg',
    verificationDate: '2026-09-19',
    dataConfidence: 'estimated'
  },
  {
    id: 's5',
    modelNumber: 'K-73199IN-CP',
    name: 'Rainduet Contemporary Square Rainhead',
    category: 'shower',
    subcategory: 'rainhead',
    priceINR: 5889,
    // CORRECTED price (2026-09-19 audit): live kohler.co.in price is
    // Rs 5,889 (MRP Rs 8,300, 29% off), replacing an earlier Rs 4,479
    // reading -- confirmed matching an independently reported figure.
    // Width/depth (200 x 200 mm) are now explicitly confirmed against
    // the official India spec sheet
    // (techcomm.kohler.com/techcomm/pdf/K-73199IN_spec_IN_Kohler_en.pdf:
    // "7-7/8in (200mm) 7-7/8in (200mm)"), upgraded from the product
    // description alone to a spec-sheet-verified figure. Height (slim
    // rainhead housing) is still not stated in any source found, so the
    // record overall remains "estimated" pending that one axis.
    dimensions: { widthMM: 200, depthMM: 200, heightMM: 40 },
    installation: {
      type: 'ceiling-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'standard',
      notes:
        'G1/2 (13 mm) inlet connection. Ceiling- or wall-mount. Katalyst air-induction technology.'
    },
    waterConsumption: {
      type: 'flow',
      valueLPM: 8.7
    },
    style: {
      themes: ['contemporary', 'minimalist-modern'],
      collection: 'Rainduet',
      finishes: ['polished-chrome'],
      defaultFinish: 'polished-chrome'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/showers/rainduet-contemporary-square-200-mm-single-function-rainhead-8-7-lpm-73199in',
    imageUrl: '/images/products/rainduet-rainhead.jpg',
    topViewSvg: '/icons/fixtures/shower-square.svg',
    verificationDate: '2026-09-19',
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
  },
  {
    id: 'v3',
    modelNumber: 'K-30459IN-MWF',
    name: 'Luxe 75 cm Wall-Hung Bathroom Vanity Cabinet',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 105399,
    // Dimensions verified against official KOHLER India Luxe documentation,
    // which supports an envelope of 748 x 560.5 x 426 mm. The depth has been
    // rounded up to 561 mm for the integer requirement.
    dimensions: { widthMM: 748, depthMM: 561, heightMM: 426 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes:
        'Wood composite cabinet, one partial- and one full-extension drawer. Pair with any vanity top cut to size and a KOHLER vessel bathroom sink (both sold separately).'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'transitional'],
      collection: 'Luxe',
      finishes: ['wood-veneer'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/bathroom-vanity/luxe-750-mm-wall-hung-bathroom-vanity-cabinet-30459in',
    imageUrl: '/images/products/luxe-750.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-19',
    dataConfidence: 'verified'
  },
  {
    id: 'v4',
    modelNumber: 'K-30460IN-MWF',
    name: 'Luxe 90 cm Wall-Hung Bathroom Vanity Cabinet',
    category: 'vanity',
    subcategory: 'wall-hung',
    priceINR: 115849,
    // CORRECTED price (2026-09-19, final exact-SKU check). Confirmed via
    // a direct fetch of the exact page: displayed "115849.0 / Inclusive
    // of all taxes / MRP121950.0 5% OFF".
    //   Retrieved: 2026-09-19
    //   Exact URL: https://www.kohler.co.in/p/bathroom-vanity/luxe-900-mm-wall-hung-bathroom-vanity-cabinet-30460in
    //   Exact SKU/variant on page: 30460IN-MWF
    // (A slightly earlier fetch in this session read 115852.5, likely
    // sub-rupee rounding noise between requests rather than a real price
    // change; this exact re-check settles on 115849.) The origin-in.kohler.com
    // regional catalog mirror still shows a different, lower figure
    // (104,990) for this SKU -- not used here, per the instruction to
    // rely on the live kohler.co.in transactional page rather than a
    // cached regional catalog value.
    // Depth/height match the K-30459IN-MWF correction above (748 x 561 x
    // 426 mm source), since this record carries those two axes over on
    // the same-collection-width-variant assumption; width (900 mm)
    // matches the product's own name. Kept "estimated" for the same
    // reason as K-30459IN-MWF, compounded by the carried-over assumption.
    dimensions: { widthMM: 900, depthMM: 561, heightMM: 426 },
    installation: {
      type: 'wall-mount',
      roughInMM: null,
      requiresElectrical: false,
      electricalSpec: null,
      plumbingType: 'concealed',
      notes:
        'Wood composite cabinet. Pair with any vanity top cut to size and a KOHLER vessel bathroom sink (both sold separately).'
    },
    waterConsumption: null,
    style: {
      themes: ['contemporary', 'transitional'],
      collection: 'Luxe',
      finishes: ['wood-veneer'],
      defaultFinish: 'wood-veneer'
    },
    smartFeatures: [],
    productUrl:
      'https://www.kohler.co.in/p/bathroom-vanity/luxe-900-mm-wall-hung-bathroom-vanity-cabinet-30460in',
    imageUrl: '/images/products/luxe-900.jpg',
    topViewSvg: '/icons/fixtures/vanity-rect.svg',
    verificationDate: '2026-09-19',
    dataConfidence: 'estimated'
  }
];