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

/** Extract category blocks (JSDoc with @category, not followed by a variable) */
function extractCategories(css) {
  const regex = /\/\*\*\s*\n\s*\*\s*@category\s+(.*?)(?:\n[\s\S]*?)?\s*\*\//g;
  const categories = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    categories.push({ name: match[1].trim(), index: match.index });
  }
  return categories;
}

/** Extract variable entries: JSDoc comment + --ease-* declaration */
function extractEntries(css) {
  const regex = /(\/\*\*[\s\S]*?\*\/)\s*\n\s*(--ease-([\w-]+):\s*([^;]+));/g;
  const entries = [];
  let match;
  while ((match = regex.exec(css)) !== null) {
    let jsdoc = match[1];

    // When the regex spans a category block + variable block, extract
    // just the variable's JSDoc (the last block in the captured group)
    if (jsdoc.includes("@category")) {
      const blocks = jsdoc.match(/\/\*\*[\s\S]*?\*\//g);
      if (blocks && blocks.length > 1) {
        jsdoc = blocks[blocks.length - 1];
      } else {
        continue;
      }
    }

    entries.push({
      jsdoc,
      name: match[2],
      camelName: match[3].replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()),
      value: match[4].trim(),
      index: match.index,
    });
  }
  return entries;
}

/** Find the category a given entry belongs to (by source position) */
function findCategory(entry, categories) {
  let cat = null;
  for (const c of categories) {
    if (c.index < entry.index) cat = c;
  }
  return cat;
}

/** Normalize JSDoc indentation to standard format at a target indent level */
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

const fileHeader = `/**
 * Kinesis — Motion tokens designed around how things feel.
 *
 * @see https://timwickstrom.com/projects/kinesis
 * @license MIT
 */

`;

let jsOutput = fileHeader + "export const easings = {\n";
let currentCategory = null;

for (const entry of entries) {
  const cat = findCategory(entry, categories);
  if (cat && cat !== currentCategory) {
    currentCategory = cat;
    jsOutput += `\n  // ── ${cat.name} ──\n\n`;
  }

  jsOutput += formatJsdoc(entry.jsdoc) + "\n";
  jsOutput += `  ${entry.camelName}: "${entry.value}",\n`;
}

jsOutput += "};\n\nexport default easings;\n";

fs.writeFileSync(path.join(distDir, "kinesis.js"), jsOutput);

// ── 4. TypeScript Declarations ──────────────────────────────────────

let dtsOutput = fileHeader + "export declare const easings: {\n";
currentCategory = null;

for (const entry of entries) {
  const cat = findCategory(entry, categories);
  if (cat && cat !== currentCategory) {
    currentCategory = cat;
    dtsOutput += `\n  // ── ${cat.name} ──\n\n`;
  }

  dtsOutput += formatJsdoc(entry.jsdoc) + "\n";
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
