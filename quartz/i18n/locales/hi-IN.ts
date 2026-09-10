import { Translation } from "./definition"

export default {
  propertyDefaults: { title: "बिना शीर्षक", description: "कोई विवरण उपलब्ध नहीं है" },
  components: {
    callout: {
      note: "नोट", abstract: "सारांश", info: "जानकारी", todo: "करने के लिए",
      tip: "सुझाव", success: "सफलता", question: "प्रश्न", warning: "चेतावनी",
      failure: "विफलता", danger: "खतरा", bug: "त्रुटि", example: "उदाहरण", quote: "उद्धरण",
    },
    backlinks: { title: "इस पृष्ठ के लिंक", noBacklinksFound: "कोई लिंक नहीं मिला" },
    themeToggle: { lightMode: "हल्का रंग", darkMode: "गहरा रंग" },
    readerMode: { title: "पठन मोड" },
    explorer: { title: "सामग्री" },
    footer: { createdWith: "इससे बनाया गया" },
    graph: { title: "संबंधों का मानचित्र" },
    recentNotes: { title: "हाल के पृष्ठ", seeRemainingMore: ({ remaining }) => `${remaining} और देखें →` },
    transcludes: { transcludeOf: ({ targetSlug }) => `${targetSlug} से अंश`, linkToOriginal: "मूल पृष्ठ" },
    search: { title: "खोजें", searchBarPlaceholder: "यहाँ खोजें" },
    tableOfContents: { title: "विषय-सूची" },
    contentMeta: { readingTime: ({ minutes }) => `पढ़ने में ${minutes} मिनट` },
    footnotes: { title: "पादटिप्पणियाँ" },
  },
  pages: {
    rss: { recentNotes: "हाल के पृष्ठ", lastFewNotes: ({ count }) => `पिछले ${count} पृष्ठ` },
    error: { title: "पृष्ठ नहीं मिला", notFound: "यह पृष्ठ निजी है या मौजूद नहीं है।", home: "मुखपृष्ठ पर लौटें" },
    folderContent: { folder: "फ़ोल्डर", itemsUnderFolder: ({ count }) => `इस फ़ोल्डर में ${count} पृष्ठ हैं।` },
    tagContent: {
      tag: "टैग", tagIndex: "टैग सूची", itemsUnderTag: ({ count }) => `इस टैग के अंतर्गत ${count} पृष्ठ हैं।`,
      showingFirst: ({ count }) => `पहले ${count} टैग दिखाए जा रहे हैं।`, totalTags: ({ count }) => `कुल ${count} टैग मिले।`,
    },
  },
} as const satisfies Translation
