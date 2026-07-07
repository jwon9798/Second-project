import { NextResponse } from "next/server";
import { getStorageBackend } from "@/lib/storage";
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_PUBLISHER_ID,
  GA4_MEASUREMENT_ID,
} from "@/lib/site";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "ClipQuiz",
    version: "1.0.0",
    storage: getStorageBackend(),
    adsense: {
      clientId: ADSENSE_CLIENT_ID,
      publisherId: ADSENSE_PUBLISHER_ID,
    },
    analytics: {
      ga4MeasurementId: GA4_MEASUREMENT_ID,
    },
  });
}
