import fs from "node:fs";
import path from "node:path";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const contentDir = path.resolve(process.cwd(), "src/content");
const requiredFiles = [
  "common.json",
  "header.json",
  "home.json",
  "pages.json",
  "footer.json",
  "forms.json",
  "errors.json",
  "datasets.json",
  "tooltips.json",
  "index.ts",
];

requiredFiles.forEach((file) => {
  assert(fs.existsSync(path.join(contentDir, file)), `Missing content file: ${file}`);
});

const common = JSON.parse(fs.readFileSync(path.join(contentDir, "common.json"), "utf8"));
const header = JSON.parse(fs.readFileSync(path.join(contentDir, "header.json"), "utf8"));
const home = JSON.parse(fs.readFileSync(path.join(contentDir, "home.json"), "utf8"));
const datasets = JSON.parse(fs.readFileSync(path.join(contentDir, "datasets.json"), "utf8"));

assert(hasText(common.common?.brandName), "common.brandName is required");
assert(hasText(common.site?.description), "site.description is required");
assert(Array.isArray(header.primary) && header.primary.length > 0, "navigation.primary cannot be empty");
assert(hasText(home.hero?.titlePrefix), "home.hero.titlePrefix is required");
assert(Array.isArray(datasets.services) && datasets.services.length > 0, "datasets.services cannot be empty");
assert(Array.isArray(datasets.caseStudies) && datasets.caseStudies.length > 0, "datasets.caseStudies cannot be empty");

console.log("Content validation passed.");
