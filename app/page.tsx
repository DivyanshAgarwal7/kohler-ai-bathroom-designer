'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

import BathroomLayout from '@/components/bathroom-layout';
import { generateTemplateExplanation } from '@/lib/ai/fallback';

import type {
  KohlerProduct,
  StyleTheme,
} from '@/types/product';

type LayoutData = {
  room: {
    widthMM: number;
    lengthMM: number;
  };
  zones: {
    id: string;
    category: KohlerProduct['category'];
    x: number;
    y: number;
    widthMM: number;
    depthMM: number;
  }[];
  placements: {
    productId: string;
    x: number;
    y: number;
    rotation: number;
    zone: string;
  }[];
};

type Bundle = {
  id: string;
  products: KohlerProduct[];
  totalPriceINR: number;
  scores: {
    styleMatch: number;
    sustainability: number;
    value: number;
    spaceFit: number;
    coherence: number;
    total: number;
  };
};

type WaterUsage = {
  bundleAnnualLiters: number;
  baselineAnnualLiters: number;
  estimatedAnnualSavingsLiters: number;
};

type RecommendationResponse = {
  success: boolean;
  bundles: Bundle[];
  waterUsage: WaterUsage;
  layout: LayoutData | null;
  catalogSize: number;
  error?: string;
};

type ImageAnalysis = {
  roomShape: string | null;
  detectedFixtures: string[];
  layoutCues: string[];
  styleCues: string[];
  doorOrWindowCues: string[];
  widthFt: number | null;
  lengthFt: number | null;
  dimensionsSource: 'visible-measurement' | 'not-visible';
  confidence: number;
  warnings: string[];
};

const CATEGORY_LABELS: Record<
  KohlerProduct['category'],
  string
> = {
  toilet: 'Toilet',
  faucet: 'Faucet',
  shower: 'Shower',
  vanity: 'Vanity',
};

