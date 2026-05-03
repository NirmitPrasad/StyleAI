// Lightweight, safe markdown -> HTML for assistant chat bubbles.
// Strategy: escape ALL HTML first, then inject only our allow-listed tags
// from a small markdown subset (bold, italic, code, lists, links, line-breaks).
// This guarantees no user/model-provided HTML can execute.

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isSafeUrl = (url: string) => {
  const u = url.trim().toLowerCase();
  return u.startsWith("http://") || u.startsWith("https://") || u.startsWith("mailto:");
};

export const renderMarkdownSafe = (raw: string): string => {
  if (!raw) return "";
  // 1. Escape everything first so no raw HTML survives.
  let text = escapeHtml(raw);

  // 2. Code blocks ``` ```
  text = text.replace(/```([\s\S]*?)```/g, (_m, code) =>
    `<pre class="bg-background/60 rounded-lg p-2 my-1 overflow-x-auto text-xs"><code>${code.trim()}</code></pre>`
  );

  // 3. Inline code
  text = text.replace(/`([^`\n]+)`/g, '<code class="px-1 py-0.5 rounded bg-background/60 text-xs">$1</code>');

  // 4. Bold / italic
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  // 5. Links [label](url) — validate URL scheme
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) =>
    isSafeUrl(url)
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline text-primary">${label}</a>`
      : label
  );

  // 6. Bullet lists
  text = text.replace(/(?:^|\n)([-*]\s+.+(?:\n[-*]\s+.+)*)/g, (_m, block) => {
    const items = block
      .split(/\n/)
      .map((l: string) => l.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean)
      .map((i: string) => `<li>${i}</li>`)
      .join("");
    return `<ul class="list-disc pl-4 my-1 space-y-0.5">${items}</ul>`;
  });

  // 7. Line breaks
  text = text.replace(/\n/g, "<br/>");

  return text;
};
