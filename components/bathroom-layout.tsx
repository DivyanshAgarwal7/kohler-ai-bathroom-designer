'use client';

import { useMemo } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
} from 'react-konva';
import { LayoutGrid } from 'lucide-react';

import { KohlerProduct } from '@/types/product';
import { LayoutData } from '@/types/recommendation';

interface BathroomLayoutProps {
  layout: LayoutData;
  products: KohlerProduct[];
}

const CATEGORY_LABELS = {
  toilet: 'TOILET',
  faucet: 'FAUCET',
  shower: 'SHOWER',
  vanity: 'VANITY',
} as const;

// Warm-stone plan palette (kept as literal hex, matching the CSS design
// tokens in app/globals.css -- Konva draws to a canvas, so it can't read
// CSS custom properties directly).
const PLAN_COLORS = {
  roomFill: '#f7f5f0', // --page
  roomStroke: '#292521', // --ink
  zoneFill: '#f5f2ec',
  zoneStroke: '#ded7cd', // --hairline
  fixtureFill: '#292521', // --ink
  fixtureLabel: '#ffffff',
  dimension: '#716b64', // --ink-muted
  dimensionGuide: '#c9c0b3',
  thermostaticStroke: '#96623f', // --brand
  thermostaticFill: '#fdfbf8',
  thermostaticLabel: '#7d4f32', // --brand-hover
} as const;

// Dimension-annotation geometry. The two annotation margins below are
// derived from these same constants, so the space reserved around the
// room always matches what's actually drawn -- no separate magic numbers
// that can silently drift out of sync and start overlapping the walls.
const DIM_FONT_SIZE = 10;
const DIM_TEXT_HEIGHT = 13; // approx. rendered line height at DIM_FONT_SIZE
const DIM_LABEL_BOX = 64; // fixed label width (top) / rotated label length (right)
const DIM_EXTENSION_GAP = 4; // gap from the room edge to the extension line
const DIM_EXTENSION_LENGTH = 12; // extension line length
const DIM_LABEL_GAP = 5; // gap from the dimension line to the label text

// Reserved above/right of the room for the annotation system; a small
// extra buffer keeps the label off the canvas edge itself.
const TOP_ANNOTATION_MARGIN =
  DIM_EXTENSION_GAP + DIM_EXTENSION_LENGTH + DIM_LABEL_GAP + DIM_TEXT_HEIGHT + 6;
const RIGHT_ANNOTATION_MARGIN =
  DIM_EXTENSION_GAP + DIM_EXTENSION_LENGTH + DIM_LABEL_GAP + DIM_TEXT_HEIGHT + 8;
const LEFT_SAFETY_MARGIN = 18;
const BOTTOM_SAFETY_MARGIN = 18;

