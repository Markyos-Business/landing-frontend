import fs from "node:fs/promises";
import sharp from "sharp";

// Render the existing vector identity, without external fonts or image services.
const brand = new URL("../public/brand/", import.meta.url);
for (const locale of ["ar", "en"]) {
  let vector = await fs.readFile(new URL(
    locale === "ar" ? "markyos-lockup-ar.svg" : "markyos-lockup-white.svg", brand,
  ), "utf8");
  if (locale === "ar") vector = vector.replace("<svg ", '<svg fill="#fff" ');
  const logo = await sharp(Buffer.from(vector)).resize({ width: 800, height: 230, fit: "inside" }).png().toBuffer();
  const size = await sharp(logo).metadata();
  const address = Buffer.from('<svg width="1200" height="100"><text x="600" y="55" text-anchor="middle" fill="white" font-family="sans-serif" font-size="32">markyos.com</text></svg>');
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#09090b" } })
    .composite([
      { input: logo, left: Math.round((1200 - size.width) / 2), top: Math.round((530 - size.height) / 2) },
      { input: address, left: 0, top: 470 },
    ]).png().toFile(new URL(`og-${locale}.png`, brand).pathname);
}
