"use client";

import { useTranslations } from "next-intl";

interface CropPickerProps {
  imageUrl: string;
  cropX: number;
  cropY: number;
  cropSize: number;
  onChange: (patch: { cropX?: number; cropY?: number; cropSize?: number }) => void;
}

export default function CropPicker({
  imageUrl,
  cropX,
  cropY,
  cropSize,
  onChange,
}: CropPickerProps) {
  const t = useTranslations("create");

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onChange({
      cropX: Math.round(Math.min(100, Math.max(0, x))),
      cropY: Math.round(Math.min(100, Math.max(0, y))),
    });
  }

  const half = cropSize / 2;
  const boxStyle = {
    left: `${cropX - half}%`,
    top: `${cropY - half}%`,
    width: `${cropSize}%`,
    height: `${cropSize}%`,
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#ffe566]">{t("cropClickHint")}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div
          role="presentation"
          onClick={handleClick}
          className="relative aspect-square cursor-crosshair overflow-hidden rounded-xl border border-white/15 bg-black"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover select-none"
            draggable={false}
            referrerPolicy="no-referrer"
          />
          <div
            className="pointer-events-none absolute border-2 border-[#00f5d4] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
            style={boxStyle}
          />
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00f5d4] border-2 border-white"
            style={{ left: `${cropX}%`, top: `${cropY}%` }}
          />
        </div>
        <div>
          <p className="mb-2 text-xs text-white/40">{t("cropPreviewLabel")}</p>
          <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
              style={{
                objectPosition: `${cropX}% ${cropY}%`,
                transform: `scale(${100 / cropSize})`,
                transformOrigin: `${cropX}% ${cropY}%`,
              }}
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-white/40">
          {t("cropSize")} ({cropSize}%)
        </label>
        <input
          type="range"
          min={18}
          max={75}
          value={cropSize}
          onChange={(e) => onChange({ cropSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}