const STYLE_OPTIONS: {
  value: StyleTheme;
  label: string;
}[] = [
  {
    value: 'contemporary',
    label: 'Contemporary',
  },
  {
    value: 'minimalist-modern',
    label: 'Minimalist Modern',
  },
  {
    value: 'classic-luxury',
    label: 'Classic Luxury',
  },
  {
    value: 'japanese-zen',
    label: 'Japanese Zen',
  },
  {
    value: 'transitional',
    label: 'Transitional',
  },
  {
    value: 'industrial',
    label: 'Industrial',
  },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatLiters = (value: number) =>
  new Intl.NumberFormat('en-IN').format(value);

function inferStyleFromImage(
  styleCues: string[]
): StyleTheme | null {
  const styleText = styleCues.join(' ').toLowerCase();

  if (
    styleText.includes('minimal') ||
    styleText.includes('minimalist')
  ) {
    return 'minimalist-modern';
  }

  if (
    styleText.includes('contemporary') ||
    styleText.includes('modern')
  ) {
    return 'contemporary';
  }

  if (styleText.includes('industrial')) {
    return 'industrial';
  }

  if (
    styleText.includes('zen') ||
    styleText.includes('japanese')
  ) {
    return 'japanese-zen';
  }

  if (
    styleText.includes('luxury') ||
    styleText.includes('classic')
  ) {
    return 'classic-luxury';
  }

  if (styleText.includes('transitional')) {
    return 'transitional';
  }

  return null;
}

export default function Home() {
  const [widthFt, setWidthFt] = useState('8');
  const [lengthFt, setLengthFt] = useState('10');
  const [budgetINR, setBudgetINR] = useState('200000');
  const [theme, setTheme] =
    useState<StyleTheme>('contemporary');
  const [householdSize, setHouseholdSize] = useState('4');

  const [result, setResult] =
    useState<RecommendationResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageAnalysis, setImageAnalysis] =
    useState<ImageAnalysis | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function handleAIInterpret() {
    if (!aiText.trim()) {
      setAiError(
        'Please describe your bathroom requirements first.'
      );
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: aiText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            'Unable to understand your requirements.'
        );
      }

      const requirements = data.requirements;

      if (requirements.widthFt !== null) {
        setWidthFt(String(requirements.widthFt));
      }

      if (requirements.lengthFt !== null) {
        setLengthFt(String(requirements.lengthFt));
      }

      if (requirements.budgetINR !== null) {
        setBudgetINR(String(requirements.budgetINR));
      }

      if (requirements.householdSize !== null) {
        setHouseholdSize(
          String(requirements.householdSize)
        );
      }

      if (requirements.selectedThemes.length > 0) {
        setTheme(
          requirements.selectedThemes[0] as StyleTheme
        );
      }
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'Unable to interpret the request.'
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function handleImageAnalysis() {
    if (!imageFile) {
      setImageError(
        'Please choose a bathroom image first.'
      );
      return;
    }

    setImageLoading(true);
    setImageError('');
    setImageAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      if (aiText.trim()) {
        formData.append('context', aiText);
      }

      const response = await fetch(
        '/api/analyze-image',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            'Unable to analyze the bathroom image.'
        );
      }

      const analysis =
        data.analysis as ImageAnalysis;

      setImageAnalysis(analysis);

      /*
       * Image-derived style is only used as a suggestion.
       * The user can manually change it afterward.
       */
      const inferredStyle = inferStyleFromImage(
        analysis.styleCues
      );

      if (inferredStyle) {
        setTheme(inferredStyle);
      }

      /*
       * Dimensions are only accepted when the image
       * contains explicit visible measurements.
       */
      if (
        analysis.dimensionsSource ===
        'visible-measurement'
      ) {
        if (analysis.widthFt !== null) {
          setWidthFt(String(analysis.widthFt));
        }

        if (analysis.lengthFt !== null) {
          setLengthFt(String(analysis.lengthFt));
        }
      }
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : 'Unable to analyze the bathroom image.'
      );
    } finally {
      setImageLoading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setResult(null);

    const width = Number(widthFt);
    const length = Number(lengthFt);
    const budget = Number(budgetINR);
    const household = Number(householdSize);

    if (
      !Number.isFinite(width) ||
      width < 3 ||
      width > 50
    ) {
      setError(
        'Bathroom width must be between 3 and 50 feet.'
      );
      return;
    }

    if (
      !Number.isFinite(length) ||
      length < 3 ||
      length > 50
    ) {
      setError(
        'Bathroom length must be between 3 and 50 feet.'
      );
      return;
    }

    if (
      !Number.isFinite(budget) ||
      budget < 50000 ||
      budget > 1000000
    ) {
      setError(
        'Budget must be between ₹50,000 and ₹10,00,000.'
      );
      return;
    }

    if (
      !Number.isFinite(household) ||
      household < 1 ||
      household > 20
    ) {
      setError(
        'Household size must be between 1 and 20 people.'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        '/api/recommend',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dimensions: {
              widthFt: width,
              lengthFt: length,
            },
            budgetINR: budget,
            selectedThemes: [theme],
            requiredCategories: [
              'toilet',
              'faucet',
              'shower',
              'vanity',
            ],
            householdSize: household,
          }),
        }
      );

      const data =
        (await response.json()) as RecommendationResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            'Unable to generate recommendations.'
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating recommendations.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            KOHLER AI Bathroom Designer
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Design a bathroom that fits your space,
              budget, and style.
            </h1>

            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Enter your requirements and our optimization
              engine will evaluate feasible KOHLER product
              combinations instead of simply guessing a
              recommendation.
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Requirement form */}
          <section className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Your requirements
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                These values are sent to the
                deterministic recommendation engine.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* AI description */}
              <div className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-3">
                  <div className="text-sm font-semibold">
                    Describe your bathroom
                  </div>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Tell the AI about your space, budget,
                    style, and household.
                  </p>
                </div>

                <textarea
                  value={aiText}
                  onChange={(event) =>
                    setAiText(event.target.value)
                  }
                  placeholder="Example: I have a 7 by 9 foot bathroom for 4 people. I want a modern and water-saving design with a budget of 1.5 lakh rupees."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-950"
                />

                <button
                  type="button"
                  onClick={handleAIInterpret}
                  disabled={aiLoading}
                  className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiLoading
                    ? 'Understanding...'
                    : 'Understand with AI'}
                </button>

                {aiError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {aiError}
                  </div>
                )}

                {/* Image analysis */}
                <div className="mt-5 border-t border-neutral-200 pt-5">
                  <div className="mb-3">
                    <div className="text-sm font-semibold">
                      Optional bathroom image
                    </div>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Upload a bathroom photo or floor
                      plan. Dimensions are only extracted
                      when explicitly visible in the image.
                    </p>
                  </div>

                  <input
                    id="bathroom-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0] ?? null;

                      setImageFile(file);
                      setImageError('');
                      setImageAnalysis(null);

                      if (file) {
                        setImagePreview(
                          URL.createObjectURL(file)
                        );
                      } else {
                        setImagePreview('');
                      }
                    }}
                    className="block w-full text-sm"
                  />

                  {imagePreview && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                      <Image
                        src={imagePreview}
                        alt="Bathroom preview"
                        width={600}
                        height={400}
                        unoptimized
                        className="max-h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleImageAnalysis}
                    disabled={
                      !imageFile || imageLoading
                    }
                    className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {imageLoading
                      ? 'Analyzing image...'
                      : 'Analyze image'}
                  </button>

                  {imageError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                      {imageError}
                    </div>
                  )}

                  {imageAnalysis && (
                    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Image analysis
                      </div>

                      {imageAnalysis.roomShape && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">
                            Room shape:
                          </span>{' '}
                          {imageAnalysis.roomShape}
                        </div>
                      )}

                      {imageAnalysis.detectedFixtures
                        .length > 0 && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">
                            Detected fixtures:
                          </span>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {imageAnalysis.detectedFixtures.map(
                              (fixture) => (
                                <span
                                  key={fixture}
                                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                                >
                                  {fixture}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {imageAnalysis.styleCues.length >
                        0 && (
                        <div className="mt-3 text-sm">
                          <span className="font-medium">
                            Style cues:
                          </span>{' '}
                          {imageAnalysis.styleCues.join(
                            ', '
                          )}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-neutral-500">
                        Confidence:{' '}
                        {Math.round(
                          imageAnalysis.confidence * 100
                        )}
                        %
                      </div>

                      <p className="mt-3 text-xs text-neutral-500">
                        Visual cues can be used to
                        prefill your style preference.
                        You can always change it manually
                        before generating the bathroom.
                      </p>

                      {imageAnalysis.warnings.length >
                        0 && (
                        <div className="mt-3 rounded-xl bg-neutral-100 p-3 text-xs leading-5 text-neutral-600">
                          {imageAnalysis.warnings.join(' ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Width */}
              <div>
                <label
                  htmlFor="width"
                  className="mb-2 block text-sm font-medium"
                >
                  Bathroom width (ft)
                </label>

                <input
                  id="width"
                  type="number"
                  min="3"
                  max="50"
                  step="0.5"
                  value={widthFt}
                  onChange={(event) =>
                    setWidthFt(event.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-neutral-950"
                />
              </div>

              {/* Length */}
              <div>
                <label
                  htmlFor="length"
                  className="mb-2 block text-sm font-medium"
                >
                  Bathroom length (ft)
                </label>

                <input
                  id="length"
                  type="number"
                  min="3"
                  max="50"
                  step="0.5"
                  value={lengthFt}
                  onChange={(event) =>
                    setLengthFt(event.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-neutral-950"
                />
              </div>

              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-medium"
                >
                  Budget (₹)
                </label>

                <input
                  id="budget"
                  type="number"
                  min="50000"
                  max="1000000"
                  step="5000"
                  value={budgetINR}
                  onChange={(event) =>
                    setBudgetINR(event.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-neutral-950"
                />
              </div>

              {/* Theme */}
              <div>
                <label
                  htmlFor="theme"
                  className="mb-2 block text-sm font-medium"
                >
                  Preferred style
                </label>

                <select
                  id="theme"
                  value={theme}
                  onChange={(event) =>
                    setTheme(
                      event.target.value as StyleTheme
                    )
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-neutral-950"
                >
                  {STYLE_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Household */}
              <div>
                <label
                  htmlFor="household"
                  className="mb-2 block text-sm font-medium"
                >
                  Household size
                </label>

                <input
                  id="household"
                  type="number"
                  min="1"
                  max="20"
                  value={householdSize}
                  onChange={(event) =>
                    setHouseholdSize(event.target.value)
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 outline-none transition focus:border-neutral-950"
                />
              </div>

              {/* Categories */}
              <div className="rounded-2xl bg-neutral-100 p-4">
                <div className="text-sm font-medium">
                  Included fixtures
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-neutral-600">
                  <div>✓ Toilet</div>
                  <div>✓ Faucet</div>
                  <div>✓ Shower</div>
                  <div>✓ Vanity</div>
                </div>
              </div>

              {/* Generate */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-neutral-950 px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Optimizing bathroom...'
                  : 'Generate my bathroom'}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          {/* Results */}
          <section>
            {!result && !loading && (
              <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center">
                <div className="max-w-md">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-2xl">
                    ✦
                  </div>

                  <h2 className="text-2xl font-semibold">
                    Your optimized bathroom will appear
                    here
                  </h2>

                  <p className="mt-3 leading-7 text-neutral-500">
                    The engine will filter infeasible
                    products, enforce your budget, evaluate
                    style and sustainability, and rank the
                    remaining combinations.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-neutral-200 bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-950" />

                  <h2 className="text-xl font-semibold">
                    Optimizing your bathroom
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    Checking product combinations against
                    your constraints...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                {/* No feasible result */}
                {result.bundles.length === 0 ? (
                  <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <div className="max-w-lg">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                        !
                      </div>

                      <h2 className="text-2xl font-semibold">
                        No feasible bathroom configuration
                        found
                      </h2>

                      <p className="mt-3 leading-7 text-neutral-600">
                        The current requirements do not
                        produce a bundle that satisfies the
                        available space and budget
                        constraints.
                      </p>

                      <div className="mt-5 rounded-2xl bg-white p-4 text-left text-sm text-neutral-600">
                        <div className="font-medium text-neutral-950">
                          Try adjusting:
                        </div>

                        <div className="mt-2 space-y-1">
                          <div>
                            • Increase the budget
                          </div>
                          <div>
                            • Increase the bathroom
                            dimensions
                          </div>
                          <div>
                            • Review the required fixture
                            categories
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 2D layout */}
                    {result.layout &&
                      result.bundles[0] && (
                        <BathroomLayout
                          layout={result.layout}
                          products={
                            result.bundles[0].products
                          }
                        />
                      )}

                    {/* Explanation */}
                    {result.bundles[0] && (
                      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="mb-4">
                          <div className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                            Why this recommendation?
                          </div>

                          <h2 className="mt-1 text-2xl font-semibold">
                            A transparent explanation of the
                            top bundle
                          </h2>
                        </div>

                        {/* Summary metrics */}
                        <div className="mb-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-neutral-100 p-4">
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                              Budget use
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                              {Math.round(
                                (result.bundles[0]
                                  .totalPriceINR /
                                  Number(budgetINR)) *
                                  100
                              )}
                              %
                            </div>
                          </div>

                          <div className="rounded-2xl bg-neutral-100 p-4">
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                              Overall score
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                              {result.bundles[0].scores.total}
                              /100
                            </div>
                          </div>

                          <div className="rounded-2xl bg-neutral-100 p-4">
                            <div className="text-xs uppercase tracking-wider text-neutral-500">
                              Annual savings
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                              {formatLiters(
                                result.waterUsage
                                  .estimatedAnnualSavingsLiters
                              )}{' '}
                              L
                            </div>
                          </div>
                        </div>

                        <p className="whitespace-pre-line text-sm leading-7 text-neutral-600">
                          {generateTemplateExplanation(
                            result.bundles[0],
                            {
                              dimensions: {
                                widthFt: Number(widthFt),
                                lengthFt: Number(lengthFt),
                              },
                              budgetINR:
                                Number(budgetINR),
                              selectedThemes: [theme],
                              requiredCategories: [
                                'toilet',
                                'faucet',
                                'shower',
                                'vanity',
                              ],
                              householdSize:
                                Number(householdSize),
                            }
                          )}
                        </p>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                            Optimization result
                          </div>

                          <h2 className="mt-1 text-3xl font-semibold">
                            {result.bundles.length} feasible
                            recommendations
                          </h2>

                          <p className="mt-2 text-sm text-neutral-500">
                            Evaluated against{' '}
                            {result.catalogSize} catalog
                            products.
                          </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-100 px-4 py-3">
                          <div className="text-xs uppercase tracking-wider text-neutral-500">
                            Estimated annual water savings
                          </div>

                          <div className="mt-1 text-2xl font-semibold">
                            {formatLiters(
                              result.waterUsage
                                .estimatedAnnualSavingsLiters
                            )}{' '}
                            L
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bundle cards */}
                    {result.bundles.map(
                      (bundle, index) => (
                        <article
                          key={bundle.id}
                          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-start">
                            <div>
                              <div className="text-sm font-semibold text-neutral-500">
                                Recommendation{' '}
                                {index + 1}
                              </div>

                              <h3 className="mt-1 text-2xl font-semibold">
                                {formatINR(
                                  bundle.totalPriceINR
                                )}
                              </h3>

                              <p className="mt-1 text-sm text-neutral-500">
                                4-fixture KOHLER bundle
                              </p>
                            </div>

                            <div className="rounded-2xl bg-neutral-950 px-4 py-3 text-white">
                              <div className="text-xs uppercase tracking-wider text-neutral-400">
                                Overall score
                              </div>

                              <div className="mt-1 text-3xl font-semibold">
                                {bundle.scores.total}
                                <span className="text-base text-neutral-400">
                                  /100
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 py-5 sm:grid-cols-2">
                            {bundle.products.map(
                              (product) => (
                                <div
                                  key={product.id}
                                  className="rounded-2xl border border-neutral-200 p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                        {
                                          CATEGORY_LABELS[
                                            product.category
                                          ]
                                        }
                                      </div>

                                      <h4 className="mt-1 font-semibold">
                                        {product.name}
                                      </h4>

                                      <p className="mt-1 text-xs text-neutral-500">
                                        {
                                          product.modelNumber
                                        }
                                      </p>
                                    </div>

                                    <div className="whitespace-nowrap text-sm font-semibold">
                                      {formatINR(
                                        product.priceINR
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                                      {product.dataConfidence}{' '}
                                      data
                                    </span>

                                    {product.waterConsumption
                                      ?.type ===
                                      'flush' && (
                                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                                        {product
                                          .waterConsumption
                                          .dualFlush
                                          ? `${product.waterConsumption.reducedFlushLPF}–${product.waterConsumption.fullFlushLPF} LPF`
                                          : `${product.waterConsumption.valueLPF} LPF`}
                                      </span>
                                    )}

                                    {product.waterConsumption
                                      ?.type ===
                                      'flow' && (
                                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                                        {
                                          product
                                            .waterConsumption
                                            .valueLPM
                                        }{' '}
                                        LPM
                                      </span>
                                    )}
                                  </div>

                                  <a
                                    href={
                                      product.productUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex text-xs font-medium underline underline-offset-4 hover:text-neutral-600"
                                  >
                                    View KOHLER product ↗
                                  </a>
                                </div>
                              )
                            )}
                          </div>

                          {/* Score breakdown */}
                          <div className="grid gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-5">
                            {[
                              [
                                'Style',
                                bundle.scores.styleMatch,
                              ],
                              [
                                'Water',
                                bundle.scores.sustainability,
                              ],
                              [
                                'Value',
                                bundle.scores.value,
                              ],
                              [
                                'Space',
                                bundle.scores.spaceFit,
                              ],
                              [
                                'Coherence',
                                bundle.scores.coherence,
                              ],
                            ].map(([label, score]) => (
                              <div
                                key={label as string}
                              >
                                <div className="flex justify-between text-xs text-neutral-500">
                                  <span>{label}</span>
                                  <span>{score}</span>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                                  <div
                                    className="h-full rounded-full bg-neutral-950"
                                    style={{
                                      width: `${score}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </article>
                      )
                    )}

                    {/* Method note */}
                    <div className="rounded-3xl border border-neutral-200 bg-neutral-100 p-5 text-sm leading-6 text-neutral-600">
                      <strong className="text-neutral-950">
                        How this recommendation was generated:
                      </strong>{' '}
                      the system validates the bathroom
                      requirements, removes infeasible
                      products, enforces the budget ceiling,
                      evaluates each feasible bundle, and
                      ranks the results using weighted style,
                      sustainability, value, space-fit, and
                      coherence scores. Annual water figures
                      are estimates based on the configured
                      household usage assumptions.
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}