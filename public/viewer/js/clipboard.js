//B"H
// /viewer/js/clipboard.js
/**
 * @file clipboard.js
 * @description Handles clipboard operations and form creation for text inputs.
 * @date March 10, 2025
 */

import { parseHTML } from '/viewer/js/htmlParser.js';

import {
    detectHTML,
    processText
} from "/viewer/js/text-parsing.js"
/**
 * @function makeSichaForm
 * @description Creates a form with clipboard paste handling for a given textarea.
 * @param {HTMLElement} textarea - The textarea element to enhance
 */
async function makeSichaForm(textarea, type) {
    // B"H - Blessed be He
    
    // @event Listens for paste event on textarea
    textarea.addEventListener('paste', async (e) => {
        e.preventDefault(); // @action Stops default paste behavior to handle manually

        try {
            // @action Reads clipboard contents
            const clipboardItems = await navigator.clipboard.read();
            let htmlContent = null;
            let plainText = null;

            var txtResult = null;
            // @loop Check each clipboard item for HTML or text
            for (const item of clipboardItems) {
                if (item.types.includes('text/html')) { // @condition If HTML is available
                    const blob = await item.getType('text/html'); // @var HTML blob
                    htmlContent = await blob.text();              // @var HTML string
                   
                }
                if (item.types.includes('text/plain')) { // @condition If plain text is available
                    const blob = await item.getType('text/plain'); // @var Text blob
                    plainText = await blob.text();                 // @var Plain text string
                }
            }
            if(!window.isSpecialPasting) {
                if (htmlContent) { // @condition If HTML was found
                    console.log("HTML content pasted:", htmlContent); // @log Full HTML

                    var parsed = htmlContent;
                    
                        parseHTML(htmlContent);            // @call Parse HTML content
                    textarea.value = parsed;  
                    txtResult = htmlContent                        // @action Set parsed content
                } else if (plainText) { // @condition If only plain text was found
                    console.log("Plain text pasted:", plainText);     // @log Text
                    textarea.value = "No HTML found, just plain text: "; // @action Set text indicator
                    txtResult = plainText
                } else { // @condition If nothing useful was found
                    textarea.value = "Nothing recognizable pasted!";  // @action Set error message
                }
            } else {
                if(type == "main")
                    detectHTML(plainText, {
                        inputElementId: "sichaInput"
                    })
                else {
                    detectHTML(plainText, {
                        inputElementId: "sichaFootnoteInput"
                    })
                }
            }
        } catch (err) {
            console.error("Failed to read clipboard:", err);      // @log Error
            textarea.value = e.clipboardData?.getData('text/plain') || ""; // @fallback Legacy method
        }
    });
}

export { makeSichaForm };