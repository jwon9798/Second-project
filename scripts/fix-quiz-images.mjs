#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { extractFilename, canonicalName, lookupVerified } from "./image-utils.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dir, "../src/data");
const verifiedFile = join(__dir, "verified-urls.json");
const API = "https://commons.wikimedia.org/w/api.php";

const verified = existsSync(verifiedFile)
  ? JSON.parse(readFileSync(verifiedFile, "utf8"))
  : {};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function searchThumb(query, width) {
  await sleep(250);
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "1",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: String(width),
    format: "json",
  });
  const res = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": "ClipQuizBot/1.0 (https://clipquiz.jwonlabs.com)" },
  });
  const text = await res.text();
  if (!text.startsWith("{")) return null;
  const data = JSON.parse(text);
  const page = Object.values(data.query?.pages ?? {})[0];
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null;
}

async function resolveUrl(url, isCrop) {
  if (!url || url.includes("flagcdn.com")) return url;
  const width = isCrop ? 1280 : 800;
  const name = extractFilename(url);
  if (!name) return url;

  const fromCache = lookupVerified(verified, name, width);
  if (fromCache) return fromCache;

  const search = await searchThumb(
    canonicalName(name).replace(/\.[^.]+$/, ""),
    width,
  );
  if (search) {
    verified[`${name}@${width}`] = search;
    return search;
  }
  return url;
}

async function patchFiles(files) {
  let changed = 0;
  let failed = 0;
  for (const file of files) {
    const path = join(dataDir, file);
    const quizzes = JSON.parse(readFileSync(path, "utf8"));
    for (const quiz of quizzes) {
      for (const q of quiz.questions ?? []) {
        if (!q.imageUrl || q.imageUrl.includes("flagcdn.com")) continue;
        const next = await resolveUrl(q.imageUrl, q.type === "crop");
        if (next !== q.imageUrl) {
          q.imageUrl = next;
          changed++;
        } else if (
          q.imageUrl.includes("Special:FilePath") ||
          q.imageUrl.includes("/640px-")
        ) {
          failed++;
        }
      }
    }
    writeFileSync(path, JSON.stringify(quizzes, null, 2));
  }
  writeFileSync(verifiedFile, JSON.stringify(verified, null, 2));
  return { changed, failed };
}

const onlyPublic = process.argv.includes("--public-only");
const blocked = onlyPublic
  ? new Set(
      [...readFileSync(join(__dir, "../src/lib/seed-filter.ts"), "utf8").matchAll(/"([a-z0-9-]+)"/g)].map(
        (m) => m[1],
      ),
    )
  : null;

const files = readdirSync(dataDir).filter((f) => f.startsWith("seed") && f.endsWith(".json"));

if (onlyPublic) {
  for (const file of [...files]) {
    const quizzes = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    const hasPublic = quizzes.some((q) => !blocked.has(q.id));
    if (!hasPublic) continue;
    const filtered = quizzes.filter((q) => !blocked.has(q.id));
    let changed = 0;
    for (const quiz of filtered) {
      for (const q of quiz.questions ?? []) {
        if (!q.imageUrl || q.imageUrl.includes("flagcdn.com")) continue;
        const next = await resolveUrl(q.imageUrl, q.type === "crop");
        if (next !== q.imageUrl) {
          q.imageUrl = next;
          changed++;
        }
      }
    }
    const all = JSON.parse(readFileSync(join(dataDir, file), "utf8"));
    for (const quiz of all) {
      if (blocked.has(quiz.id)) continue;
      const updated = filtered.find((u) => u.id === quiz.id);
      if (updated) Object.assign(quiz, updated);
    }
    writeFileSync(join(dataDir, file), JSON.stringify(all, null, 2));
    console.log(`${file}: ${changed} fixed`);
  }
  writeFileSync(verifiedFile, JSON.stringify(verified, null, 2));
  console.log("Done (public only).");
} else {
  const { changed, failed } = await patchFiles(files);
  console.log(`Updated ${changed} URLs. ${failed} still unresolved.`);
}
