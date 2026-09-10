import { TranslationStatus } from "./quartz/plugins/transformers/translationStatus"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import CustomFooter from "./quartz/components/CustomFooter"
import LegacyOgImage from "./quartz/components/LegacyOgImage"
import { componentRegistry } from "./quartz/components/registry"
import { MediaAltText } from "./quartz/plugins/transformers/mediaAltText"
import type { ExplorerOptions } from "@quartz-community/explorer"

const priorityOrder: Record<string, number> = {
  "Книжный клуб": 1,
  Киноклуб: 2,
  "Об издательстве": 3,
  Контакты: 4,
  Документы: 5,
}

const sortExplorerEntries: NonNullable<ExplorerOptions["sortFn"]> = (a, b) => {
  if (a.isFolder !== b.isFolder) {
    return a.isFolder ? -1 : 1
  }

  const aName = a.displayName ?? ""
  const bName = b.displayName ?? ""
  const priorityDifference =
    (priorityOrder[aName] ?? Number.MAX_SAFE_INTEGER) -
    (priorityOrder[bName] ?? Number.MAX_SAFE_INTEGER)

  return (
    priorityDifference ||
    aName.localeCompare(bName, "hi", {
      numeric: true,
      sensitivity: "base",
    })
  )
}

ExternalPlugin.Explorer({
  sortFn: sortExplorerEntries,
})

componentRegistry.setOptionOverrides("@quartz-community/og-image", {
  colorScheme: "darkMode",
  readingTimeText: () => "",
  imageStructure: LegacyOgImage,
})

const footer = CustomFooter({
  copyrightText: "© 2025–2026 कातोब्लेपस प्रकाशन",
  links: {
    Telegram: "https://t.me/catoblepaspress",
    YouTube: "https://www.youtube.com/@catoblepaspress",
    "दस्तावेज़ (रूसी)": "https://catoblepaspress.ru/documents/",
  },
})

const layoutOverrides = {
  defaults: {
    footer: [footer],
  },
  byPageType: {
    content: { footer: [footer] },
    folder: { footer: [footer] },
    tag: { footer: [footer] },
    "404": { footer: [footer] },
  },
}

const config = await loadQuartzConfig(undefined, layoutOverrides)
config.plugins.transformers.push(MediaAltText(), TranslationStatus())
export default config
export const layout = await loadQuartzLayout(layoutOverrides)
