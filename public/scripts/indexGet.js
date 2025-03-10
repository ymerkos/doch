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
window.addEventListener("awtsmoosAuth", (e) => {
    console.log("CALLED event",e.detail)
    if(e.detail.isAllowed) {
        window.isAllowed = true;
        var pr = Array.from(
            document.querySelectorAll(".private")
        );
        pr.forEach(w=>{
            w.classList.remove("private")
            w.classList.add("private-admin")
        })
        Array.from(
            document.querySelectorAll(
                "a.index-item"
            )
        ).forEach(q=> {
            var url = new URL(q.href);
            url = url + "?edit";
            q.href = url;
        })
    }
})
// Function to load all keys in a document at a specific path
const loadKeysInDocument = async (documentPath) => {
    try {
        const documentRef = doc(db, documentPath);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();

       // console.log(' the document:', data);
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
   // console.log(pathSegments);
    var titles = [];
    try {
        
    const myCollection = collection(db, ...pathSegments); // Replace with your collection name
  
      const querySnapshot = await getDocs(myCollection);
      
        querySnapshot.forEach((doc) => {
        const title = doc.get('Title');
        titles.push(title);
       // console.log('Title:', title);
      });
      
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
    return titles;
  }
window.getAllDocuments=getAllDocuments;

//console.log("Getkeys?",getKeys,getAllDocuments)
function setThings(data, href) {
    var k = Object.keys(data);
    data.length = k.length;
    data = Array.from(data);
   // console.log(data);
    var c = document.querySelector(".index-container");

    if (!c) {
        alert("Something's wrong");
        return;
    }

    function createIndexItem(w) {
        const indexItem = document.createElement("a");
        indexItem.className = "index-item";
        if(!w?.isPublic) {
            if(window.isAllowed) {
                indexItem.classList.add("private-admin")
            } else 
                indexItem.classList.add("private")
        }
        indexItem.href = href(w);
        
        const indexHeader = document.createElement("div");
        indexHeader.className = "index-header";
    
        const indexTitle = document.createElement("div");
        indexTitle.className = "index-title";
        indexTitle.textContent = w.title || w.Title || w;
    
        const indexNumber = document.createElement("div");
        indexNumber.className = "index-number";
        indexNumber.textContent = w.page || "";
    
        indexHeader.appendChild(indexTitle);
        indexHeader.appendChild(indexNumber);
    
        const indexLine = document.createElement("div");
        indexLine.className = "index-line";
    
        const indexContent = document.createElement("div");
        indexContent.className = "index-content";
        indexContent.textContent = w.summary || "";
    
        indexItem.appendChild(indexHeader);
        indexItem.appendChild(indexLine);
        indexItem.appendChild(indexContent);
    
        return indexItem;
    }
    
    function renderIndex(data, container) {
        container.innerHTML = ""; // Clear previous content
    
        data.forEach(w => {
            container.appendChild(createIndexItem(w));
        });
    }
    
    // Usage
    renderIndex(data, c);
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