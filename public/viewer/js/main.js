//B"H
// /viewer/js/main.js
/**
 * @file main.js
 * @description Main entry point for the application. Initializes forms and core functionality.
 * @date March 10, 2025
 */

import { makeSichaForm } from '/viewer/js/clipboard.js';
import { setupUIEvents, setupEditingMode } from '/viewer/js/ui.js';

// B"H - Blessed be He
// @global Input elements for sicha content
const sichaInput = document.getElementById('sichaInput');
const sichaFootnoteInput = document.getElementById('sichaFootnoteInput');

// @function Initializes the application
function initializeApp() {
    makeSichaForm(sichaInput, "main");         // @call Sets up main sicha input form
    makeSichaForm(sichaFootnoteInput); // @call Sets up footnote input form
    
    // @condition Check if in editing mode
    if (isEditing) {
        setupEditingMode();            // @call Configures UI for editing
    }
    setupUIEvents();
    
}

// @call Start the application
initializeApp();

// @exports Export initialization function for potential external use
export { initializeApp };