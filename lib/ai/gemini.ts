import {
  GoogleGenAI,
  Type,
  ThinkingLevel,
} from '@google/genai';
import { z } from 'zod';

const GeminiRequirementsSchema = z.object({
  widthFt: z.number().nullable(),
  lengthFt: z.number().nullable(),
  budgetINR: z.number().nullable(),
  selectedThemes: z.array(
    z.enum([
      'minimalist-modern',
      'classic-luxury',
      'japanese-zen',
      'contemporary',
      'transitional',
      'industrial',
    ])
  ),
  householdSize: z.number().nullable(),
  confidence: z.number().min(0).max(1),
  missingInformation: z.array(z.string()),
  notes: z.string(),
});

export type GeminiRequirements = z.infer<
  typeof GeminiRequirementsSchema
>;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    widthFt: {
      type: Type.NUMBER,
      description:
        'Bathroom width in feet. Return 0 when the user did not provide it.',
    },
    lengthFt: {
      type: Type.NUMBER,
      description:
        'Bathroom length in feet. Return 0 when the user did not provide it.',
    },
    budgetINR: {
      type: Type.NUMBER,
      description:
        'Maximum product budget in Indian rupees. Return 0 when not provided.',
    },
    selectedThemes: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: [
          'minimalist-modern',
          'classic-luxury',
          'japanese-zen',
          'contemporary',
          'transitional',
          'industrial',
        ],
      },
      description: 'Normalized bathroom style themes.',
    },
    householdSize: {
      type: Type.NUMBER,
      description:
        'Number of people in the household. Return 0 when not provided.',
    },
    confidence: {
      type: Type.NUMBER,
      description:
        'Overall extraction confidence from 0 to 1.',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Important information that the user did not provide.',
    },
    notes: {
      type: Type.STRING,
      description:
        'Brief explanation of how the request was interpreted.',
    },
  },
  required: [
    'widthFt',
    'lengthFt',
    'budgetINR',
    'selectedThemes',
    'householdSize',
    'confidence',
    'missingInformation',
    'notes',
  ],
};

const SYSTEM_INSTRUCTION = `
You are the requirement interpretation layer for a KOHLER bathroom design system.

Your ONLY job is to extract and normalize user requirements.

Do NOT recommend products.
Do NOT invent KOHLER product prices.
Do NOT invent product dimensions.
Do NOT invent water-consumption values.
Do NOT make architectural, plumbing, electrical, or building-code claims.

Normalize style language into exactly these themes:
- minimalist-modern
- classic-luxury
- japanese-zen
- contemporary
- transitional
- industrial

Convert Indian rupee amounts into numeric INR values.

Examples:
"1.5 lakh" -> 150000
"2 lakh rupees" -> 200000
"₹1,20,000" -> 120000

For dimensions:
- "7 by 9 feet" means width 7 and length 9.
- Preserve the user's values instead of estimating missing dimensions.

For missing numeric values, return 0 and add the missing item to missingInformation.

Only infer a style theme when the wording clearly supports it.

Return only the requested structured JSON.
`;

export async function interpretBathroomRequest(
  userText: string
): Promise<GeminiRequirements> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    timeout: 60000,
    retryOptions: {
      attempts: 2,
      initialDelay: 1,
      maxDelay: 4,
      expBase: 2,
      jitter: 0.2,
      httpStatusCodes: [408, 429, 500, 502, 503, 504],
    },
  },
});

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: userText,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
    },
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned invalid JSON.');
  }

  const parsed = GeminiRequirementsSchema.parse(parsedJson);

  return {
    ...parsed,
    widthFt: parsed.widthFt === 0 ? null : parsed.widthFt,
    lengthFt: parsed.lengthFt === 0 ? null : parsed.lengthFt,
    budgetINR: parsed.budgetINR === 0 ? null : parsed.budgetINR,
    householdSize:
      parsed.householdSize === 0 ? null : parsed.householdSize,
  };
}

export interface BathroomImageAnalysis {
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
}

const IMAGE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    roomShape: {
      type: Type.STRING,
      description:
        'Visible room shape, such as rectangular, irregular, or unknown.',
    },
    detectedFixtures: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Bathroom fixtures visibly identifiable in the image.',
    },
    layoutCues: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Visible spatial/layout relationships between fixtures and room features.',
    },
    styleCues: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Visible design/style cues such as minimal, contemporary, traditional, colors, or finishes.',
    },
    doorOrWindowCues: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Visible door or window information.',
    },
    widthFt: {
      type: Type.NUMBER,
      description:
        'Width in feet only when an explicit measurement is visibly written in the image. Otherwise return 0.',
    },
    lengthFt: {
      type: Type.NUMBER,
      description:
        'Length in feet only when an explicit measurement is visibly written in the image. Otherwise return 0.',
    },
    dimensionsSource: {
      type: Type.STRING,
      enum: ['visible-measurement', 'not-visible'],
      description:
        'Whether dimensions came from explicit visible measurement labels.',
    },
    confidence: {
      type: Type.NUMBER,
      description:
        'Overall visual interpretation confidence from 0 to 1.',
    },
    warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description:
        'Limitations or ambiguities that could affect interpretation.',
    },
  },
  required: [
    'roomShape',
    'detectedFixtures',
    'layoutCues',
    'styleCues',
    'doorOrWindowCues',
    'widthFt',
    'lengthFt',
    'dimensionsSource',
    'confidence',
    'warnings',
  ],
};

export async function analyzeBathroomImage(
  imageBase64: string,
  mimeType: string,
  additionalText?: string
): Promise<BathroomImageAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 30000,
      retryOptions: {
        attempts: 1,
        initialDelay: 1,
        maxDelay: 2,
        expBase: 2,
        jitter: 0.2,
        httpStatusCodes: [408, 429, 500, 502, 503],
      },
    },
  });

  const prompt = `
You are the visual-analysis layer of a bathroom planning application.

Analyze the supplied bathroom image.

Your job is ONLY to extract visible evidence.

DO NOT:
- invent measurements from image proportions
- estimate real-world dimensions from pixels
- claim architectural measurements
- recommend products
- invent KOHLER product information
- infer hidden plumbing
- claim building-code compliance

Dimensions:
Only return widthFt or lengthFt when an explicit measurement is visibly written
in the image, such as "7 ft", "9 ft", "7'-0"", "2100 mm", etc.

For an ordinary bathroom photograph with no visible measurement:
return widthFt=0, lengthFt=0, and dimensionsSource="not-visible".

${additionalText ? `Additional user context: ${additionalText}` : ''}

Return only structured JSON.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: IMAGE_RESPONSE_SCHEMA,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.MINIMAL,
      },
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error('Gemini returned an empty image-analysis response.');
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new Error('Gemini returned invalid image-analysis JSON.');
  }

  const parsed = z.object({
    roomShape: z.string().nullable(),
    detectedFixtures: z.array(z.string()),
    layoutCues: z.array(z.string()),
    styleCues: z.array(z.string()),
    doorOrWindowCues: z.array(z.string()),
    widthFt: z.number(),
    lengthFt: z.number(),
    dimensionsSource: z.enum([
      'visible-measurement',
      'not-visible',
    ]),
    confidence: z.number().min(0).max(1),
    warnings: z.array(z.string()),
  }).parse(parsedJson);

  return {
    ...parsed,
    widthFt: parsed.widthFt === 0 ? null : parsed.widthFt,
    lengthFt: parsed.lengthFt === 0 ? null : parsed.lengthFt,
  };
}