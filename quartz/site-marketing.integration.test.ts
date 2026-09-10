import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { yandexMetrikaScript } from "./util/analytics"
import { canonicalUrlForSlug } from "./util/seo"

test("production homepage exposes the canonical marketing and analytics contract", () => {
  assert.equal(canonicalUrlForSlug("catoblepaspress.ru", "index"), "https://catoblepaspress.ru/")
  assert.equal(
    canonicalUrlForSlug("catoblepaspress.ru", "published/biastape"),
    "https://catoblepaspress.ru/published/biastape",
  )

  const javascript = yandexMetrikaScript(111323493)
  assert.match(javascript, /mc\.yandex\.ru\/metrika\/tag\.js\?id=111323493/)
  assert.match(javascript, /ym\(111323493,\s*["']init["']/)
  assert.match(javascript, /catoblepas_cookie_consent/)
  assert.match(javascript, /catoblepas_age_confirmed/)
  assert.match(javascript, /setAttribute\(["']role["'], ["']dialog["']\)/)
  assert.match(javascript, /setAttribute\(["']aria-modal["'], ["']true["']\)/)
  assert.match(javascript, /data-age-confirm/)
  assert.match(javascript, />Мне уже исполнилось 18 лет<\/button>/)
  assert.match(javascript, /data-cookie-consent-grant/)
  assert.match(javascript, />Разрешить аналитику<\/button>/)
  assert.match(javascript, />Отключить аналитику<\/button>/)
  assert.match(javascript, /data-cookie-consent-close/)
  assert.match(javascript, /aria-label="Закрыть"/)
  assert.doesNotMatch(javascript, /data-cookie-choice/)
  assert.match(javascript, /webvisor:\s*false/)
  assert.doesNotMatch(javascript, /webvisor:\s*true/)
  assert.match(javascript, /addEventListener\(["']nav["']/)
  assert.match(javascript, /reachGoal/)
})

test("Hindi homepage keeps reading, club and contact routes", () => {
  const homepage = readFileSync(join(process.cwd(), "content", "index.md"), "utf8")
  for (const target of ["published/biastape#Заказать", "journal/index", "projects/filmclub", "projects/bookclub"]) assert.ok(homepage.includes("[[" + target + "|"))
  assert.match(homepage, /lang: hi-IN/)
  assert.match(homepage, /mailto:vox@catoblepaspress.ru/)
  assert.match(homepage, /mailto:ungh@catoblepaspress.ru/)
})
