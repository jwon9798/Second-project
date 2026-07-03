"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Link2, Loader2, Upload } from "lucide-react";
import { uploadQuizImage } from "@/lib/upload-client";

type SourceMode = "upload" | "url";

interface ImageSourceFieldProps {
  imageUrl: string;
  onChange: (url: string) => void;
}

export default function ImageSourceField({ imageUrl, onChange }: ImageSourceFieldProps) {
  const t = useTranslations("create");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<SourceMode>("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadQuizImage(file);
      onChange(url);
      setMode("upload");
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
            mode === "upload"
              ? "bg-[#00f5d4]/15 text-[#00f5d4] border border-[#00f5d4]/30"
              : "bg-white/5 text-white/50"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          {t("imageModeUpload")}
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
            mode === "url"
              ? "bg-[#00f5d4]/15 text-[#00f5d4] border border-[#00f5d4]/30"
              : "bg-white/5 text-white/50"
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          {t("imageModeUrl")}
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
            dragOver
              ? "border-[#00f5d4] bg-[#00f5d4]/10"
              : "border-white/15 bg-white/[0.02] hover:border-white/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileInput}
          />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#00f5d4]" />
          ) : (
            <ImagePlus className="h-8 w-8 text-white/40" />
          )}
          <p className="text-sm text-white/60 text-center">{t("imageDropHint")}</p>
          <p className="text-[10px] text-white/30">{t("imageUploadLimits")}</p>
        </div>
      ) : (
        <div>
          <input
            value={imageUrl}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("imageUrlPlaceholder")}
            className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
          />
          <p className="mt-1 text-[10px] text-white/30">{t("imageUrlHint")}</p>
        </div>
      )}

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {imageUrl && (
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
            referrerPolicy="no-referrer"
          />
          <p className="flex-1 truncate text-xs text-white/40">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
