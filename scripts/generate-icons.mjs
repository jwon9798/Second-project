import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));

const sizes = [
  { file: "src/app/icon.png", size: 32 },
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "public/favicon-32.png", size: 32 },
];

for (const { file, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(root, file));
  console.log("wrote", file);
}

// favicon.ico = 16 + 32 combined (sharp outputs 32, browsers accept single-size ico as png-in-ico workaround)
const ico32 = await sharp(svg).resize(32, 32).png().toBuffer();
writeFileSync(join(root, "src/app/favicon.ico"), ico32);
writeFileSync(join(root, "public/favicon.ico"), ico32);
console.log("wrote favicon.ico");
