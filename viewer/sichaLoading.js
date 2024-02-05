//B"H

import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
var db = null;
var sichaId = null;


initializeApp(firebaseConfig);

db = getFirestore();

var sichaId = getElementAfter("sicha");
if(!sichaId) {
    console.log("No sicha with that ID found");
}

if(sichaId)
    getSicha();

var maamId = getElementAfter("meluket")
if(maamId) {
    console.log("found mamar getting")
    getMaamar()
}

async function getMaamar() {
    if (!maamId) {
        console.log("No Sicha ID provided");
        return;
    }
    try {
        maamId = decodeURIComponent(maamId)
    } catch(e) {
        console.log(e)
    }
    console.log("Got id",maamId)
    const sichaPath = `books/Meluket/Maamarim/${maamId}`;
    const sichaRef = doc(db, sichaPath);

    try {
        const sichaDoc = await getDoc(sichaRef);

        if (sichaDoc.exists()) {
            console.log("Sicha found: ", sichaDoc.data());
            setTextToDoc(sichaDoc.data()); // Returns the document data
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}
async function getSicha() {
    if (!sichaId) {
        console.log("No Sicha ID provided");
        return;
    }

    const sichaPath = `books/Likkutei Sichos/Sichos/${sichaId}`;
    const sichaRef = doc(db, sichaPath);

    try {
        const sichaDoc = await getDoc(sichaRef);

        if (sichaDoc.exists()) {
            console.log("Sicha found: ", sichaDoc.data());
            setTextToDoc(sichaDoc.data()); // Returns the document data
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}

function setTextToDoc(sicha) {
   
    if(!sicha) {
        alert("problem")
        return;
    }
    window.sicha = sicha;
    footnotify(sicha)
    var mt = sicha.Main_text;
    var tl = sicha.Title;
    if(window.LOLmt) {
        LOLmt.value=mt;

    }
    if(window.LOLfn) {
        LOLfn.value=sicha.Footnotes
    }
    console.log("HI!",window.LOLfn,window.LOLmt)
    console.log("Trying",sicha,mt)
    var eng = sicha.English;
    if(mt === undefined) {
        alert("no main text")
        return;
    }
    var p = document.querySelector(".paragraph-container");
    if(!p) {
        alert("something went wrong")
        return;
    }
    var h2 = document.createElement("h2")
    if(tl) {
        h2.innerHTML = tl;
        mt = h2.outerHTML + mt;
    }


    p.innerHTML = processText(mt,eng);
    callEvents()
}
function getPath() {
    return location.pathname.split("/")
}

function parseDoc(txt) {
    var dp = new DOMParser();
    var d = dp.parseFromString(txt, "text/html")
    return Array.from(d.body.children);
}

function processText(MainText, EnglishText="") {
   var d = parseDoc(MainText);
   var et = null;
   if(EnglishText) {
    et = parseDoc(EnglishText)
   }
   var resultHTML = "";
   resultHTML += d.slice(0,2).map(w=>w.outerHTML).join("")
   d = d.filter(w=>{
     return w.tagName == "P"
   })
    d.slice(2).forEach((w,i) => {
        var d = document.createElement("div");
        d.className="p-div";
        d.appendChild(w);
        
        w.classList.add("heb");

        if(et) {
            var eng = et[i];
            if(eng) {
                d.appendChild(eng)
                eng.classList.add("eng")
            } else {
                d.setAttribute("dir","rtl")
            }
        }

        resultHTML += d.outerHTML;
        
    });
    return resultHTML
}

function getElementAfter(target) {
    var paths = location.pathname.split("/");
    var index = paths.indexOf(target);
  
    if (index !== -1 && index < paths.length - 1) {
      return paths[index + 1];
    } else {
      return null; // Return null if the target is not found or if there is no element after it
    }
  }

  
function footnotify(sicha) {
    //B"H
    var dp = new DOMParser()
    var d = dp.parseFromString(sicha.Footnotes, "text/html")
    var p = d.getElementsByTagName("p")
    var ar = Array.from(p)
    var notes = {}
    ar.forEach(w=> {
        var reg = /^(\d+\*?)\)/;
        var par = w.innerText;
        var info = null;
        const match = par.match(reg);
        if(match) {
            info = match[1]
        } else {

        }
        if(info) {
            notes[info] = par;
        }
    })
    window.notes = notes;
    console.log(notes)

}

window.getPath=getPath