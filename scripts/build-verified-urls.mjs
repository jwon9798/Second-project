#!/usr/bin/env node
/** Build verified-urls.json from Commons API (run once, commit output). */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dir, "../src/data");
const outFile = join(__dir, "verified-urls.json");
const API = "https://commons.wikimedia.org/w/api.php";

import { FILENAME_ALIASES, extractFilename, canonicalName } from "./image-utils.mjs";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function collectFilenames() {
  const names = new Set();
  for (const f of readdirSync(dataDir).filter((x) => x.startsWith("seed") && x.endsWith(".json"))) {
    for (const q of JSON.parse(readFileSync(join(dataDir, f), "utf8"))) {
      for (const qu of q.questions ?? []) {
        if (!qu.imageUrl || qu.imageUrl.includes("flagcdn.com")) continue;
        const n = extractFilename(qu.imageUrl);
        if (n) names.add(n);
      }
    }
  }
  return [...names];
}

async function resolveBatch(filenames, width) {
  const out = {};
  for (let i = 0; i < filenames.length; i += 30) {
    const chunk = filenames.slice(i, i + 30);
    await sleep(600);
    const titles = chunk.map((f) => `File:${canonicalName(f)}`).join("|");
    const params = new URLSearchParams({
      action: "query",
      titles,
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: String(width),
      format: "json",
    });
    const res = await fetch(`${API}?${params}`, {
      headers: { "User-Agent": "ClipQuizBot/1.0 (https://clipquiz.jwonlabs.com)" },
    });
    const text = await res.text();
    if (!text.startsWith("{")) {
      console.warn("Rate limited at batch", i);
      await sleep(8000);
      i -= 30;
      continue;
    }
    const data = JSON.parse(text);
    const pages = Object.values(data.query?.pages ?? {});
    for (const orig of chunk) {
      const want = `File:${canonicalName(orig)}`;
      const page = pages.find((p) => p.title === want);
      const url = page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url;
      if (url) out[`${orig}@${width}`] = url;
      else console.warn("Missing:", orig);
    }
    process.stderr.write(`Resolved ${Math.min(i + 30, filenames.length)}/${filenames.length}\n`);
  }
  return out;
}

const names = collectFilenames();
console.log("Unique filenames:", names.length);
const verified = {
  ...(await resolveBatch(names, 800)),
  ...(await resolveBatch(names, 1280)),
};
writeFileSync(outFile, JSON.stringify(verified, null, 2));
console.log("Wrote", Object.keys(verified).length, "entries to", outFile);
