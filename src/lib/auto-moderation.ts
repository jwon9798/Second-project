/** Automatic actions when quizzes receive user reports. */

export const REPORT_HIDE_THRESHOLD = 3;
export const REPORT_DELETE_THRESHOLD = 5;

/** Copyright reports hide faster (one confirmed report). */
export const COPYRIGHT_HIDE_THRESHOLD = 1;

export type ReportAction = "none" | "hide" | "delete";

export function reportActionForCount(
  count: number,
  hasCopyrightReport: boolean,
): ReportAction {
  if (count >= REPORT_DELETE_THRESHOLD) return "delete";
  if (hasCopyrightReport && count >= COPYRIGHT_HIDE_THRESHOLD) return "hide";
  if (count >= REPORT_HIDE_THRESHOLD) return "hide";
  return "none";
}
