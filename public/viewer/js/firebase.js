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
    deleteField,
    arrayUnion,
    arrayRemove,
    writeBatch,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; // @import Firestore functions
window.writeBatch = writeBatch;

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


async function updateMapElementByPage (docPath, pageNumber, newData) {
    const docRef = doc(db, docPath);
    
    // Fetch the document
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        let data = docSnap.data();

        // Find the key where `page` matches the given pageNumber
        let keyToUpdate = Object.keys(data).find(key => data[key].page == pageNumber);
        console.log(data,keyToUpdate)
        if (!keyToUpdate) {
            throw new Error("No matching page found!");
            return;
        }

        // Update only that specific key using Firestore's dot notation
        await updateDoc(docRef, {
            [`${keyToUpdate}`]: { ...data[keyToUpdate], ...newData } 
        });

        console.log(`Updated entry at key ${keyToUpdate}!`);
    } else {
        throw new Error("Document does not exist!");
    }
};


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
    getDocs, collection, 
    updateDoc,
    arrayUnion,
    arrayRemove,
    updateMapElementByPage


};