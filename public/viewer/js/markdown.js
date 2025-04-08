//B"H

function markdownToHTML(md) {
  // Escape HTML
  md = md.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;");

  // Code blocks (```code```)
  md = md.replace(/```([^`]+)```/g, (_, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Inline code (`code`)
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    return `<code>${code}</code>`;
  });

  // Headings (###### Heading)
  md = md.replace(/^###### (.*)$/gm, "<h6>$1</h6>")
         .replace(/^##### (.*)$/gm, "<h5>$1</h5>")
         .replace(/^#### (.*)$/gm, "<h4>$1</h4>")
         .replace(/^### (.*)$/gm, "<h3>$1</h3>")
         .replace(/^## (.*)$/gm, "<h2>$1</h2>")
         .replace(/^# (.*)$/gm, "<h1>$1</h1>");

  // Blockquotes
  md = md.replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>");

  // Bold (**bold** or __bold__)
  md = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
         .replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italics (*italic* or _italic_)
  md = md.replace(/\*(.*?)\*/g, "<em>$1</em>")
         .replace(/_(.*?)_/g, "<em>$1</em>");

  // Images ![alt](url)
  md = md.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');

  // Links [text](url)
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Ordered Lists
  md = md.replace(/^(\d+)\. (.*)$/gm, "<ol><li>$2</li></ol>");
  md = md.replace(/<\/ol>\s*<ol>/g, ""); // Merge ols

  // Unordered Lists
  md = md.replace(/^[-*+] (.*)$/gm, "<ul><li>$1</li></ul>");
  md = md.replace(/<\/ul>\s*<ul>/g, ""); // Merge uls

  // Paragraphs
  md = md.replace(/^(?!<h\d|<ul|<ol|<li|<pre|<blockquote|<img|<p|<code)(.+)$/gm, "<p>$1</p>");

  // Line breaks
  md = md.replace(/\n{2,}/g, "</p><p>");

  return md;
}
    
    export default markdownToHTML;