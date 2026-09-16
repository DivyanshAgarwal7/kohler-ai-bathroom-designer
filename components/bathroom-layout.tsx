'use client';

import { useMemo } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Text,
  Line,
} from 'react-konva';

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

export default function BathroomLayout({
  layout,
  products,
}: BathroomLayoutProps) {
  const canvasWidth = 760;
  const canvasHeight = 500;
  const padding = 35;

  const scale = useMemo(() => {
    return Math.min(
      (canvasWidth - padding * 2) / layout.room.widthMM,
      (canvasHeight - padding * 2) / layout.room.lengthMM
    );
  }, [layout.room]);

  const roomWidth = layout.room.widthMM * scale;
  const roomHeight = layout.room.lengthMM * scale;

  const offsetX = (canvasWidth - roomWidth) / 2;
  const offsetY = (canvasHeight - roomHeight) / 2;

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <div className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
          2D bathroom plan
        </div>

        <div className="mt-1 text-sm text-neutral-500">
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
              fill="#fafafa"
              stroke="#171717"
              strokeWidth={3}
            />

            {/* Room dimension guide */}
            <Text
              x={offsetX}
              y={offsetY - 24}
              text={`${Math.round(layout.room.widthMM)} mm`}
              fontSize={12}
              fill="#737373"
            />

            <Text
              x={offsetX + roomWidth + 8}
              y={offsetY + roomHeight / 2}
              text={`${Math.round(layout.room.lengthMM)} mm`}
              fontSize={12}
              fill="#737373"
              rotation={90}
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
                  fill="#f5f5f5"
                  stroke="#d4d4d4"
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
                  fill="#171717"
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
                  fill="#ffffff"
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
              stroke="#ffffff"
              strokeWidth={6}
            />
          </Layer>
        </Stage>
      </div>

      <div className="border-t border-neutral-200 px-5 py-4 text-xs text-neutral-500">
        This visualization represents optimization zones and approximate
        product footprints. It is not a certified architectural or CAD plan.
      </div>
    </div>
  );
}