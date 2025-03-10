//B"H

// /viewer/js/translation.js
/**
 * @file translation.js
 * @description Handles text translation functionality.
 * @date March 10, 2025
 */

import { getDocRef, updateDoc } from '/viewer/js/firebase.js';

/**
 * @function translateText
 * @description Translates text using a remote service.
 * @param {string} txt - Text to translate
 * @returns {Promise<string|null>} Translated text or null on error
 */
async function translateText(txt) {
    // B"H - Blessed be He
    try {
        const resp = await fetch("https://translatify-2q5fj4mnha-uc.a.run.app/", { // @action Fetch translation
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                toichen: `\n${txt}\n`,         // @var Content to translate
                old: isOld.checked             // @var Old translation flag
            })
        });

        const json = await resp.json();        // @var Response JSON
        try {
            const translatedText = json.translated.candidates[0].content.parts[0].text; // @var Extracted text
            return translatedText;             // @return Translated text
        } catch (e) {
            console.log("Translation parsing error:", json, e); // @log Error
            return null;                       // @return Null on parse failure
        }
    } catch (e) {
        console.log("Translation failed:", txt, e); // @log Error
        return null;                           // @return Null on fetch failure
    }
}

/**
 * @function translateParagraph
 * @description Translates a single paragraph and updates Firestore.
 * @param {Object} p - Paragraph object
 * @param {number} i - Index in array
 * @param {Array} ar - Maamar array
 * @param {DocumentReference} docRef - Firestore document reference
 */
async function translateParagraph(p, i, ar, docRef = null) {
    if (!docRef) docRef = getDocRef();         // @call Get document reference
    const tag = document.createElement("p");   // @element Temporary paragraph
    tag.innerHTML = p.heb;                     // @action Set Hebrew content
    const txt = tag.textContent;               // @var Plain text content

    const tran = await translateText(txt);     // @call Translate text
    console.log("Translated:", tran);          // @log Translated text
    translationProgress.textContent = "Translated it! With: " + tran; // @action Update progress

    ar[i].eng = tran;                          // @action Set English translation
    await updateDoc(docRef, { Maamar: ar });   // @action Update Firestore
    translationProgress.textContent = "Wrote to firestore!"; // @action Update progress
    console.log("Wrote to firestore:", ar, i); // @log Success
    await getRealtimeEnglish();                // @call Refresh English content (assuming external)
}

export { translateText, translateParagraph };