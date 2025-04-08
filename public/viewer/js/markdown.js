//B"H
function markdownToHTML(markdown) {
    let html = markdown;
    
    // Headings
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*)__/gim, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*)_/gim, '<em>$1</em>');
    
    // Paragraphs (wrap text not matching other patterns in <p> tags)
    html = html.split('\n\n').map(paragraph => {
        if (!paragraph.match(/^<h[1-6]>|^<strong>|^<em>/i)) {
            return `<p>${paragraph}</p>`;
        }
        return paragraph;
    }).join('\n');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    return html;
}

// Example usage:
const markdownText = `
# Hello World
This is a **bold** and *italic* test.

## Subheading
Another paragraph with __bold__ text.
`;

    
    export default markdownToHTML;