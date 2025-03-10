//B"H

// /viewer/js/firebase.js
/**
 * @file firebase.js
 * @description Firebase configuration and database operations.
 * @date March 10, 2025
 */

import firebaseConfig from "/config.js"; // @import Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"; // @import Firebase app
import { 
    getFirestore, 
    getDoc, 
    getDocs, 
    setDoc,
    doc, 
    collection, 
    updateDoc,
    deleteField
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // @import Firestore functions

// @action Initialize Firebase app
initializeApp(firebaseConfig);

// @var Firestore database instance
const db = getFirestore();

/**
 * @function getDocID
 * @description Extracts document ID from URL path.
 * @returns {string} Decoded document ID
 */
function getDocID() {
    return decodeURIComponent((b => b[b.length-1])(location.pathname.split("/"))); // @return Last path segment
}

function isSicha() {
    return location.pathname.includes("sichos")
}
window.isSicha=isSicha
/**
 * @function getDocRef
 * @description Gets Firestore document reference for a given path or current ID.
 * @param {string|null} pthId - Optional path ID
 * @returns {DocumentReference} Firestore document reference
 */
function getDocRef(pthId = null) {
    if (!pthId) pthId = getDocID(); // @action Use current ID if not provided
    var pathInFirebase = !isSicha() ?
        "books/Meluket/Maamarim/"   
    : "books/Likkutei Sichos/Sichos/"
    return doc(db, pathInFirebase + pthId); // @return Document reference
}

window.getDocRef = getDocRef;
window.db = db;
window.getDoc = getDoc;

window.getDocs = getDocs;
window.setDoc = setDoc
window.updateDoc = updateDoc;
window.doc = doc;
window.collection = collection;
window.deleteField=deleteField
export { db, doc, getDocID, getDocRef, getDoc, setDoc, 
    getDocs, collection, updateDoc };