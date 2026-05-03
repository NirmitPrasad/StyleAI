import { describe, expect, it } from "vitest";
import { renderMarkdownSafe } from "./sanitize";

describe("renderMarkdownSafe", () => {
  it("keeps bold, links, inline code, code blocks, and bullet lists", () => {
    const markdown = `**Bold** with a [link](https://example.com), inline \`code\`, and:\n- first\n- second`;
    const output = renderMarkdownSafe(markdown);

    expect(output).toContain("<strong>Bold</strong>");
    expect(output).toContain("<a href=\"https://example.com\"");
    expect(output).toContain("<code class=\"");
    expect(output).toContain("<ul");
    expect(output).toContain("<li>first</li>");
    expect(output).toContain("<li>second</li>");
  });

  it("escapes raw HTML and blocks javascript links", () => {
    const markdown = `[click](javascript:alert(1)) <img src=x onerror=alert(1)>`;
    const output = renderMarkdownSafe(markdown);

    expect(output).toContain("click");
    expect(output).not.toContain("href=\"javascript:alert(1)\"");
    expect(output).not.toContain("<img");
    expect(output).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("renders fenced code blocks safely", () => {
    const markdown = "```\n<script>alert('x')</script>\n```";
    const output = renderMarkdownSafe(markdown);

    expect(output).toContain("<pre");
    expect(output).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
  });
});
