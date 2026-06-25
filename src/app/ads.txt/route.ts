import { NextResponse } from "next/server";

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  if (!publisherId) {
    return new NextResponse(
      "# Add NEXT_PUBLIC_ADSENSE_PUBLISHER_ID after AdSense approval\n",
      { headers: { "Content-Type": "text/plain" } },
    );
  }

  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
