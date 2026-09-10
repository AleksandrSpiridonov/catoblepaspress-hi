import type { QuartzTransformerPlugin } from "../types"
import { canonicalUrlForSlug } from "../../util/seo"

export const TranslationStatus: QuartzTransformerPlugin = () => ({
  name: "TranslationStatus",
  htmlPlugins: () => [
    () => (tree, file) => {
      if (file.data.frontmatter?.lang === "hi-IN") return
      const preserveTranslation = file.data.slug?.startsWith("publications/translations/") || file.data.frontmatter?.tags?.includes("перевод")
      const sourceLang = file.data.frontmatter?.lang ?? "ru-RU"
      if (file.data.frontmatter) file.data.frontmatter.lang = sourceLang
      tree.children.unshift({
        type: "element", tagName: "aside",
        properties: { className: ["translation-notice"], lang: "hi-IN" },
        children: [
          { type: "text", value: preserveTranslation
            ? "यह सामग्री रूसी अनुवाद में ही रखी गई है; इसे हिंदी में दोबारा अनूदित नहीं किया गया है। "
            : sourceLang === "ru-RU"
            ? "यह पृष्ठ रूसी मूल में है। इसका हिंदी अनुवाद अभी उपलब्ध नहीं है। "
            : "यह पृष्ठ मूल भाषा में है। इसका हिंदी अनुवाद अभी उपलब्ध नहीं है। " },
          { type: "element", tagName: "a",
            properties: { href: canonicalUrlForSlug("catoblepaspress.ru", file.data.slug ?? "index") },
            children: [{ type: "text", value: "मुख्य वेबसाइट पर पढ़ें" }] },
        ],
      })
    },
  ],
})
