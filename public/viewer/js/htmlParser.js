//B"H
// /viewer/js/htmlParser.js
/**
 * @file htmlParser.js
 * @description HTML parsing and cleaning utilities with style detection.
 * @date March 10, 2025
 */

/**
 * @function parseHTML
 * @description Parses HTML input and processes paragraph tags with style detection.
 * @param {string} input - Raw HTML string to parse
 * @returns {string} Processed HTML string
 */


import { showToast } from '/viewer/js/utils.js';
function parseHTML(input) {
    // B"H - Blessed be He
    const parser = new DOMParser();              // @object Creates DOMParser instance
    const doc = parser.parseFromString(input, "text/html"); // @var Parses input into DOM
    let result = "";                             // @var Accumulates final HTML output

    // @action Process only <p> tags from the body
    const paragraphs = doc.body.getElementsByTagName("p"); // @var Collection of <p> elements
    Array.from(paragraphs).forEach(p => {        // @loop Iterates over paragraphs
        const cleanedContent = cleanElementContent(p.innerHTML); // @call Cleans content
        result += `<p>${cleanedContent}</p>`;    // @action Wraps in <p> tags
    });

    if(!paragraphs.length) {
         showToast("You have to copy at least one paragraph!")
    } else {
        showToast("Copied and formatted successfully")
    }

    return result;                               // @return Processed HTML string
}

/**
 * @function cleanElementContent
 * @description Cleans HTML content and applies appropriate tags based on styles.
 * @param {string} html - HTML content to clean
 * @returns {string} Cleaned HTML content
 */
function cleanElementContent(html) {
    const tempDiv = document.createElement('div'); // @element Temp container for HTML
    tempDiv.innerHTML = html;                      // @action Sets raw HTML

    /**
     * @function processNode
     * @description Recursively processes DOM nodes for styling
     * @param {Node} node - DOM node to process
     * @returns {string} Processed content
     */
    function processNode(node) {
        if (node.nodeType === 3) {                // @condition Text node
            return node.textContent;              // @return Plain text
        }

        if (!node.tagName) return "";             // @condition No tag (e.g., comment)

        const tag = node.tagName.toLowerCase();   // @var Tag name in lowercase
        let content = "";                         // @var Accumulates inner content

        // @condition Handle <span> with specific styles
        if (tag === 'span') {
            const style = node.style;             // @var Inline style object
            const isBold = style.fontWeight === 'bold' || 
                          (parseInt(style.fontWeight) >= 700) || 
                          parseInt(style.fontWeight) > 400; // @logic Bold detection
            const isItalic = style.fontStyle === 'italic'; // @logic Italic detection
            const isSup = style.verticalAlign === 'super'; // @logic Superscript detection

            Array.from(node.childNodes).forEach(child => { // @loop Process children
                content += processNode(child);    // @action Recursively clean
            });

            // @condition Apply tags based on detected styles
            if (isSup) return `<sup>${content}</sup>`;      // @return Superscript first
            if (isBold && isItalic) return `<b><i>${content}</i></b>`; // @return Bold+italic
            if (isBold) return `<b>${content}</b>`;         // @return Bold only
            if (isItalic) return `<i>${content}</i>`;       // @return Italic only
            return content;                                 // @return Plain content
        }

        // @condition Handle explicit <b> tags
        if (tag === 'b') {
            Array.from(node.childNodes).forEach(child => { // @loop Process children
                content += processNode(child);    // @action Recursively clean
            });
            return `<b>${content}</b>`;           // @return Keeps <b> regardless of style
        }

        // @condition Preserve allowed tags
        if (tag === 'strong' || tag === 'i' || tag === 'sup') {
            Array.from(node.childNodes).forEach(child => { // @loop Process children
                content += processNode(child);    // @action Recursively clean
            });
            return `<${tag}>${content}</${tag}>`; // @return Preserves tag
        }

        // @condition Strip other tags, keep content
        Array.from(node.childNodes).forEach(child => { // @loop Process children
            content += processNode(child);        // @action Recursively clean
        });
        return content;                           // @return Plain content
    }

    let cleaned = "";                             // @var Accumulates cleaned HTML
    Array.from(tempDiv.childNodes).forEach(node => { // @loop Process top-level nodes
        cleaned += processNode(node);             // @action Adds cleaned content
    });

    return cleaned;                               // @return Final cleaned HTML
}

export { parseHTML, cleanElementContent };