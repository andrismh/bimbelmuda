import { createHighlighter } from "shiki";
import { Marked } from "marked";

const THEME = "github-dark";
const LANGS = [
  "python", "javascript", "typescript", "bash", "sh",
  "json", "sql", "html", "css", "markdown", "plaintext",
  "r", "java", "cpp", "c", "yaml", "toml", "rust", "go",
];

let highlighter = null;

async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({ themes: [THEME], langs: LANGS });
  }
  return highlighter;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function renderMarkdown(rawContent) {
  const hl = await getHighlighter();

  const instance = new Marked();

  instance.use({
    renderer: {
      code({ text, lang }) {
        if (lang === "output") {
          return `<div class="code-output"><span class="code-output-label">Output</span><pre>${escapeHtml(text)}</pre></div>`;
        }
        if (lang === "chart") {
          const encoded = encodeURIComponent(text);
          return `<div class="plotly-chart" data-chart="${encoded}"></div>`;
        }

        const language = LANGS.includes(lang) ? lang : "plaintext";
        try {
          return hl.codeToHtml(text, { lang: language, theme: THEME });
        } catch {
          return hl.codeToHtml(text, { lang: "plaintext", theme: THEME });
        }
      },
    },
  });

  return instance.parse(rawContent);
}

export function stripMarkdown(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]+/g, "")
    .replace(/>\s+/g, "")
    .replace(/\n+/g, " ")
    .trim();
}