export default function BathroomLayout({
  layout,
  products,
}: BathroomLayoutProps) {
  const canvasWidth = 760;
  const canvasHeight = 500;

  const scale = useMemo(() => {
    const availableWidth =
      canvasWidth - LEFT_SAFETY_MARGIN - RIGHT_ANNOTATION_MARGIN;

    const availableHeight =
      canvasHeight - TOP_ANNOTATION_MARGIN - BOTTOM_SAFETY_MARGIN;

    return Math.min(
      availableWidth / layout.room.widthMM,
      availableHeight / layout.room.lengthMM
    );
  }, [layout.room]);

  const roomWidth = layout.room.widthMM * scale;
  const roomHeight = layout.room.lengthMM * scale;

  // The room is centered within the space left over once the annotation
  // margins are reserved, so the top/right labels always have a
  // consistent, collision-free gap regardless of room proportions.
  const offsetX =
    LEFT_SAFETY_MARGIN +
    (canvasWidth -
      LEFT_SAFETY_MARGIN -
      RIGHT_ANNOTATION_MARGIN -
      roomWidth) /
      2;

  const offsetY =
    TOP_ANNOTATION_MARGIN +
    (canvasHeight -
      TOP_ANNOTATION_MARGIN -
      BOTTOM_SAFETY_MARGIN -
      roomHeight) /
      2;

  // Top (width) dimension geometry. The label box is clamped to a
  // sensible minimum so a very narrow room can't force the text to wrap
  // -- it just centers over the (wider) label box instead of the room
  // edges exactly, which stays safe because a narrow room always leaves
  // plenty of empty canvas on both sides.
  const topLabelWidth = Math.max(roomWidth, 52);
  const topLabelX = offsetX + roomWidth / 2 - topLabelWidth / 2;
  const topGuideY = offsetY - DIM_EXTENSION_GAP;
  const topLineY = offsetY - DIM_EXTENSION_GAP - DIM_EXTENSION_LENGTH;
  const topLabelY = topLineY - DIM_LABEL_GAP - DIM_TEXT_HEIGHT;

  // Right (depth) dimension geometry
  const rightGuideX = offsetX + roomWidth + DIM_EXTENSION_GAP;
  const rightLineX = rightGuideX + DIM_EXTENSION_LENGTH;
  const rightLabelX = rightLineX + DIM_LABEL_GAP;
  const rightLabelY =
    offsetY + roomHeight / 2 + DIM_LABEL_BOX / 2;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm duration-500 motion-reduce:animate-none">
      <div className="border-b border-hairline px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          <LayoutGrid className="size-4" aria-hidden="true" />
          2D bathroom plan
        </div>

        <div className="mt-1 text-sm text-ink-muted">
          Zone-based feasibility visualization
        </div>
      </div>

      <div className="flex justify-center overflow-auto p-5">
        <Stage
          width={canvasWidth}
          height={canvasHeight}
        >
          <Layer>
            {/* Room */}
            <Rect
              x={offsetX}
              y={offsetY}
              width={roomWidth}
              height={roomHeight}
              fill={PLAN_COLORS.roomFill}
              stroke={PLAN_COLORS.roomStroke}
              strokeWidth={3}
            />

            {/* Top (width) dimension: extension lines + dimension line +
                a horizontally centered label that sits clearly above the
                wall, never touching it. */}
            <Line
              points={[
                offsetX,
                topGuideY,
                offsetX,
                topLineY,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Line
              points={[
                offsetX + roomWidth,
                topGuideY,
                offsetX + roomWidth,
                topLineY,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Line
              points={[
                offsetX,
                topLineY,
                offsetX + roomWidth,
                topLineY,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Text
              x={topLabelX}
              y={topLabelY}
              width={topLabelWidth}
              text={`${Math.round(layout.room.widthMM)} mm`}
              fontSize={DIM_FONT_SIZE}
              fill={PLAN_COLORS.dimension}
              align="center"
            />

            {/* Right (depth) dimension: extension lines + dimension line +
                a vertically centered label, rotated -90deg so it reads
                bottom-to-top along the wall (standard architectural
                convention for a right-side vertical dimension). */}
            <Line
              points={[
                offsetX + roomWidth,
                offsetY,
                rightGuideX,
                offsetY,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Line
              points={[
                offsetX + roomWidth,
                offsetY + roomHeight,
                rightGuideX,
                offsetY + roomHeight,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Line
              points={[
                rightLineX,
                offsetY,
                rightLineX,
                offsetY + roomHeight,
              ]}
              stroke={PLAN_COLORS.dimensionGuide}
              strokeWidth={1}
            />
            <Text
              x={rightLabelX}
              y={rightLabelY}
              width={DIM_LABEL_BOX}
              text={`${Math.round(layout.room.lengthMM)} mm`}
              fontSize={DIM_FONT_SIZE}
              fill={PLAN_COLORS.dimension}
              align="center"
              rotation={-90}
            />

            {/* Zones */}
            {layout.zones.map((zone) => {
              const x = offsetX + zone.x * scale;
              const y = offsetY + zone.y * scale;
              const width = zone.widthMM * scale;
              const height = zone.depthMM * scale;

              return (
                <Rect
                  key={zone.id}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={PLAN_COLORS.zoneFill}
                  stroke={PLAN_COLORS.zoneStroke}
                  dash={[6, 5]}
                  strokeWidth={1}
                />
              );
            })}

            {/* Product placements */}
            {layout.placements.map((placement) => {
              const product = products.find(
                (item) => item.id === placement.productId
              );

              if (!product) {
                return null;
              }

              const x =
                offsetX + placement.x * scale;

              const y =
                offsetY + placement.y * scale;

              // Concealed wall-mounted valve body: it has no floor
              // footprint, so it must not be drawn as a scaled
              // width/depth rectangle like a real floor fixture. Render
              // a small, subtly outlined control marker instead.
              if (
                product.subcategory ===
                'thermostatic-system'
              ) {
                return (
                  <Rect
                    key={placement.productId}
                    x={x}
                    y={y}
                    width={72}
                    height={32}
                    fill={PLAN_COLORS.thermostaticFill}
                    stroke={
                      PLAN_COLORS.thermostaticStroke
                    }
                    strokeWidth={1.25}
                    dash={[4, 3]}
                    cornerRadius={4}
                  />
                );
              }

              const width =
                product.dimensions.widthMM * scale;

              const height =
                product.dimensions.depthMM * scale;

              const displayWidth = Math.max(width, 42);
              const displayHeight = Math.max(height, 30);

              return (
                <Rect
                  key={placement.productId}
                  x={x}
                  y={y}
                  width={displayWidth}
                  height={displayHeight}
                  fill={PLAN_COLORS.fixtureFill}
                  cornerRadius={6}
                />
              );
            })}

            {/* Labels */}
            {layout.placements.map((placement) => {
              const product = products.find(
                (item) => item.id === placement.productId
              );

              if (!product) {
                return null;
              }

              const x =
                offsetX + placement.x * scale;

              const y =
                offsetY + placement.y * scale;

              // Matches the outlined marker above: a wall/system
              // component label, not the generic floor-fixture category
              // label, so it doesn't read as an interchangeable "SHOWER"
              // fixture footprint.
              if (
                product.subcategory ===
                'thermostatic-system'
              ) {
                return (
                  <Text
                    key={`${placement.productId}-label`}
                    x={x}
                    y={y + 12}
                    width={72}
                    text="THERMOSTATIC"
                    fontSize={7}
                    fontStyle="bold"
                    fill={PLAN_COLORS.thermostaticLabel}
                    align="center"
                  />
                );
              }

              const width = Math.max(
                product.dimensions.widthMM * scale,
                42
              );

              const height = Math.max(
                product.dimensions.depthMM * scale,
                30
              );

              return (
                <Text
                  key={`${placement.productId}-label`}
                  x={x + 6}
                  y={y + Math.max(5, height / 2 - 7)}
                  width={Math.max(width - 12, 30)}
                  text={CATEGORY_LABELS[product.category]}
                  fontSize={10}
                  fontStyle="bold"
                  fill={PLAN_COLORS.fixtureLabel}
                  align="center"
                />
              );
            })}

            {/* Entry indicator */}
            <Line
              points={[
                offsetX + roomWidth / 2 - 30,
                offsetY + roomHeight,
                offsetX + roomWidth / 2 + 30,
                offsetY + roomHeight,
              ]}
              stroke={PLAN_COLORS.roomFill}
              strokeWidth={6}
            />
          </Layer>
        </Stage>
      </div>

      <div className="border-t border-hairline px-5 py-4 text-xs text-ink-muted">
        This visualization represents optimization zones and approximate
        product footprints. It is not a certified architectural or CAD plan.
      </div>
    </div>
  );
}
