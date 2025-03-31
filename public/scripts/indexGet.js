//B"H
import heb_volumes from "/templates/heb_volumes.js";
window.heb_volumes = heb_volumes;
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
        var ar = Array.from(
            document.querySelectorAll(
                "a.index-item"
            )
        )
        if(window.homeBtn)
            ar.push(window.homeBtn)
        ar.forEach(q=> {
            var url = new URL(q.href);
            if(!url.searchParams.get("edit")) {
                url = url + "?edit";
                q.href = url;
            }
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
                console.log('Document does not exist.',documentPath);
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

//B"H
function findHebVolume(num) {
    return heb_volumes?.find(q => q["eng vol"] == num)?.["heb vol full"]
    
}

//console.log("Getkeys?",getKeys,getAllDocuments)
function setThings(data, href, isParsha) {
    var k = Object.keys(data);
   // console.log(data);
    var c = document.querySelector(".index-container");
    console.log("container",c)
    if (!c) {
        alert("Something's wrong");
        return;
    }

    function createIndexItem(w) {
        const indexItem = document.createElement("a");
        indexItem.className = "index-item";
        if(!w?.isPublic && !isParsha) {
            if(window.isAllowed) {
                indexItem.classList.add("private-admin")
            } else 
                indexItem.classList.add("private")
        }
        if(w) {
            if(!isParsha) 
                indexItem.href = href(w); 
            else {
                var vol = w.vol;
                indexItem.href =  `/likkutei-sichos/view/${vol}/${w.page}_${vol}`
            }
        } else {
            console.log("What?.",w)
        }
        const indexHeader = document.createElement("div");
        indexHeader.className = "index-header";
    
        const indexTitle = document.createElement("div");
        indexTitle.classList.add("index-title");
        
        if(isParsha) {
            indexTitle.classList.add("parsha")
            var volDiv = document.createElement("div")
            volDiv.className = "sicha-volume"
            var vol =  findHebVolume(w.vol);;
            if(vol) {
                volDiv.innerText = vol;
                indexTitle.appendChild(volDiv);
            }
            var sichaTitle = document.createElement("div");
            sichaTitle.className = "sicha-name"
            sichaTitle.innerText = w.title;

            indexTitle.appendChild(sichaTitle);

        } else {
            indexTitle.textContent = w.title || w.Title || w;
        //
        }
    
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
        console.log(container)
        container.innerHTML = ""; // Clear previous content
    
        k.forEach((w,i) => {
            if(w) {
                container.appendChild(createIndexItem(data[w]));
            } else {
                console.log("no data",data,i);
                
            }
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