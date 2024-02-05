//B"H

import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    getDoc,
    collection,
    getDocs,
  
    doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
var db = null;
var sichaId = null;


initializeApp(firebaseConfig);

db = getFirestore();

// Function to load all keys in a document at a specific path
const loadKeysInDocument = async (documentPath) => {
    try {
        const documentRef = doc(db, documentPath);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();

        console.log(' the document:', data);
        return data;
        } else {
        console.log('Document does not exist.');
        }
    } catch (error) {
        console.error('Error loading document keys:', error);
    }
};

async function getKeys(path) {
    
    var data = await loadKeysInDocument(path)
    return data;
}

async function getAllDocuments(nm,field="Title") {
    const pathSegments = nm.split('/').filter(Boolean);
    console.log(pathSegments);
    var titles = [];
    try {
        
    const myCollection = collection(db, ...pathSegments); // Replace with your collection name
  
      const querySnapshot = await getDocs(myCollection);
      
        querySnapshot.forEach((doc) => {
        const title = doc.get('Title');
        titles.push(title);
        console.log('Title:', title);
      });
      
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
    return titles;
  }
window.getAllDocuments=getAllDocuments;

console.log("Getkeys?",getKeys,getAllDocuments)
function setThings(data, href) {
    var k = Object.keys(data);
    data.length = k.length;
    data = Array.from(data);
    console.log(data);
    var c = document.querySelector(".index-container");

    if (!c) {
        alert("Something's wrong");
        return;
    }

    var mapped = data
        .map(
            (w, i) => /*html*/ `
        <div class="index-item" onclick="location.href='${href(w)}';">
            <div class="index-header">
                <div class="index-title">${w.title || w.Title || w}</div>
                <div class="index-number">${w.page || ""}</div>
            </div>
            <div class="index-line"></div>
            <div class="index-content">
                ${w.summary || ""}
            </div>
        </div>
    `
        )
        .join("");

    console.log("mapped", c, mapped);
    c.innerHTML = mapped;
}
//old script
// function setThings(data, href) {
    
//     var k = Object.keys(data)
//     data.length = k.length;
//     data = Array.from(data);
//     console.log(data)
//     var c = document.querySelector(".index-container")
//     if(!c) {
//         alert("Something's wrong")
//         return;
//     }
//     var mapped = data.map((w,i)=>/*html*/`
//         <div class="index-item">
//         <div class="index-header">
//             <div class="index-title"><a href="${href(w)}">${w.title||w.Title||w}</a></div>
//             <div class="index-number">${w.page || ""}</div>
//         </div>
//         <div class="index-line"></div>
//         <div class="index-content">
//             ${w.summary || ""} 
//         </div>
//     </div>
//     `).join("");
//     console.log("mapped",c,mapped);
//     c.innerHTML = mapped

// }

window.getKeys=getKeys;
window.setThings=setThings;