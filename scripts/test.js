import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "../dist");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \u2713 ${message}`);
    passed++;
  } else {
    console.error(`  \u2717 ${message}`);
    failed++;
  }
}

console.log("Validating build outputs...\n");

// ── Files exist ─────────────────────────────────────────────────────

const files = [
  "kinesis.css",
  "kinesis.tailwind.css",
  "kinesis.js",
  "kinesis.d.ts",
];

for (const file of files) {
  const filePath = path.join(dist, file);
  assert(fs.existsSync(filePath), `${file} exists`);
  assert(
    fs.statSync(filePath).size > 0,
    `${file} is not empty (${fs.statSync(filePath).size} bytes)`
  );
}

// ── Read files ──────────────────────────────────────────────────────

const rawCSS = fs.readFileSync(path.join(dist, "kinesis.css"), "utf-8");
const twCSS = fs.readFileSync(path.join(dist, "kinesis.tailwind.css"), "utf-8");
const js = fs.readFileSync(path.join(dist, "kinesis.js"), "utf-8");
const dts = fs.readFileSync(path.join(dist, "kinesis.d.ts"), "utf-8");

// ── Raw CSS ─────────────────────────────────────────────────────────

assert(rawCSS.includes(":root {"), "kinesis.css uses :root {}");
assert(!rawCSS.includes("@theme"), "kinesis.css has no @theme");
assert(!rawCSS.includes("@utility"), "kinesis.css has no @utility");

// ── Tailwind v4 CSS ─────────────────────────────────────────────────

assert(twCSS.includes("@theme {"), "kinesis.tailwind.css uses @theme {}");
assert(!twCSS.includes(":root {"), "kinesis.tailwind.css has no :root {}");
assert(
  twCSS.includes("@utility ease-*"),
  "kinesis.tailwind.css has ease-* utility"
);
assert(
  twCSS.includes("@utility animate-easing-*"),
  "kinesis.tailwind.css has animate-easing-* utility"
);

// ── JS Module ───────────────────────────────────────────────────────

assert(
  js.includes("export const easings"),
  "kinesis.js exports easings object"
);
assert(js.includes("export default easings"), "kinesis.js has default export");
assert(js.includes("/**"), "kinesis.js preserves JSDoc comments");

// ── TypeScript Declarations ─────────────────────────────────────────

assert(
  dts.includes("export declare const easings"),
  "kinesis.d.ts declares easings"
);
assert(
  dts.includes("export default easings"),
  "kinesis.d.ts has default export"
);
assert(dts.includes("readonly "), "kinesis.d.ts uses readonly properties");
assert(dts.includes("/**"), "kinesis.d.ts preserves JSDoc comments");

// ── Token parity across outputs ─────────────────────────────────────

const cssCount = (rawCSS.match(/--ease-[\w-]+:/g) || []).length;
const twCount = (twCSS.match(/--ease-[\w-]+:/g) || []).length;
const jsKeys = (js.match(/^\s+\w+:\s*"/gm) || []).length;
const dtsKeys = (dts.match(/readonly\s+\w+:\s*string/g) || []).length;

assert(cssCount > 70, `Token count > 70 (found ${cssCount})`);
assert(
  cssCount === twCount,
  `CSS (${cssCount}) = Tailwind (${twCount}) token count`
);
assert(cssCount === jsKeys, `CSS (${cssCount}) = JS (${jsKeys}) token count`);
assert(
  cssCount === dtsKeys,
  `CSS (${cssCount}) = DTS (${dtsKeys}) token count`
);

// ── Source integrity ────────────────────────────────────────────────

const src = fs.readFileSync(
  path.resolve(__dirname, "../src/kinesis.css"),
  "utf-8"
);
assert(rawCSS === src, "dist/kinesis.css is identical to src/kinesis.css");

// ── Tailwind v4 Integration Test ────────────────────────────────────

console.log("\nRunning Tailwind v4 Integration Test...");

const tmpDir = path.join(__dirname, "../tmp-test");
fs.mkdirSync(tmpDir, { recursive: true });

const tmpCssPath = path.join(tmpDir, "input.css");
const tmpHtmlPath = path.join(tmpDir, "index.html");
const tmpOutPath = path.join(tmpDir, "output.css");

fs.writeFileSync(
  tmpCssPath,
  `@import "tailwindcss";\n@import "../dist/kinesis.tailwind.css";\n@import "tailwind-animations";`
);

fs.writeFileSync(
  tmpHtmlPath,
  `<div class="animate-fade-in ease-spring-bouncy animate-duration-slow"></div>`
);

try {
  execSync(`npx @tailwindcss/cli -i ${tmpCssPath} -o ${tmpOutPath}`, {
    stdio: "ignore",
  });
  const outCSS = fs.readFileSync(tmpOutPath, "utf-8");
  assert(
    outCSS.includes("--ease-spring-bouncy"),
    "Compiled CSS includes Kinesis tokens"
  );
  assert(
    outCSS.includes(".ease-spring-bouncy"),
    "Compiled CSS includes Kinesis utility classes"
  );
  assert(
    outCSS.includes(".animate-fade-in"),
    "Compiled CSS includes tailwind-animations classes"
  );
} catch (error) {
  assert(false, `Tailwind integration test failed: ${error.message}`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// ── Summary ─────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
