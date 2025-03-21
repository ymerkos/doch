//B"H

export  {
    detectHTML,
    processText,
    processFootnoteText
}

function detectHTML(txt, {
    
    inputElementId = "inputText",
    plainFontId ="plainFont",
    supFontId="supFont",
    boldFontId="boldFont"
}={}) {
    
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(txt, 'text/html');
    window.d=doc;
    var ui = doc.body
    document.getElementById(inputElementId).value = ui.innerHTML
    const paragraphs = doc.getElementsByTagName('p');

    let plainFont = null;
    let boldFont = null;
    let supFont = null;

    // Process each paragraph
    for (let p of paragraphs) {
        const spans = p.getElementsByTagName('span');
        if (spans.length > 0) {
        // First span is always plain text
        if (!plainFont) {
            plainFont = spans[0].className;
        }

        // Check subsequent spans
        for (let i = 1; i < spans.length; i++) {
            const spanClass = spans[i].className;
            const content = spans[i].textContent.trim();

            // Check if it's superscript (contains only numbers)
            if (/^\d+$/.test(content)) {
            if (!supFont) {
                supFont = spanClass;
            }
            }
            // If it has a different class than the first span and isn't superscript
            else if (spanClass !== plainFont && !boldFont) {
            boldFont = spanClass;
            }
        }
        }
    }

    // Update dropdowns if we found matches
    if (plainFont) document.getElementById(plainFontId).value = plainFont;
    if (supFont) document.getElementById(supFontId).value = supFont;
    if (boldFont) document.getElementById(boldFontId).value = boldFont;
}

function getUI(txt) {
    const parser = new DOMParser();
        const doc = parser.parseFromString(inputText, 'text/html');
        var ul = doc.querySelector("body");
        return ul;
  }
  
  function handlePaste(event) {
    // Prevent default paste behavior so we can handle it manually
    event.preventDefault();

    // Get HTML content from clipboard
    const htmlData = event.clipboardData.getData('text/html');

    if (htmlData) {
        // Put the HTML in the textarea
        document.getElementById("inputText").value = htmlData;
        // Process it for font detection
        autoDetectFonts(htmlData);
    } else {
        // Fallback to plain text if no HTML data is available
        const textData = event.clipboardData.getData('text');
        document.getElementById("inputText").value = textData;
        autoDetectFonts(textData);
    }
}
function autoDetectFonts(event) {
    event.preventDefault()
    const inputText = event.clipboardData.getData('text');
    detectHTML(inputText)
}

function processFootnoteText({
    text,
    boldFontId="boldFontFootnotes"
}) {
    let outputText = text;
    const boldFont = document.getElementById(boldFontId).value;

    // Replace the selected bold font with <b> tags
    outputText = outputText.replace(new RegExp(`<span class="${boldFont}">(.*?)<\/span>`, "g"), "<b>$1</b>");

    // Remove all other span tags (keeping their content)
    outputText = outputText.replace(/<span class="[^"]*">(.*?)<\/span>/g, "$1");

    // Remove dir attributes from <p> tags
    outputText = outputText.replace(/<p dir="[^"]*">/g, "<p>");

    // Move standalone nekudot (ַ, ָ, and ּ) to the next character
    outputText = outputText.replace(/([ַָּ])([^<])/g, "$2$1");


    var shouldSwap = document.getElementById("setParenthesisFoot")?.checked;
    if(shouldSwap) {
        // Swap parentheses ( and )
        outputText = outputText.replace(/\(/g, "TEMPORARY_OPEN")
                            .replace(/\)/g, "(")
                            .replace(/TEMPORARY_OPEN/g, ")");

        // Swap square brackets [ and ]
        outputText = outputText.replace(/\[/g, "TEMPORARY_OPEN_BRACKET")
                            .replace(/\]/g, "[")
                            .replace(/TEMPORARY_OPEN_BRACKET/g, "]");
        
    }
    // Replace both &nbsp; and regular spaces with a single space and collapse multiple spaces
    outputText = outputText.replace(/(&nbsp;|\s)+/g, " ");

    // Remove all other tags except <b>, <sup>, and <p>
    outputText = outputText.replace(/<(?!\/?(b|sup|p)(>|\s.*>))\/?.*?>/g, "");

    return outputText;
}

function processText({
    text,
    
    plainFontId ="plainFont",
    supFontId="supFont",
    boldFontId="boldFont"
}={}) {

    
    // var u = getUI(inputText)
    let outputText = text

    // Get the selected font configurations
    const boldFont = document.getElementById(boldFontId).value;
    const supFont = document.getElementById(supFontId).value;
    const plainFont = document.getElementById(plainFontId).value;
    console.log("plainFont",plainFont,"boldFont",boldFont)
    // Replace the selected bold font with <b> tags
    outputText = outputText.replace(new RegExp(`<span class="${boldFont}">(.*?)<\/span>`, "g"), "<b>$1</b>");

    // Replace the selected superscript font with <sup> tags
    outputText = outputText.replace(new RegExp(`<span class="${supFont}">(.*?)<\/span>`, "g"), "<sup>$1</sup>");

    // Remove the selected plain font tags (keep the content)
    outputText = outputText.replace(new RegExp(`<span class="${plainFont}">(.*?)<\/span>`, "g"), "$1");

    // Remove dir attributes from <p> tags
    outputText = outputText.replace(/<p dir="[^"]*">/g, "<p>");

    // Move standalone nekudot (ַ, ָ, and ּ) to the next character
    outputText = outputText.replace(/([ַָּ])([^<])/g, "$2$1");



    var shouldSwap = document.getElementById("setParenthesisMain")?.checked;

    if(shouldSwap) {
        // Swap parentheses ( and )
        outputText = outputText.replace(/\(/g, "TEMPORARY_OPEN")
                                .replace(/\)/g, "(")
                                .replace(/TEMPORARY_OPEN/g, ")");

        // Swap square brackets [ and ]
        outputText = outputText.replace(/\[/g, "TEMPORARY_OPEN_BRACKET")
                                .replace(/\]/g, "[")
                                .replace(/TEMPORARY_OPEN_BRACKET/g, "]");

    }

    // Replace &nbsp; with a single space and collapse multiple spaces into one
    outputText = outputText.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");






    // Replace   with a single space and collapse multiple spaces into one
    outputText = outputText.replace(/ /g, " ").replace(/\s+/g, " ");

    // Remove spaces following a hyphen (־) when connected to preceding character
    outputText = outputText.replace(/(\S)־\s+/g, "$1");

    // Move spaces at the end of <sup> tags to outside
    outputText = outputText.replace(/<sup>([^<]*?)\s+<\/sup>/g, "<sup>$1</sup> ");

    // Remove all other tags except <b>, <sup>, and <p>
    outputText = outputText.replace(/<(?!\/?(b|sup|p)(>|\s.*>))\/?.*?>/g, "");

    // Display the cleaned HTML
   // document.getElementById("outputHtml").textContent = outputText;
   return outputText
}

function copyToClipboard() {
const outputHtml = document.getElementById("outputHtml");
const htmlToCopy = outputHtml.textContent;

const tempElement = document.createElement("textarea");
tempElement.value = htmlToCopy;
document.body.appendChild(tempElement);
tempElement.select();

try {
    const successful = document.execCommand("copy");
    if (successful) {
    alert("Copied to clipboard!");
    } else {
    alert("Failed to copy!");
    }
} catch (err) {
    alert("Failed to copy!");
} finally {
    document.body.removeChild(tempElement);
}
}