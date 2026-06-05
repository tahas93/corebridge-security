# Website content guide

All visible website text lives in this folder as JSON files. You do **not** need to edit React components to change copy.

## Files

| File | What to edit |
|------|----------------|
| `common.json` | Brand name, accessibility labels, loading text, site contact & SEO |
| `header.json` | Main navigation links and header buttons |
| `home.json` | Homepage sections (hero, services, testimonials, newsletter, dashboard mockup) |
| `pages.json` | About, Services, Solutions, Case Studies, Contact page copy |
| `footer.json` | Footer columns, legal links, social labels |
| `forms.json` | Contact form labels, placeholders, success/error messages |
| `errors.json` | 404 page copy |
| `datasets.json` | Services, solutions, stats, logos, testimonials, case studies |
| `tooltips.json` | Small UI symbols (breadcrumb separator, etc.) |

`index.ts` only combines these files for the app. Do not add marketing copy there.

## How to edit safely

1. Open the JSON file that matches the page or section you want to change.
2. Edit the **value** on the right side of the colon. Keep keys unchanged.
3. Save the file and refresh the site (`npm run dev`).
4. Run checks before publishing:
   ```bash
   npm run content:validate
   npm run content:check-text
   ```

## Examples

**Change the homepage hero headline** → `home.json` → `hero.titlePrefix` / `hero.titleHighlight`

**Change a service card** → `datasets.json` → `services` array → find the item by `id` (e.g. `"mdr"`)

**Change navigation** → `header.json` → `primary` array

**Change contact form button** → `forms.json` → `contact.send`

## Tips

- Use straight double quotes `"` in JSON (not curly quotes).
- Escape apostrophes inside strings normally: `"We're hiring..."`.
- Arrays use `[ ]` and objects use `{ }` — match the existing structure.
- For future languages, duplicate this folder per locale (e.g. `content/en/`, `content/fr/`).

## Developer access in code

```ts
import { content } from "@/lib/content";
// or
import { getContent } from "@/lib/content";
const title = getContent("home.hero.titlePrefix", "Fallback");
```

Components should read from `content` — never hardcode user-facing strings in `.tsx` files.
