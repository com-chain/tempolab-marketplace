// Génère une image SVG "de marque" par produit : dégradé propre à
// l'organisation vendeuse + son vrai logo + le titre du produit. Utilisé à la
// place de photos génériques d'un service tiers (peu fiable) : ceci ne
// dépend d'aucun réseau, s'affiche toujours, et montre une vraie identité.
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../public");

function logoDataUri(publicPath) {
  const filePath = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1);
  const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapText(title, maxCharsPerLine = 22, maxLines = 3) {
  const words = title.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines - 1 && candidate.length > maxCharsPerLine) break;
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

export function generateProductArt({ title, emoji, logoPath, gradient, outFile }) {
  const [from, to] = gradient;
  const logo = logoDataUri(logoPath);
  const lines = wrapText(title);
  const lineHeight = 40;
  const textBlockHeight = lines.length * lineHeight + 30;
  const textBlockY = 400 - textBlockHeight - 20;

  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="40" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg)"/>
  <text x="560" y="180" font-size="220" text-anchor="end" opacity="0.18" font-family="'Apple Color Emoji','Segoe UI Emoji',sans-serif">${emoji}</text>
  <rect x="24" y="24" width="180" height="96" rx="14" fill="white" opacity="0.96"/>
  <image x="36" y="36" width="156" height="72" href="${logo}" preserveAspectRatio="xMidYMid meet"/>
  <rect x="0" y="${textBlockY}" width="600" height="${textBlockHeight}" fill="black" opacity="0.38"/>
  <text x="40" y="${textBlockY + 42}" font-size="30" font-weight="700" fill="white" font-family="Arial, Helvetica, sans-serif">${tspans}</text>
</svg>`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, svg, "utf8");
  return `/generated/products/${path.basename(outFile)}`;
}
