import fs from "node:fs"
import path from "node:path"
import { build } from "esbuild"
import hi from "../quartz/i18n/locales/hi-IN"

// Quartz 5 plugins bundle their own locale registries. Add Hindi after every npm ci.
const locale = {
  ...hi,
  components: {
    ...hi.components,
    search: { ...hi.components.search, noResults: "कोई परिणाम नहीं मिला।", noResultsHint: "कोई दूसरा शब्द खोजें।", tagFilterHint: "टैग से छाँटें", noTagsFound: "कोई मेल खाता टैग नहीं मिला" },
    noteProperties: { title: "गुण" },
    bases: { title: "संग्रह", noData: "कोई सामग्री नहीं मिली।", noViews: "कोई दृश्य तय नहीं है।", mapPlaceholder: "स्थिर वेबसाइट पर मानचित्र उपलब्ध नहीं है।", allNotes: "सभी पृष्ठ", allEntries: "सभी प्रविष्टियाँ", galleryView: "गैलरी", boardView: "बोर्ड", noImage: "चित्र उपलब्ध नहीं है", uncategorized: "बिना श्रेणी", showingCount: "{total} में से {count} प्रविष्टियाँ" },
  },
}
function serialize(value: unknown): string {
  if (typeof value === "function") return value.toString()
  if (value && typeof value === "object") return `{${Object.entries(value).map(([key, item]) => `${JSON.stringify(key)}:${serialize(item)}`).join(",")}}`
  return JSON.stringify(value)
}
const root = "node_modules/@quartz-community"
let patched = 0
for (const file of fs.readdirSync(root, { recursive: true }) as string[]) {
  if (!file.endsWith(".js")) continue
  const target = path.join(root, file)
  const source = fs.readFileSync(target, "utf8")
  if (!source.includes('"en-US": en_US_default,') || source.includes('"hi-IN":')) continue
  fs.writeFileSync(target, source.replace('"en-US": en_US_default,', `"hi-IN": ${serialize(locale)},\n  "en-US": en_US_default,`))
  patched++
}
await build({ entryPoints: ["plugins/language-switcher/src/components.tsx"], outfile: "plugins/language-switcher/dist/components/index.js", bundle: true, format: "esm", platform: "neutral", packages: "external", jsx: "automatic", jsxImportSource: "preact" })
console.log(`Hindi: patched ${patched} plugin bundles and built language switcher.`)
