// plugins/language-switcher/src/components.tsx
import { jsx } from "preact/jsx-runtime";
var styles = `.language-switcher {
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
}`;
var LanguageSwitcher = (opts) => {
  const Component = ({ fileData, displayClass }) => {
    const slug = (fileData.slug ?? "index").replace(/\/index$/, "/");
    const languages = [
      { label: "EN", name: "\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940 \u0938\u0902\u0938\u094D\u0915\u0930\u0923", base: opts.englishBaseUrl },
      {
        label: "RU",
        name: "\u0930\u0942\u0938\u0940 \u0938\u0902\u0938\u094D\u0915\u0930\u0923",
        base: opts.russianBaseUrl
      },
      {
        label: "\u4E2D\u6587",
        name: "\u091A\u0940\u0928\u0940 \u0938\u0902\u0938\u094D\u0915\u0930\u0923",
        base: opts.chineseBaseUrl
      }
    ];
    return /* @__PURE__ */ jsx(
      "nav",
      {
        class: displayClass ?? "",
        "aria-label": "\u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902",
        style: { display: "flex", gap: "0.5rem" },
        children: languages.map(({ label, name, base }) => {
          const url = new URL(base);
          url.pathname = url.pathname.replace(/\/$/, "") + (slug === "index" ? "/" : "/" + slug);
          return /* @__PURE__ */ jsx("a", { class: "language-switcher", href: url.toString(), "aria-label": name, title: name, children: label });
        })
      }
    );
  };
  Component.css = styles;
  return Component;
};
export {
  LanguageSwitcher
};
