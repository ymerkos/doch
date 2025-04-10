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
    makeSichaPublic,
    updateSichos,
    fancyHTML
 } from '/viewer/js/editing.js';
import { 
    showToast,
    makeElementEditable, 
    saveEditableElement, 
    findParentWithDatasetProperty,
    betterEditing
} from '/viewer/js/utils.js';
import { continueIfLoggedIn } from '/viewer/js/auth.js'; // Assuming this exists externally

import {
    
    processText,
    processFootnoteText
} from "/viewer/js/text-parsing.js"

import {
    toggleEnglish
} from "/viewer/js/language.js"


import {
    handleReplace,
    setup,
    handleSearch
} from "/viewer/js/search.js";
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

    setup();
    var setupEnglish = document.getElementById("showE");
    setupEnglish.addEventListener("click", toggleEnglish)

    var ss = document.getElementById("setSpecial");
    var si = document.querySelectorAll(".specialInputs")

    var sichaInput = document.getElementById("sichaInput")
    var sichaFootnoteInput = document.getElementById("sichaFootnoteInput")
    ss.onchange = e => {
        if(ss.checked) {
            si.forEach(w=>w.classList.remove("hidden"))
        } else {
            si.forEach(w=>w.classList.add("hidden"));
        }
        window.isSpecialPasting = ss.checked;
    }


    var pt = document.getElementById("parseTextFromSpecial");
    pt.addEventListener("click", e=>{
        
       var res = processText({
            text: sichaInput.value
        })
        sichaInput.value = res;
    })
    var ptf = document.getElementById("parseTextFromSpecialFootnotes");
    ptf.addEventListener("click", e=>{
        
       var res = processFootnoteText({
            text: sichaFootnoteInput.value
        })
        sichaFootnoteInput.value = res;
    })
    //
    var sichaSubmit = document.getElementById("sichaSubmit")
    sichaSubmit.addEventListener("click", submitSicha)

    var editBtn =  document.getElementById("editBtn")
    editBtn.addEventListener("click", async () => {
        editSichaToggle(editBtn)
    });

    editBtnHTML.addEventListener("click", async () => {
        await editSichaToggle(editBtnHTML,"html")
    })
    var pb = document.getElementById("isPublic")
    pb.addEventListener("change", makeSichaPublic)
    mBold.onclick = toggleBold;         // @event Bind bold toggle
    mSup.onclick = toggleSuperscript;   // @event Bind superscript toggle

    // @event Keyboard shortcuts for formatting
    addEventListener("keypress", e => {
      
        
        if (e.ctrlKey && (e.code === 'KeyM' || e.key === 'M')) { // @condition Ctrl+M
            
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

window.isSichaEditing = false;
var current = "";

async function editSichaToggle(btn, isHTML = false) {
    var pc = document.querySelector(
        ".paragraph-container"
    )
    var editableParagraphs = 
        Array.from(
            document.querySelectorAll(
                ".paragraph-container .p-div p.heb"
            )
        );
      //  console.log("Editin",window.ed=editableParagraphs);
    var footnoteHolder = document.querySelector("#content0");
    console.log("Editing",btn)

    if(!isSichaEditing) {
        window.isSichaEditing = true;
        current = footnoteHolder.innerHTML
        if(!isHTML) {
            editableParagraphs.forEach(p => {
                p.contentEditable = true;
                betterEditing(p);
            });

            
            footnoteHolder.innerHTML = window.sichaData.Footnotes;
            footnoteHolder.contentEditable = true;

            
            editBtnHTML.disabled = true;
        } else {
            editBtn.disabled = true;
            var pDiv =document.createElement("div")
            pDiv.className = "p-div editAll";

            var pr = document.createElement("p")
            pr.classList.add("heb");
            pDiv.appendChild(pr);

            var mainText = sichaData
            .Main_text;

            pr.innerText = mainText;

            var displayHTML = fancyHTML(pr.innerText)
             pr.innerHTML = displayHTML;
        
            pr.contentEditable = true;
            betterEditing(pr);

            pc.innerHTML = "";
            pc.appendChild(pDiv);


            var footnoteHTML = window.sichaData.Footnotes;
            var fancy = fancyHTML(footnoteHTML);
            footnoteHolder.innerHTML = fancy;
            footnoteHolder.contentEditable = true;

        }
        
        btn.innerText = "Save edits";


      //  console.log(body,body==sichaData.Main_text)

    } else {
        var body;
        var footnotes="";
        if(!isHTML) {
            editableParagraphs.forEach(p => {
                p.contentEditable = false;
            });
            
            body = editableParagraphs.map(w=>`<p>${
                w.innerHTML
            }</p>`).join("")//.split("\\n").join("<br>");
            
            footnotes = footnoteHolder.innerHTML;
        } else {
            editBtn.disabled = false;
            editBtnHTML.disabled = false;
            var pr = pc.querySelector(".editAll p.heb")
            body = pr?.innerText;
            if(!body?.trim()) {
                await showToast("No body to save");
                return;
            }

            var maybeFootnotes = footnoteHolder.innerHTML;
            if(!maybeFootnotes) {
                await showToast("No footnote content")
            } else {
                footnotes = footnoteHolder.innerText
            }
        }
       
        var up = await updateSichos(body, footnotes);
        
        footnoteHolder.innerHTML = current || "";
        footnoteHolder.contentEditable = false;
        current = "";
        window.isSichaEditing = false;
        btn.innerText = "Edit again";
        window.sichaData.Main_text = body;
        window.sichaData.Footnotes = footnotes;
        
        
    }
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