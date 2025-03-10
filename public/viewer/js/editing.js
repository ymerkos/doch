//B"H

// /viewer/js/editing.js
/**
 * @file editing.js
 * @description Handles text editing, formatting, and submission functionality.
 * @date March 10, 2025
 */

import { showToast } from '/viewer/js/utils.js';
import { db, 
    getDocRef, 
    updateDoc, 
    setDoc, 
    arrayUnion,
    arrayRemove,
    updateMapElementByPage

 } from '/viewer/js/firebase.js';
import { getDocID } from '/viewer/js/firebase.js';

/**
 * @function submitEdit
 * @description Submits edited text to either a cloud function or Firestore based on editing mode.
 * @param {Object} params - Editing parameters
 * @param {number} params.paragraph_num - Paragraph index
 * @param {string} params.lang - Language code
 * @param {string} params.edited_text - Edited content
 * @returns {Promise} Resolves with submission result
 */
function submitEdit({ paragraph_num, lang, edited_text }) {
    if (!isEditing) {
        return new Promise((resolve, reject) => {
            // B"H - Blessed be He
            const cloudFunctionURL = 'https://submiteditsuggestion-2q5fj4mnha-uc.a.run.app'; // @const Cloud function URL
            
            const [type] = location.pathname.split("/").slice(-4); // @var Document type
            const [id] = location.pathname.split("/").slice(-1);   // @var Document ID
            const docType = type === "meluket" ? "maamar" : "sicha"; // @var Normalized type

            // @object Data to send in request
            const requestData = { edited_text, paragraph_num, id, lang, type: docType };

            // @object Fetch request configuration
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.accessToken     // @auth User token
                },
                body: JSON.stringify(requestData)
            };

            // @action Send request to cloud function
            fetch(cloudFunctionURL, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log('Edit suggestion submitted successfully:', data); // @log Success
                    resolve(data);
                })
                .catch(error => {
                    console.error('Error submitting edit suggestion:', error); // @log Error
                    reject(error);
                });
        });
    } else {
        // @condition Editing mode active
        console.log("Trying to submit edit!!");
        const d = window.currentData;             // @var Current database data
        if (!d) {
            return showToast("Database data not loaded");
        }

        const m = Array.from(d.Maamar);           // @var Maamar array
        if (!m) {
            return showToast("Not on a maamar");
        }

        const part = m[paragraph_num];            // @var Target paragraph
        if (!part) {
            return showToast("Paragraph not found");
        }

        const type = part[lang];                  // @var Language content
        if (!type) {
            return showToast(`Language ${lang} not working now`);
        }

        part[lang] = edited_text;                 // @action Update content
        const ref = getDocRef();                  // @call Get Firestore reference

        // @action Update Firestore document
        return updateDoc(ref, { Maamar: m })
            .then(didIt => {
                console.log("Updated!", didIt);   // @log Success
                showToast(`Edited paragraph ${paragraph_num} successfully`);
                return didIt;
            })
            .catch(e => {
                console.log(e);                   // @log Error
                showToast("Couldn't update");
                throw e;
            });
    }
}

/**
 * @function toggleBold
 * @description Toggles bold formatting on selected text.
 */
function toggleBold() {
    const selection = window.getSelection();      // @var Current selection
    const selectedText = selection.toString();    // @var Selected text

    if (selectedText) {                           // @condition Text is selected
        const range = selection.getRangeAt(0);    // @var Selection range
        const isBold = range.commonAncestorContainer.parentNode.nodeName === 'B'; // @logic Bold check

        if (isBold) {                             // @condition Already bold
            const boldElement = range.commonAncestorContainer.parentNode; // @var Bold element
            while (boldElement.firstChild) {      // @loop Unwrap children
                boldElement.parentNode.insertBefore(boldElement.firstChild, boldElement);
            }
            boldElement.parentNode.removeChild(boldElement); // @action Remove bold tag
        } else {                                  // @condition Not bold
            const boldElement = document.createElement('b'); // @element New bold tag
            boldElement.textContent = selectedText; // @action Set content
            range.deleteContents();                // @action Clear selection
            range.insertNode(boldElement);         // @action Insert bold element
        }
    }
}

/**
 * @function toggleSuperscript
 * @description Toggles superscript formatting on selected text.
 */
function toggleSuperscript() {
    const selection = window.getSelection();      // @var Current selection
    const selectedText = selection.toString();    // @var Selected text

    if (selectedText) {                           // @condition Text is selected
        const range = selection.getRangeAt(0);    // @var Selection range
        const isSuperscript = range.commonAncestorContainer.parentNode.nodeName === 'SUP'; // @logic Superscript check

        if (isSuperscript) {                      // @condition Already superscript
            const superscriptElement = range.commonAncestorContainer.parentNode; // @var Superscript element
            while (superscriptElement.firstChild) { // @loop Unwrap children
                superscriptElement.parentNode.insertBefore(superscriptElement.firstChild, superscriptElement);
            }
            superscriptElement.parentNode.removeChild(superscriptElement); // @action Remove superscript tag
        } else {                                  // @condition Not superscript
            const superscriptElement = document.createElement('sup'); // @element New superscript tag
            superscriptElement.textContent = selectedText; // @action Set content
            range.deleteContents();                // @action Clear selection
            range.insertNode(superscriptElement);  // @action Insert superscript element
        }
    }
}
window.makeSichaPublic=makeSichaPublic;

async function makeSichaPublic(e, docID) {
    try {
        var el = e.target;
        if(!el) {
            return await showToast("Issue with making public")
        }
        var isItPublic = el.checked;
        var id = docID || getDocID();
        var [page, vol] = id.split("_")
        var ref = getDocRef(id);
        await updateDoc(ref, {
            isPublic: isItPublic
        });

        await updateMapElementByPage(
            "/books/Likkutei Sichos/TOC_VOL/"+vol,
            page,
            {
                isPublic: isItPublic
            }
        )
        await showToast("Made it " + (isItPublic ? "public" : 
            "private")
        );

    } catch(e) {
        await showToast("Something went wrong. did NOT update")
        console.log(e);
    }

}

async function submitSicha() {
    var body = document.getElementById("sichaInput")?.value;
    var footnotes = document.getElementById("sichaFootnoteInput")?.value
    if(!body || !footnotes) {
        showToast("Need to enter footnotes and body")
        return;
    }
    console.log(body,footnotes)
    await showToast("Submitting body and footnotes..");
    try {

        var ref = getDocRef();
        await updateSichos(ref, body, footnotes)
    } catch(e) {
        await showToast("Issue submitting")
        console.log(e);
    }
}

async function updateSichos(ref, body, footnotes) {
   

    try {
        await updateDoc(ref, {
            Footnotes: footnotes,
            Main_Text: body
        });
        await showToast("Updated sicha successfully");

        console.log(`Updated document: ${ref.path}`);
    } catch (error) {
        await showToast("Did NOT update it");

        console.error("Error updating document:", error);
    }
}

export { submitEdit, 
    toggleBold, 
    toggleSuperscript, 
    makeSichaPublic,
    submitSicha 
};