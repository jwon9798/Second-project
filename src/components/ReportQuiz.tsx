"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Flag } from "lucide-react";

interface ReportQuizProps {
  quizId: string;
  quizTitle: string;
}

export default function ReportQuiz({ quizId, quizTitle }: ReportQuizProps) {
  const t = useTranslations("report");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("copyright");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, quizTitle, reason, details }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
    } catch {
      // fall through
    }
    setStatus("error");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
      >
        <Flag className="h-3 w-3" />
        {t("button")}
      </button>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 mt-4">
      <h3 className="text-sm font-semibold mb-3">{t("title")}</h3>
      {status === "success" ? (
        <p className="text-sm text-[#00f5d4]">{t("success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-white/40 mb-1">{t("reason")}</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field w-full rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="copyright">{t("reasons.copyright")}</option>
              <option value="inappropriate">{t("reasons.inappropriate")}</option>
              <option value="spam">{t("reasons.spam")}</option>
              <option value="other">{t("reasons.other")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">{t("details")}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              className="input-field w-full rounded-lg px-3 py-2 text-sm text-white resize-none"
            />
          </div>
          {status === "error" && <p className="text-xs text-red-400">{t("error")}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary rounded-lg px-4 py-2 text-xs text-white/60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
