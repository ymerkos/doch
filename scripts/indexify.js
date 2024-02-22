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


function setContent(g, parent, reverse) {
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

    var id = reverse ? g.page + "_" + VOLUME :
        VOLUME+"_"+g.page;
    // console.log("HI!",id,VOLUME,g.page)
    item.onclick=() => {
        location.href=url+id;
    };
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

