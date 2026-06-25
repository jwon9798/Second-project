import sharp from "sharp";
import toIco from "to-ico";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));

const sizes = [
  { file: "src/app/icon.png", size: 32 },
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "public/favicon-32.png", size: 32 },
  { file: "public/favicon-16.png", size: 16 },
];

for (const { file, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(root, file));
  console.log("wrote", file);
}

// Real multi-size ICO (Chrome requires valid ICO, not PNG renamed)
const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
const png48 = await sharp(svg).resize(48, 48).png().toBuffer();
const ico = await toIco([png16, png32, png48]);

for (const dest of ["src/app/favicon.ico", "public/favicon.ico"]) {
  writeFileSync(join(root, dest), ico);
  console.log("wrote", dest);
}

copyFileSync(join(root, "src/app/icon.svg"), join(root, "public/icon.svg"));
console.log("wrote public/icon.svg");
