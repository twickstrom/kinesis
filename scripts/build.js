import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcPath = path.join(root, "src/kinesis.css");
const distDir = path.join(root, "dist");

const source = fs.readFileSync(srcPath, "utf-8");
fs.mkdirSync(distDir, { recursive: true });

// ── Parse source into structured data ──────────────────────────────

// 1. Extract File Header (first JSDoc block in the file)
const fileHeaderMatch = source.match(/^\s*(\/\*\*[\s\S]*?\*\/)/);
const fileHeader = fileHeaderMatch ? fileHeaderMatch[1] + "\n\n" : "";

// 2. Extract Categories
function extractCategories(css) {
  // Find all JSDoc blocks that contain @category
  const regex = /(\/\*\*(?:(?!\*\/)[\s\S])*?@category[\s\S]*?\*\/)/g;
  const categories = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    categories.push({
      jsdoc: match[1],
      index: match.index,
    });
  }
  return categories;
}

// 3. Extract Entries
function extractEntries(css) {
  // Match the CSS variable declarations
  const regex = /(--ease-([\w-]+):\s*([^;]+));/g;
  const entries = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    const varIndex = match.index;
    // Find the JSDoc block immediately preceding this variable
    const textBefore = css.slice(0, varIndex);
    const lastJsdocStart = textBefore.lastIndexOf("/**");
    const lastJsdocEnd = textBefore.lastIndexOf("*/");

    let jsdoc = "";
    if (lastJsdocStart !== -1 && lastJsdocEnd > lastJsdocStart) {
      jsdoc = textBefore.slice(lastJsdocStart, lastJsdocEnd + 2);
    }

    entries.push({
      jsdoc,
      name: match[1],
      camelName: match[2].replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()),
      value: match[3].trim(),
      index: varIndex,
    });
  }
  return entries;
}

function findCategory(entryIndex, categories) {
  let cat = null;
  for (const c of categories) {
    if (c.index < entryIndex) cat = c;
  }
  return cat;
}

function formatJsdoc(jsdoc, indent = "  ") {
  return jsdoc
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed === "/**" || trimmed === "*/") return indent + trimmed;
      if (trimmed.startsWith("*")) return indent + " " + trimmed;
      return indent + trimmed;
    })
    .join("\n");
}

const categories = extractCategories(source);
const entries = extractEntries(source);

// ── 1. Raw CSS ─────────────────────────────────────────────────────

fs.writeFileSync(path.join(distDir, "kinesis.css"), source);

// ── 2. Tailwind v4 CSS ─────────────────────────────────────────────

const tailwindCSS =
  source.replace(":root {", "@theme {") +
  `
/**
 * Automatically wire up these easings to standard Tailwind classes
 */
@utility ease-* {
  transition-timing-function: --value(--ease-*);
}

@utility animate-easing-* {
  animation-timing-function: --value(--ease-*);
}
`;

fs.writeFileSync(path.join(distDir, "kinesis.tailwind.css"), tailwindCSS);

// ── 3. JS Module (ESM with JSDoc) ──────────────────────────────────

let jsOutput = fileHeader + "export const easings = {\n";
let currentCategory = null;

for (const entry of entries) {
  const cat = findCategory(entry.index, categories);
  if (cat && cat !== currentCategory) {
    currentCategory = cat;
    jsOutput += `\n${formatJsdoc(cat.jsdoc, "  ")}\n\n`;
  }

  jsOutput += formatJsdoc(entry.jsdoc, "  ") + "\n";
  jsOutput += `  ${entry.camelName}: "${entry.value}",\n`;
}

jsOutput += "};\n\nexport default easings;\n";

fs.writeFileSync(path.join(distDir, "kinesis.js"), jsOutput);

// ── 4. TypeScript Declarations ──────────────────────────────────────

let dtsOutput = fileHeader + "export declare const easings: {\n";
currentCategory = null;

for (const entry of entries) {
  const cat = findCategory(entry.index, categories);
  if (cat && cat !== currentCategory) {
    currentCategory = cat;
    dtsOutput += `\n${formatJsdoc(cat.jsdoc, "  ")}\n\n`;
  }

  dtsOutput += formatJsdoc(entry.jsdoc, "  ") + "\n";
  dtsOutput += `  readonly ${entry.camelName}: string;\n`;
}

dtsOutput += "};\n\nexport default easings;\n";

fs.writeFileSync(path.join(distDir, "kinesis.d.ts"), dtsOutput);

// ── Summary ─────────────────────────────────────────────────────────

console.log(`Built ${entries.length} easing tokens:`);
console.log("  dist/kinesis.css          (raw CSS)");
console.log("  dist/kinesis.tailwind.css (Tailwind v4)");
console.log("  dist/kinesis.js           (ESM)");
console.log("  dist/kinesis.d.ts         (TypeScript)");
