import type { SocialImageOptions } from "@quartz-community/og-image"
import type { Theme } from "../util/theme"
import { ogWatercolorRail } from "./ogWatercolorRail"

const fontName = (font: string | { name: string }) => (typeof font === "string" ? font : font.name)

function sectionLabel(slug: string, english: boolean) {
  const path = slug.replace(/^\/+|\/+$/g, "").replace(/\/index$/, "")
  const section = path.split("/")[0]
  if (path.split("/").includes("translations")) return english ? "TRANSLATIONS" : "अनुवाद"
  const labels: Record<string, [string, string, string, string]> = {
    interviews: ["साक्षात्कार", "साक्षात्कार", "INTERVIEW", "INTERVIEWS"],
    authors: ["लेखक", "लेखक", "AUTHOR", "AUTHORS"],
    published: ["पुस्तक", "पुस्तकें", "BOOK", "BOOKS"],
    publications: ["रचना", "रचनाएँ", "PUBLICATION", "PUBLICATIONS"],
    projects: ["परियोजना", "परियोजनाएँ", "PROJECT", "PROJECTS"],
    documents: ["दस्तावेज़", "दस्तावेज़", "DOCUMENT", "DOCUMENTS"],
    journal: ["पत्रिका", "पत्रिका", "JOURNAL", "JOURNAL"],
    translations: ["अनुवाद", "अनुवाद", "TRANSLATIONS", "TRANSLATIONS"],
  }
  if (!path || path === "index" || path === "about")
    return english ? "PUBLISHING HOUSE" : "प्रकाशन"
  return (
    labels[section]?.[(english ? 2 : 0) + (path === section ? 1 : 0)] ??
    (english ? "CATOBLEPAS" : "कातोब्लेपस")
  )
}

const LegacyOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  title,
  description,
  fileData,
}) => {
  const theme = cfg.theme as Theme
  const locale = cfg.locale ?? "ru-RU"
  const english = locale.startsWith("en")
  // Preserve the existing date priority.
  const date = (
    fileData.dates?.modified ??
    fileData.dates?.published ??
    fileData.dates?.created
  )?.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  const tag = fileData.frontmatter?.tags?.[0]
  const titleSize =
    title.length > 180
      ? 30
      : title.length > 120
        ? 36
        : title.length > 70
          ? 44
          : title.length > 35
            ? 50
            : 62
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#16171b",
        color: "#f8f7f2",
        fontFamily: fontName(theme.typography.body),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "26%",
          flexShrink: 0,
          padding: "46px 36px",
          backgroundColor: "#eef0f8",
          position: "relative",
          color: "#294878",
        }}
      >
        <img
          src={ogWatercolorRail}
          width={312}
          height={630}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontFamily: fontName(theme.typography.header),
              fontSize: 24,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {english ? "CATOBLEPAS" : "कातोब्लेपस"}
          </div>
          <div style={{ display: "flex", color: "#526585", fontSize: 17 }}>{cfg.baseUrl}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "74%",
          padding: "46px 46px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#8da9ff",
          }}
        >
          {sectionLabel(String(fileData.slug ?? ""), english)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            paddingTop: 32,
            paddingBottom: 24,
          }}
        >
          <h1
            style={{
              display: "-webkit-box",
              margin: 0,
              fontFamily: fontName(theme.typography.header),
              fontSize: titleSize,
              lineHeight: 1.12,
              fontWeight: 700,
              WebkitLineClamp: 5,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              display: "-webkit-box",
              margin: "24px 0 0",
              fontSize: 27,
              lineHeight: 1.35,
              color: "#c9c9cf",
              WebkitLineClamp: title.length > 120 ? 2 : 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            minHeight: 55,
            paddingTop: 16,
            borderTop: "1px solid #34353a",
          }}
        >
          <div style={{ display: "flex", fontSize: 21, color: "#85868d" }}>{date ?? ""}</div>
          {tag && (
            <div
              style={{
                display: "flex",
                maxWidth: "55%",
                padding: "7px 14px",
                borderRadius: 22,
                backgroundColor: "#272d3d",
                color: "#b8c7fb",
                fontSize: 20,
              }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                #{tag}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LegacyOgImage
