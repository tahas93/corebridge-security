import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "src");
const INCLUDE_EXT = new Set([".tsx", ".ts"]);

const IGNORE_FILES = new Set([
  path.resolve(ROOT, "content/index.ts"),
  path.resolve(ROOT, "components/icons/CyberIcons.tsx"),
  path.resolve(ROOT, "components/visual/CyberBackground.tsx"),
  path.resolve(ROOT, "components/visual/DashboardIllustration.tsx"),
  path.resolve(ROOT, "components/visual/Particles.tsx"),
  path.resolve(ROOT, "components/layout/ScrollReveal.tsx"),
]);

const allowPatterns = [
  /className=/,
  /from-[a-z]/,
  /to-[a-z]/,
  /bg-[a-z]/,
  /text-[a-z]/,
  /aria-hidden/,
  /role=/,
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (INCLUDE_EXT.has(path.extname(fullPath))) files.push(fullPath);
  }
  return files;
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//")) return;

    const hasJsxText = />\s*[A-Za-z0-9&][^<{]*<\/?[A-Za-z{]/.test(line);
    const hasLikelyUiLiteral =
      /aria-label="[^"]*[A-Za-z][^"]*"|placeholder="[^"]*[A-Za-z][^"]*"/.test(line);

    if (!hasJsxText && !hasLikelyUiLiteral) return;
    if (trimmed.includes("content.") || trimmed.includes("getContent(")) return;
    if (allowPatterns.some((p) => p.test(trimmed))) return;

    findings.push({ line: idx + 1, content: trimmed });
  });

  return findings;
}

const files = walk(ROOT).filter((f) => !IGNORE_FILES.has(f));
const allFindings = [];

for (const file of files) {
  const findings = scanFile(file);
  if (findings.length > 0) {
    allFindings.push({ file, findings });
  }
}

if (allFindings.length > 0) {
  console.error("Potential hardcoded UI text found:\n");
  allFindings.forEach((item) => {
    console.error(path.relative(process.cwd(), item.file));
    item.findings.forEach((f) => {
      console.error(`  L${f.line}: ${f.content}`);
    });
  });
  process.exit(1);
}

console.log("No hardcoded UI text found.");
