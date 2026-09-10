import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

interface Options {
  englishBaseUrl: string
  russianBaseUrl: string
  chineseBaseUrl: string
}

const styles = `.language-switcher {
  align-items: center;
  background: none;
  border: none;
  color: var(--darkgray);
  display: inline-flex;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  letter-spacing: 0.04em;
  margin: 0;
  padding: 0;
  text-decoration: none;
  width: 24px;
}`

export const LanguageSwitcher: QuartzComponentConstructor<Options> = (opts) => {
  const Component: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = (fileData.slug ?? "index").replace(/\/index$/, "/")
    const languages = [
      { label: "EN", name: "अंग्रेज़ी संस्करण", base: opts.englishBaseUrl },
      {
        label: "RU",
        name: "रूसी संस्करण",
        base: opts.russianBaseUrl,
      },
      {
        label: "中文",
        name: "चीनी संस्करण",
        base: opts.chineseBaseUrl,
      },
    ]
    return (
      <nav
        class={displayClass ?? ""}
        aria-label="भाषा चुनें"
        style={{ display: "flex", gap: "0.5rem" }}
      >
        {languages.map(({ label, name, base }) => {
          const url = new URL(base)
          url.pathname = url.pathname.replace(/\/$/, "") + (slug === "index" ? "/" : "/" + slug)
          return (
            <a class="language-switcher" href={url.toString()} aria-label={name} title={name}>
              {label}
            </a>
          )
        })}
      </nav>
    )
  }

  Component.css = styles
  return Component
}
