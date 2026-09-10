import { createHash } from "node:crypto"
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
assert.equal(pages.length, 38)
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
const original = fs.readFileSync("public/publications/translations/index.html", "utf8")
assert.match(original, /<html lang="ru-RU"/)
assert.match(original, /इसे हिंदी में दोबारा अनूदित नहीं किया गया है/)
assert.match(original, /href="https:\/\/catoblepaspress.ru\/publications\/translations\/"/)
const homepage = fs.readFileSync("public/index.html", "utf8")
assert.match(homepage, /खोजें/)
assert.match(homepage, /विषय-सूची|सामग्री/)
const catalogue = fs.readFileSync("public/published/index.html", "utf8")
assert.match(catalogue, /5 में से 5 प्रविष्टियाँ/)
assert.doesNotMatch(catalogue, /Showing 5 of 5 entries|Показано 5 из 5/)
assert.equal(fs.readFileSync("public/CNAME", "utf8").trim(), base.hostname)
const scripts = fs.readdirSync("public", { recursive: true }).filter(f => f.endsWith(".js")).map(f => fs.readFileSync(path.join("public", f), "utf8")).join("\n")
assert.doesNotMatch(scripts, /mc\.yandex\.ru/)
assert.match(scripts, /catoblepas_hi_age_confirmed/)
console.log(`Verified ${pages.length} Hindi pages, canonical URLs, internal links and anchors, Russian fallback, Hindi interface, and analytics isolation.`)

const preserved = JSON.parse(fs.readFileSync("tools/untranslated-sources.json", "utf8"))
for (const [file, expected] of Object.entries(preserved.files)) {
  const actual = createHash("sha256").update(fs.readFileSync(file, "utf8").replaceAll("\r\n", "\n")).digest("hex")
  assert.equal(actual, expected, file + ": excluded translation changed")
}
const excerpt = fs.readFileSync("content/publications/almighty.md", "utf8")
assert.match(excerpt, /translation_scope: excerpt/)
assert.match(excerpt, /अध्याय 1 — आरंभिक अंश/)
assert.doesNotMatch(excerpt, /^## (?:Глава|अध्याय) [2-9]/m)
assert.ok(excerpt.length < 12000, "Almighty must remain a short opening excerpt")
assert.match(excerpt, /सभी प्रश्नों के लिए प्रकाशन से संपर्क करें/)
assert.match(excerpt, /mailto:ungh@catoblepaspress.ru/)
assert.match(excerpt, /पूरा रूसी पाठ पढ़ें →\]\(https:\/\/catoblepaspress.ru\/publications\/almighty\)/)
console.log("Verified excluded translations and bounded Almighty excerpt with publisher contact and full Russian text link.")

for (const [club, expected] of [["bookclub", 27], ["filmclub", 43]]) {
  const html = fs.readFileSync("public/projects/" + club + ".html", "utf8")
  let rows = 0
  visit(fromHtml(html), "element", node => {
    if (node.tagName !== "tr") return
    const cells = node.children.filter(n => n.type === "element" && n.tagName === "td")
    if (!cells.length) return
    assert.equal(cells.length, 6, club + ": malformed table row")
    rows++
  })
  assert.equal(rows, expected, club + ": missing historical entries")
  assert.match(html, /id="присоединиться"/)
}
const vox = fs.readFileSync("public/projects/voxcatoblepae.html", "utf8")
assert.equal((vox.match(/class="issue-page"/g) ?? []).length, 16)
assert.match(vox, /वीडियो, ध्वनि और पृष्ठों की छवियाँ अपनी मूल भाषा में हैं/)
assert.match(vox, /2025 के आमंत्रण का अभिलेख/)
console.log("Verified 27 book meetings, 43 film meetings, 16 anthology pages and archived call labelling.")
