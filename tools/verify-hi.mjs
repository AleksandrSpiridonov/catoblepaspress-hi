import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"
import { slugifyFilePath } from "@quartz-community/utils"
import YAML from "yaml"

const config = YAML.parse(fs.readFileSync("quartz.config.yaml", "utf8")).configuration
const base = new URL(`https://${config.baseUrl}/`)
const pages = fs.readdirSync("content", { recursive: true }).filter(file => file.endsWith(".md") && /\nlang: hi-IN\r?\n/.test(fs.readFileSync(path.join("content", file), "utf8")))
assert.equal(pages.length, 9)
const problems = []
for (const file of pages) {
  const slug = slugifyFilePath(file.replaceAll("\\", "/"))
  const html = fs.readFileSync(path.join("public", slug + ".html"), "utf8")
  assert.match(html, /<html lang="hi-IN"/)
  assert.doesNotMatch(html, /class="translation-notice"/)
  const canonical = new URL(slug === "index" ? "" : slug.replace(/\/index$/, "/"), base)
  visit(fromHtml(html), "element", node => {
    if (node.tagName === "link" && node.properties.rel?.includes("canonical")) assert.equal(node.properties.href, canonical.href)
    if (node.tagName !== "a" || typeof node.properties.href !== "string") return
    const url = new URL(node.properties.href, canonical)
    if (url.origin !== base.origin) return
    if (!url.pathname.startsWith(base.pathname)) { problems.push(`${slug}: outside site prefix ${url}`); return }
    const target = decodeURIComponent(url.pathname.slice(base.pathname.length))
    const found = [target, target + ".html", path.join(target, "index.html")].map(p => path.join("public", p)).find(p => fs.existsSync(p) && fs.statSync(p).isFile())
    if (!found) problems.push(`${slug}: missing ${url}`)
    else if (url.hash && found.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1))
      let exists = false
      visit(fromHtml(fs.readFileSync(found, "utf8")), "element", n => { if (n.properties.id === id) exists = true })
      if (!exists) problems.push(`${slug}: missing anchor ${url}`)
    }
  })
}
assert.deepEqual(problems, [])
const original = fs.readFileSync("public/published/biastape.html", "utf8")
assert.match(original, /<html lang="ru-RU"/)
assert.match(original, /इसका हिंदी अनुवाद अभी उपलब्ध नहीं है/)
assert.match(original, /href="https:\/\/catoblepaspress.ru\/published\/biastape"/)
const homepage = fs.readFileSync("public/index.html", "utf8")
assert.match(homepage, /खोजें/)
assert.match(homepage, /विषय-सूची|सामग्री/)
assert.equal(fs.existsSync("public/CNAME"), false)
const scripts = fs.readdirSync("public", { recursive: true }).filter(f => f.endsWith(".js")).map(f => fs.readFileSync(path.join("public", f), "utf8")).join("\n")
assert.doesNotMatch(scripts, /mc\.yandex\.ru/)
assert.match(scripts, /catoblepas_hi_age_confirmed/)
console.log(`Verified ${pages.length} Hindi pages, canonical URLs, internal links and anchors, Russian fallback, Hindi interface, and analytics isolation.`)
