'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Scan,
  Wand2,
  ExternalLink,
  Droplets,
  LayoutGrid,
  Loader2,
  CircleAlert,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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

  const workflowStep = loading ? 2 : result ? 3 : 1;

  const WORKFLOW_STEPS = [
    { step: 1, label: 'Requirements' },
    { step: 2, label: 'Optimization' },
    { step: 3, label: 'Your Design' },
  ] as const;

  return (
    <main className="min-h-screen bg-marble text-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink-muted">
            <Sparkles
              className="size-4 text-brand"
              aria-hidden="true"
            />
            KOHLER AI Bathroom Designer
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Design a bathroom that fits your space,
              budget, and style.
            </h1>

            <p className="mt-4 text-lg leading-8 text-ink-muted">
              Enter your requirements and our optimization
              engine will evaluate feasible KOHLER product
              combinations instead of simply guessing a
              recommendation.
            </p>
          </div>
        </header>

        {/* Workflow indicator */}
        <ol
          aria-label="Design workflow progress"
          className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm"
        >
          {WORKFLOW_STEPS.map(({ step, label }, index) => {
            const isComplete = workflowStep > step;
            const isCurrent = workflowStep === step;

            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium transition-colors ${
                    isCurrent
                      ? 'border-brand bg-brand text-white'
                      : isComplete
                        ? 'border-brand/30 bg-brand/10 text-brand'
                        : 'border-hairline bg-surface text-ink-muted'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2
                      className="size-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className={`flex size-4 items-center justify-center rounded-full text-[10px] ${
                        isCurrent
                          ? 'bg-white/20'
                          : 'bg-muted'
                      }`}
                      aria-hidden="true"
                    >
                      {step}
                    </span>
                  )}
                  {label}
                </span>

                {index < WORKFLOW_STEPS.length - 1 && (
                  <span
                    className="text-ink-muted/50"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Requirement form */}
          <section className="h-fit rounded-3xl border border-hairline bg-surface p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Your requirements
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                These values are sent to the
                deterministic recommendation engine.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* AI description */}
              <div className="mb-6 rounded-2xl border border-brand/20 bg-brand/5 p-4">
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Sparkles
                      className="size-4 text-ink-muted"
                      aria-hidden="true"
                    />
                    Describe your bathroom
                  </div>

                  <p className="mt-1 text-xs leading-5 text-ink-muted">
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
                  className="w-full resize-none rounded-xl border border-hairline bg-surface px-3 py-3 text-sm outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                />

                <button
                  type="button"
                  onClick={handleAIInterpret}
                  disabled={aiLoading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-1 active:bg-hairline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiLoading ? (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sparkles
                      className="size-4"
                      aria-hidden="true"
                    />
                  )}
                  {aiLoading
                    ? 'Understanding...'
                    : 'Understand with AI'}
                </button>

                {aiError && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-surface p-3 text-xs text-danger-foreground">
                    <CircleAlert
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Image analysis */}
                <div className="mt-5 border-t border-hairline pt-5">
                  <div className="mb-3">
                    <label
                      htmlFor="bathroom-image"
                      className="flex items-center gap-1.5 text-sm font-semibold"
                    >
                      <ImageIcon
                        className="size-4 text-ink-muted"
                        aria-hidden="true"
                      />
                      Optional bathroom image
                    </label>

                    <p className="mt-1 text-xs leading-5 text-ink-muted">
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
                    className="block w-full cursor-pointer rounded-lg text-sm outline-none file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand file:px-3 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand/30"
                  />

                  {imagePreview && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-hairline bg-surface">
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
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-1 active:bg-hairline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {imageLoading ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Scan
                        className="size-4"
                        aria-hidden="true"
                      />
                    )}
                    {imageLoading
                      ? 'Analyzing image...'
                      : 'Analyze image'}
                  </button>

                  {imageError && (
                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-surface p-3 text-xs text-danger-foreground">
                      <CircleAlert
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{imageError}</span>
                    </div>
                  )}

                  {imageAnalysis && (
                    <div className="mt-4 rounded-2xl border border-hairline bg-surface p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
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
                                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-ink-muted"
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

                      <div className="mt-3 text-xs text-ink-muted">
                        Confidence:{' '}
                        {Math.round(
                          imageAnalysis.confidence * 100
                        )}
                        %
                      </div>

                      <p className="mt-3 text-xs text-ink-muted">
                        Visual cues can be used to
                        prefill your style preference.
                        You can always change it manually
                        before generating the bathroom.
                      </p>

                      {imageAnalysis.warnings.length >
                        0 && (
                        <div className="mt-3 rounded-xl bg-muted p-3 text-xs leading-5 text-ink-muted">
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
                  className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
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
                  className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
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
                  className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
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
                  className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
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
                  className="w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                />
              </div>

              {/* Categories */}
              <div className="rounded-2xl bg-muted p-4">
                <div className="text-sm font-medium">
                  Included fixtures
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink-muted">
                  <div>✓ Toilet</div>
                  <div>✓ Faucet</div>
                  <div>✓ Shower</div>
                  <div>✓ Vanity</div>
                </div>
              </div>

              {/* Generate */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="group h-auto w-full gap-2 rounded-xl bg-brand py-3.5 text-base font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30 focus-visible:ring-brand/40 active:bg-brand-active active:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2
                    className="size-5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Wand2
                    className="size-5 transition-transform group-hover:rotate-12"
                    aria-hidden="true"
                  />
                )}
                {loading
                  ? 'Optimizing your bathroom...'
                  : 'Generate My Bathroom'}
              </Button>
            </form>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-danger/25 bg-danger-surface p-4 text-sm text-danger-foreground">
                <CircleAlert
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}
          </section>

          {/* Results */}
          <section>
            {/* Dedicated status region: announces state changes to screen
                readers without exposing the whole results panel as a live
                region (which would re-announce every card on every update). */}
            <p role="status" aria-live="polite" className="sr-only">
              {loading
                ? 'Optimizing your bathroom...'
                : result
                  ? result.bundles.length > 0
                    ? 'Your design is ready.'
                    : 'No feasible bathroom configuration was found.'
                  : ''}
            </p>

            {!result && !loading && (
              <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-dashed border-hairline bg-surface p-8 text-center shadow-sm">
                <div className="max-w-md">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <LayoutGrid
                      className="size-7 text-ink-muted"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="text-2xl font-semibold">
                    Your optimized bathroom will appear
                    here
                  </h2>

                  <p className="mt-3 leading-7 text-ink-muted">
                    The engine will filter infeasible
                    products, enforce your budget, evaluate
                    style and sustainability, and rank the
                    remaining combinations.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[560px] items-center justify-center rounded-3xl border border-hairline bg-surface shadow-sm">
                <div className="text-center">
                  <Loader2
                    className="mx-auto mb-5 size-10 animate-spin text-brand motion-reduce:animate-none"
                    aria-hidden="true"
                  />

                  <h2 className="text-xl font-semibold">
                    Optimizing your bathroom...
                  </h2>

                  <p className="mt-2 text-sm text-ink-muted">
                    Checking product combinations against
                    your constraints...
                  </p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500 motion-reduce:animate-none">
                {/* No feasible result */}
                {result.bundles.length === 0 ? (
                  <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-warning/30 bg-warning-surface p-8 text-center shadow-sm">
                    <div className="max-w-lg">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/15">
                        <CircleAlert
                          className="size-7 text-warning-foreground"
                          aria-hidden="true"
                        />
                      </div>

                      <h2 className="text-2xl font-semibold">
                        No feasible bathroom configuration
                        found
                      </h2>

                      <p className="mt-3 leading-7 text-ink-muted">
                        The current requirements do not
                        produce a bundle that satisfies the
                        available space and budget
                        constraints.
                      </p>

                      <div className="mt-5 rounded-2xl bg-surface p-4 text-left text-sm text-ink-muted">
                        <div className="font-medium text-ink">
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
                      <div className="rounded-3xl border border-hairline bg-surface p-6 shadow-sm">
                        <div className="mb-4">
                          <div className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                            Why this recommendation?
                          </div>

                          <h2 className="mt-1 text-2xl font-semibold">
                            A transparent explanation of the
                            top bundle
                          </h2>
                        </div>

                        {/* Summary metrics */}
                        <div className="mb-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl bg-muted p-4">
                            <div className="text-xs uppercase tracking-wider text-ink-muted">
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

                          <div className="rounded-2xl bg-muted p-4">
                            <div className="text-xs uppercase tracking-wider text-ink-muted">
                              Overall score
                            </div>

                            <div className="mt-1 text-xl font-semibold">
                              {result.bundles[0].scores.total}
                              /100
                            </div>
                          </div>

                          <div className="rounded-2xl bg-sage-surface p-4 ring-1 ring-sage/15">
                            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-sage-foreground">
                              <Droplets
                                className="size-3.5"
                                aria-hidden="true"
                              />
                              Annual savings
                            </div>

                            <div className="mt-1 text-xl font-semibold text-sage-foreground">
                              {formatLiters(
                                result.waterUsage
                                  .estimatedAnnualSavingsLiters
                              )}{' '}
                              L
                            </div>
                          </div>
                        </div>

                        <p className="whitespace-pre-line text-sm leading-7 text-ink-muted">
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
                    <div className="rounded-3xl border border-hairline bg-surface p-6 shadow-sm">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                            Optimization result
                          </div>

                          <h2 className="mt-1 text-3xl font-semibold">
                            {result.bundles.length} feasible
                            recommendations
                          </h2>

                          <p className="mt-2 text-sm text-ink-muted">
                            Evaluated against{' '}
                            {result.catalogSize} catalog
                            products.
                          </p>
                        </div>

                        <div className="animate-in fade-in zoom-in-95 rounded-2xl bg-sage-surface px-5 py-4 ring-1 ring-sage/15 duration-500 motion-reduce:animate-none">
                          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-foreground">
                            <Droplets
                              className="size-4"
                              aria-hidden="true"
                            />
                            Water saved
                          </div>

                          <div className="mt-1 text-2xl font-semibold text-sage-foreground">
                            {formatLiters(
                              result.waterUsage
                                .estimatedAnnualSavingsLiters
                            )}{' '}
                            L{' '}
                            <span className="text-base font-normal text-sage-foreground">
                              / year
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-sage-foreground/80">
                            Estimated under your stated
                            usage assumptions
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bundle cards */}
                    {result.bundles.map(
                      (bundle, index) => (
                        <article
                          key={bundle.id}
                          style={{
                            animationDelay: `${index * 100}ms`,
                          }}
                          className={`animate-in fade-in slide-in-from-bottom-2 rounded-3xl border bg-surface p-6 shadow-sm duration-500 motion-reduce:animate-none ${
                            index === 0
                              ? 'border-brand/40 ring-2 ring-brand/15'
                              : 'border-hairline'
                          }`}
                        >
                          <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-start">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink-muted">
                                Recommendation{' '}
                                {index + 1}
                                {index === 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                                    <CheckCircle2
                                      className="size-3"
                                      aria-hidden="true"
                                    />
                                    Best match
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-1 text-2xl font-semibold">
                                {formatINR(
                                  bundle.totalPriceINR
                                )}
                              </h3>

                              <p className="mt-1 text-sm text-ink-muted">
                                4-fixture KOHLER bundle
                              </p>
                            </div>

                            <div className="rounded-2xl bg-ink px-4 py-3 text-white">
                              <div className="text-xs uppercase tracking-wider text-ink-muted">
                                Overall score
                              </div>

                              <div className="mt-1 text-3xl font-semibold">
                                {bundle.scores.total}
                                <span className="text-base text-ink-muted">
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
                                  className="rounded-2xl border border-hairline p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                                        {
                                          CATEGORY_LABELS[
                                            product.category
                                          ]
                                        }
                                      </div>

                                      <h4 className="mt-1 font-semibold">
                                        {product.name}
                                      </h4>

                                      <p className="mt-1 text-xs text-ink-muted">
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
                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-ink-muted">
                                      {product.dataConfidence}{' '}
                                      data
                                    </span>

                                    {product.waterConsumption
                                      ?.type ===
                                      'flush' && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-sage-surface px-2.5 py-1 text-xs text-sage-foreground">
                                        <Droplets
                                          className="size-3"
                                          aria-hidden="true"
                                        />
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
                                      <span className="inline-flex items-center gap-1 rounded-full bg-sage-surface px-2.5 py-1 text-xs text-sage-foreground">
                                        <Droplets
                                          className="size-3"
                                          aria-hidden="true"
                                        />
                                        {
                                          product
                                            .waterConsumption
                                            .valueLPM
                                        }{' '}
                                        LPM
                                      </span>
                                    )}
                                  </div>

                                  {product.subcategory ===
                                    'thermostatic-system' && (
                                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning-surface px-2.5 py-2 text-xs leading-4 text-warning-foreground">
                                      <CircleAlert
                                        className="mt-0.5 size-3.5 shrink-0"
                                        aria-hidden="true"
                                      />
                                      <span>
                                        Valve body only —
                                        compatible
                                        control-panel trim
                                        sold separately.
                                      </span>
                                    </div>
                                  )}

                                  <a
                                    href={
                                      product.productUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 hover:text-ink-muted"
                                  >
                                    View KOHLER product
                                    <ExternalLink
                                      className="size-3"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </div>
                              )
                            )}
                          </div>

                          {/* Score breakdown */}
                          <div className="grid gap-3 border-t border-hairline pt-5 sm:grid-cols-5">
                            {[
                              [
                                'Style',
                                bundle.scores.styleMatch,
                                'bg-ink',
                              ],
                              [
                                'Water',
                                bundle.scores.sustainability,
                                'bg-sage',
                              ],
                              [
                                'Value',
                                bundle.scores.value,
                                'bg-ink',
                              ],
                              [
                                'Space',
                                bundle.scores.spaceFit,
                                'bg-ink',
                              ],
                              [
                                'Coherence',
                                bundle.scores.coherence,
                                'bg-ink',
                              ],
                            ].map(([label, score, barColor]) => (
                              <div
                                key={label as string}
                              >
                                <div className="flex justify-between text-xs text-ink-muted">
                                  <span>{label}</span>
                                  <span>{score}</span>
                                </div>

                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className={`h-full rounded-full ${barColor} transition-[width] duration-700 ease-out`}
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
                    <div className="rounded-3xl border border-hairline bg-muted p-5 text-sm leading-6 text-ink-muted shadow-sm">
                      <strong className="text-ink">
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