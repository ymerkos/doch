/*B"H*/
 /*

books
Meluket
TOC_VOL
1
*/

import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

initializeApp(firebaseConfig);

var db = getFirestore();

export default setIndexesToContainer;
/*
maamar "/viewer/meluket/"
databasePath = ["books","Meluket","TOC_VOL"]
containerSelector = ".container"
*/
async function setIndexesToContainer({
    containerSelector,
    htmlEl,
    databasePath,
    volumeNumber=1,
    url
}) {

    
var container = document.querySelector(containerSelector) || htmlEl;
if(!container) {
    
    console.log("no ocnatiner found",containerSelector);
    return alert("No container for "+containerSelector)
}

console.log("Gt container",container)
var ls = volumeNumber//p[p.length-1];
var VOLUME = ls;

var dr = await doc(db,...databasePath,ls);
var ds = await getDoc(dr);

if(ds.exists()) {
    var b = await ds.data();
    console.log("Got data",b)
    var bl = b.booklets;
    if(!bl) {
        Object.keys(b)
        .forEach(w => {
            console.log("seting",b[w],b,w)
            setContent(b[w], container, true)
        })
        return console.log("no booklets")
    }
    console.log(b,bl)
    container.innerHTML = "";

    bl.forEach(w=> {
        var h = setMeluketBooklet(w,container);
    })
}


function setContent(g, parent, isSicha) {
    if(!isSicha) {
        const item = document.createElement('div');
        item.classList.add('item');

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = g.title;
        item.appendChild(title);

        const dottedLine = document.createElement('div');
        dottedLine.classList.add('dotted-line');
        item.appendChild(dottedLine);

        const page = document.createElement('div');
        page.classList.add('page');
        page.textContent = g.page;
        item.appendChild(page);

        parent.appendChild(item);

        var id =
            VOLUME+"_"+g.page;
        // console.log("HI!",id,VOLUME,g.page)
        item.onclick=() => {
            location.href=url+id;
        };
    } else {
        const divIndexItem = document.createElement('div');
        divIndexItem.classList.add('index-item');
        divIndexItem.onclick = function() {
            location.href = '${href(w)}';
        };

        const divIndexHeader = document.createElement('div');
        divIndexHeader.classList.add('index-header');
        divIndexItem.appendChild(divIndexHeader);

        const divIndexTitle = document.createElement('div');
        divIndexTitle.classList.add('index-title');
        divIndexTitle.textContent = g.title || g.Title || w;
        divIndexHeader.appendChild(divIndexTitle);

        const divIndexNumber = document.createElement('div');
        divIndexNumber.classList.add('index-number');
        divIndexNumber.textContent = g.page || "";
        divIndexHeader.appendChild(divIndexNumber);

        const divIndexLine = document.createElement('div');
        divIndexLine.classList.add('index-line');
        divIndexItem.appendChild(divIndexLine);

        const divIndexContent = document.createElement('div');
        divIndexContent.classList.add('index-content');
        divIndexContent.textContent = g.summary || "";
        if(g.summary)
            divIndexItem.appendChild(divIndexContent);

        // Append the created elements to the parent element
        parent.appendChild(divIndexItem);

        var id = g.page + "_" + VOLUME 
        // console.log("HI!",id,VOLUME,g.page)
        divIndexItem.onclick=() => {
            location.href=url+id;
        };
    }

    
}

function setMeluketBooklet(b, c) {
    var bn = b.booklet_name || '';
    if(bn) {
        const bookletName = document.createElement('div');
        bookletName.classList.add('booklet-name');
        bookletName.textContent = bn
        c.appendChild(bookletName)
    }

    b.contents.forEach((g) => {
        setContent(g, c);
    });
}
}

