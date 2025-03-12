//B"H

// /viewer/js/utils.js
/**
 * @file utils.js
 * @description Utility functions for DOM manipulation and helpers.
 * @date March 10, 2025
 */

/**
 * @function makeElementEditable
 * @description Makes an element contenteditable.
 * @param {HTMLElement} el - Element to make editable
 * @returns {string} Current HTML content
 */
function makeElementEditable(el) {
    const html = el.innerHTML;        // @var Current HTML
    el.contentEditable = true;        // @action Make editable
    return html;                      // @return Current HTML
}

/**
 * @function saveEditableElement
 * @description Saves content of an editable element and makes it non-editable.
 * @param {HTMLElement} el - Element to save
 * @returns {string} Saved HTML content
 */
function saveEditableElement(el) {
    const html = el.innerHTML;        // @var Current HTML
    el.contentEditable = false;       // @action Make non-editable
    return html;                      // @return Saved HTML
}

/**
 * @function findParentWithDatasetProperty
 * @description Finds parent element with specified dataset property.
 * @param {HTMLElement} element - Starting element
 * @param {string} propertyName - Dataset property to find
 * @returns {Object|null} Parent element and property value or null
 */
function findParentWithDatasetProperty(element, propertyName) {
    let parent = element.parentElement; // @var Starting parent

    while (parent) {                    // @loop Traverse up DOM tree
        if (parent.dataset.hasOwnProperty(propertyName)) { // @condition Property found
            return { element: parent, value: parent.dataset[propertyName] }; // @return Parent and value
        }
        parent = parent.parentElement;  // @action Move up
    }

    return null;                        // @return Null if not found
}

/**
 * @function showToast
 * @description Displays a toast notification with text.
 * @param {string} txt - Text to display
 */
function showToast(txt) {
    const toast = document.getElementById('toast'); // @var Toast element
    toast.textContent = txt;                        // @action Set text
    toast.classList.remove('hide');                 // @action Show toast
    
    if (timeout === null) {                         // @condition No existing timeout
        timeout = setTimeout(function() {           // @action Set hide timeout
            toast.classList.add('hide');            // @action Hide toast
        }, 3000);
    } else {                                        // @condition Existing timeout
        clearTimeout(timeout);                      // @action Clear previous timeout
        timeout = setTimeout(function() {           // @action Set new timeout
            toast.classList.add('hide');            // @action Hide toast
        }, 3000);
    }
}

/**
 * @function changeHashElement
 * @description Updates the location.hash by setting a key to a specified value.
 * @param {string} key - The hash parameter key to set (e.g., "par")
 * @param {string|null} value - The value to assign to the key, or null to remove it
 */
function changeHashElement(key, value) {
    // @var Current hash as URLSearchParams object
    const curHash = new URLSearchParams(location.hash.substring(1));
    
    if (value) {                                    // @condition If value is provided
        curHash.set(key, value);                    // @action Set the key-value pair
    } else {                                        // @condition If value is null/undefined
        try {
            curHash.delete(key);                    // @action Remove the key
        } catch (e) {
            console.log(`Error removing hash key ${key}:`, e); // @log Error if deletion fails
        }
    }
    
    console.log(`Setting hash: #${curHash.toString()}`); // @log New hash value
    location.hash = "#" + curHash.toString();       // @action Update location.hash
}

function betterEditing(editor) {
    editor.addEventListener('keypress', function(e) {
       // console.log("e",e)
        if (e.code === 'Enter') {
            e.preventDefault();
            
            // Create a br element
            const br = document.createElement('br');
            
            // Get current selection and range
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Insert the br at cursor position
            range.deleteContents();
            range.insertNode(br);
            
            // Move cursor after the br
            range.setStartAfter(br);
            range.setEndAfter(br);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
}
let timeout = null;                                     // @global Timeout variable

export { 
    makeElementEditable, 
    saveEditableElement, 
    findParentWithDatasetProperty, 
    showToast,
    changeHashElement,
    betterEditing
};