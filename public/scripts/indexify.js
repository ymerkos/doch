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
import yearIndex from "/meluket/indecies/yearOfDocs.js";
import years from "/meluket/indecies/yearsInOrder.js";
import TOC from "/meluket/indecies/TOC.js";


window.yearIndex=yearIndex;
window.TOC=TOC;
export default setIndexesToContainer;
/*
maamar "/viewer/meluket/"
databasePath = ["books","Meluket","TOC_VOL"]
containerSelector = ".container"
*/
async function setIndexesToContainer({
    containerSelector,
    htmlEl
    
}) {


    var container = document.querySelector(containerSelector) || htmlEl;
    if(!container) {
        
        console.log("no ocnatiner found",containerSelector);
        return alert("No container for "+containerSelector)
    }

    var VOLUME = null;


    var p = location.pathname.split("/");
    var ls = p[p.length-1];

    var volumeNumber = null;

    var url = "/meluket/view/";

    var isViewingByYear = false;
    var [
        yearStr,
        yearVal
    ] = decodeURIComponent(location.pathname)
        .split("/").splice(-2);

    if(yearStr == "year") {
        
        isViewingByYear = true;

        var yr = yearIndex[yearVal];
        if(!yr) {
            return alert("That year, "+yearVal+", isn't found. Hebrew only!")

        }


        var yt = document.querySelector(".year-title");
        if(yt) {
            yt.innerHTML = /*html*/`
                <a href="/meluket/#year=1">All Years</a>
                <div class="year-header">${yearVal}</div>
            `
        }
        setContentOfDocs(yr)
    } else {
        volumeNumber = ls;

        var ls = volumeNumber//p[p.length-1];
        VOLUME = ls;
        /*
        when using firebase
        var dr = await doc(db,...databasePath,ls);
        var ds = await getDoc(dr);
        */
        var vol = TOC[ls]
        if(vol) {
            var b = vol;
            setContentFromVolume(b);
            
        }
    }

    function getDocById(docID) {
        /**
         * first part vol, 2nd page
         * if maamar
         */
        var [
            vol,
            page
        ] = docID.split("_");
        var vl = TOC[vol];
        if(!vl) return null;
        var doc = vl.find(q => 
            q.contents.find(maam => maam.page == page)
        );
        doc.volume = vol;
        return doc;
    }

    window.gdbi = getDocById;
    window.setContentOfDocs = setContentOfDocs;

    function setContentOfDocs(docIDs) {
        container.innerHTML = "";
        docIDs.forEach(w => {
            var doc = getDocById(w);

            
            setMeluketBooklet(doc, container)
            
        })
    }

    function setContentFromVolume(volData, isSicha) {
        var b = volData;

        container.innerHTML = "";

        if(isSicha) {
            Object.keys(b)
            .forEach(w => {
                
                setContent(b[w], container, true)
            })
            return console.log("no booklets, did sicha")
        }
        console.log(b,isSicha,"Maamar")

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
                (g.volume || VOLUME)+"_"+g.page;
            // console.log("HI!",id,VOLUME,g.page)
            item.onclick=() => {
                location.href=url+id;
            };
        } else {
            const divIndexItem = document.createElement('div');
            divIndexItem.classList.add('index-item');
           

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

