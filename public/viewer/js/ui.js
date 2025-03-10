//B"H

// /viewer/js/ui.js
/**
 * @file ui.js
 * @description Handles UI interactions, event listeners, and visual updates.
 * @date March 10, 2025
 */

import { 
    toggleBold, 
    toggleSuperscript, 
    submitEdit,
    submitSicha,
    makeSichaPublic
 } from '/viewer/js/editing.js';
import { showToast, makeElementEditable, saveEditableElement, findParentWithDatasetProperty } from '/viewer/js/utils.js';
import { continueIfLoggedIn } from '/viewer/js/auth.js'; // Assuming this exists externally

// B"H - Blessed be He
// @global UI elements
const mBold = document.getElementById('mBold');
const mSup = document.getElementById('mSup');
const reportErrorBtn = document.getElementById('reportErrorBtn');
const errorReport = document.getElementById('errorReport');
const errorCancel = document.getElementById('errorCancel');
const errorReportD = document.getElementById('errorReportD');
let curParIdx = null;            // @global Current paragraph index
let initialHTML = null;          // @global Initial HTML content
let errorClicked = false;        // @global Error click state

/**
 * @function setupUIEvents
 * @description Sets up all UI-related event listeners.
 */
function setupUIEvents() {
    var sichaSubmit = document.getElementById("sichaSubmit")
    sichaSubmit.addEventListener("click", submitSicha)

    
    var pb = document.getElementById("isPublic")
    pb.addEventListener("change", makeSichaPublic)
    mBold.onclick = toggleBold;         // @event Bind bold toggle
    mSup.onclick = toggleSuperscript;   // @event Bind superscript toggle

    // @event Keyboard shortcuts for formatting
    addEventListener("keypress", e => {
        if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) { // @condition Ctrl+B
            e.preventDefault();
            toggleBold();                               // @call Toggle bold
        } else if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) { // @condition Ctrl+M
            e.preventDefault();
            toggleSuperscript();                        // @call Toggle superscript
        }
    });

    // @event Error reporting button click
    reportErrorBtn.onclick = async () => {
        const signed = await continueIfLoggedIn();     // @call Check login status
        console.log("signed in", signed);              // @log Login status
        if (signed && curParIdx) {                     // @condition Logged in and paragraph selected
            errorReportD.classList.remove("hidden");   // @action Show error dialog
            console.log("Editing", curParIdx);         // @log Current paragraph
            const el = curParIdx.el;                   // @var Target element
            if (el) {
                initialHTML = el.innerHTML;            // @action Store initial HTML
                makeElementEditable(el);               // @call Make element editable
            }
        }
    };

    // @event Submit error report
    errorReport.onclick = async () => {
        if (curParIdx) {                               // @condition Paragraph selected
            const el = curParIdx.el;                   // @var Target element
            if (el && initialHTML) {                   // @condition Element and initial HTML exist
                errorReport.textContent = "Submitting.."; // @action Update button text
                showToast("Submitting");                  // @call Show submitting toast
                
                try {
                    const html = saveEditableElement(el); // @call Save edited content
                    await submitEdit({                    // @call Submit edit
                        paragraph_num: curParIdx.idx,
                        lang: curParIdx.lang,
                        edited_text: html
                    });
                    
                    errorReport.textContent = "Edited. Refreshing.."; // @action Update button text
                    await getIt();                       // @call Refresh content (assuming external)
                    showToast("Successfully reported edits!"); // @call Show success toast
                    
                    initialHTML = null;                  // @action Clear initial HTML
                    errorReportD.classList.add("hidden"); // @action Hide dialog
                    errorReport.textContent = "Edit";    // @action Reset button text
                    curParIdx = null;                    // @action Clear current paragraph
                    errorClicked = false;                // @action Reset error state
                } catch (e) {
                    console.log("Submit error", e);      // @log Error
                    showToast("Problem submitting");     // @call Show error toast
                    el.innerHTML = initialHTML;          // @action Restore initial HTML
                    initialHTML = null;                  // @action Clear initial HTML
                }
            }
        }
    };

    // @event Cancel error report
    errorCancel.onclick = () => {
        if (curParIdx) {                             // @condition Paragraph selected
            const el = curParIdx.el;                 // @var Target element
            if (el && initialHTML) {                 // @condition Element and initial HTML exist
                saveEditableElement(el);             // @call Save current state
                el.innerHTML = initialHTML;          // @action Restore initial HTML
                initialHTML = null;                  // @action Clear initial HTML
                errorReportD.classList.add("hidden"); // @action Hide dialog
                curParIdx = null;                    // @action Clear current paragraph
                errorClicked = false;                // @action Reset error state
            }
        }
    };

    // @event Right-click context menu
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();                          // @action Prevent default context menu
        const rightClickMenu = document.getElementById('right-click-menu'); // @var Context menu
        const idx = findParentWithDatasetProperty(e.target, "pIndex"); // @call Find paragraph index

        if (idx) {                                   // @condition Paragraph found
            const lang = e.target.classList.contains("heb") ? "heb" : "eng"; // @var Language
            console.log(e.target, lang);             // @log Target and language
            curParIdx = { idx: idx.value, el: e.target, lang }; // @action Set current paragraph
            errorClicked = true;                     // @action Set error state
            rightClickMenu.style.display = 'block';  // @action Show context menu
            rightClickMenu.style.left = e.pageX + 'px'; // @action Position menu
            rightClickMenu.style.top = e.pageY + 'px'; // @action Position menu
            return;
        }
        rightClickMenu.style.display = "none";       // @action Hide menu if no paragraph
    });

    // @event Hide context menu on click
    document.addEventListener('click', function (e) {
        const rightClickMenu = document.getElementById('right-click-menu'); // @var Context menu
        rightClickMenu.style.display = 'none';       // @action Hide menu
        if (!errorClicked) curParIdx = null;         // @action Clear paragraph if not error
    });
}

/**
 * @function setupEditingMode
 * @description Configures UI for editing mode.
 */
function setupEditingMode() {
    reportErrorBtn.textContent = "Edit";            // @action Update button text
    errorReport.textContent = "Edit";               // @action Update button text
    const lg = document.querySelector(".loginBtn"); // @var Login button
    if (lg) lg.classList.remove("hidden");          // @action Show login button
    content1.classList.remove("hidden");            // @action Show content 1
    content2.classList.remove("hidden");            // @action Show content 2
    content3.classList.remove("hidden");            // @action Show content 3
    tab0.classList.remove("hidden");                // @action Show tab 0
    tab1.classList.remove("hidden");                // @action Show tab 1
    tab2.classList.remove("hidden");                // @action Show tab 2
}

export { 
    setupUIEvents, 
    setupEditingMode, 
    curParIdx, 
    initialHTML, 
    errorClicked 
};