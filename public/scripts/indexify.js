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

import monthsTxt from "/meluket/indecies/monthsToTxt.js";
import calculateGematria from "/scripts/gematria.js";

import yearsEngToHeb from "/resources/indecies/yearsEngToHeb.js";

var isHebrew = false;
import {
    getFirestore,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

initializeApp(firebaseConfig);

var db = getFirestore();

var yearIndex = null;
var monthIndex = null;
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
    htmlEl,
    volumeNumber = null
    
}) {


    var sf = `סה"מ מלוקט`
    var eng = `Sefer Hamaamarim Meluket`

    var container = document.querySelector(containerSelector) || htmlEl;
    if(!container) {
        
        console.log("no ocnatiner found",containerSelector);
        return alert("No container for "+containerSelector)
    }

    var VOLUME = null;


    var p = location.pathname.split("/");
    var ls = p[p.length-1];


    var url = "/meluket/view/";

    var isViewingByYear = false;
    var [
        str,
        val
    ] = decodeURIComponent(location.pathname)
        .split("/").splice(-2);

    async function processYear(val) {
        isViewingByYear = true;
        if(!yearIndex) {
            var def = await import("/meluket/indecies/yearOfDocs.js");
            yearIndex = def.default;
        }
        var yr = yearIndex[val];
        window.yearIndex = yearIndex;
        if(!yr) {
            return console.log("That year, "+val+", isn't found. Hebrew only!")

        }
        setContentOfDocs(yr)
        return yr;
    }

    async function processMonth(val) {
        var def = await import("/meluket/indecies/monthsOfMaamarim.js");
        monthIndex = def.default;
        window.monthIndex = monthIndex;

        var maamarim = monthIndex[val];


        setContentOfDocs(maamarim)
        return maamarim;
    }

    async function processVolume(val) {
        
        /*
        when using firebase
        var dr = await doc(db,...databasePath,ls);
        var ds = await getDoc(dr);
        */
        var vol = TOC[val]
        if(vol) {
            setContentFromVolume(vol, false, val);
        }
        return vol;
    }
    if(str == "year") {
        
       

        
        var yr = await processYear(val);


        var yt = document.querySelector(".year-title");
        if(yt) {
            yt.innerHTML = /*html*/`
                <!--<a href="/meluket/#year=1">All Years</a>-->
          
                <div class="year-header">${
                    eng + " " + (isHebrew ? val
                    : ("5" + calculateGematria(val)))
                }</div>
            `
        }
        
    } else if(str == "month") {
       await processMonth(val)
        var yt = document.querySelector(".year-title");
        if(yt) {
            yt.innerHTML = /*html*/`
                <!--<a href="/meluket/#month=1">All Months</a>-->
        
                <div class="year-header">${
                    eng + " " +monthsTxt[val][0][
                        isHebrew ? 0 : 1
                    ]
                }</div>
            `
        }
    } else {
        var myVol = volumeNumber || ls
        await processVolume(myVol)
       

        VOLUME = myVol;
        console.log(VOLUME)
        /*
        when using firebase
        var dr = await doc(db,...databasePath,ls);
        var ds = await getDoc(dr);
        */
        var vol = TOC[ls]
        if(vol) {
            var yt = document.querySelector(".year-title");
            if(yt) {
                yt.innerHTML = /*html*/`
                    <!--<a href="/meluket/#month=1">All Months</a>-->
                  
                    <div class="year-header">${
                        eng + " Vol. " + myVol
                    }</div>
                `
            }
            
            
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

        return {...doc, volume:vol};
    }

    window.gdbi = getDocById;
    window.setContentOfDocs = setContentOfDocs;

    function setContentOfDocs(docIDs) {
        container.innerHTML = "";
        docIDs.forEach(w => {
            var doc = getDocById(w);

            console.log("DOC",doc,w)
            
            setMeluketBooklet(doc, container, w)
            
        })
    }

    function setContentFromVolume(volData, isSicha, volId) {
        var b = Array.from(volData);
        console.log(b,"BVOL")
        container.innerHTML = "";

        if(isSicha) {
            Object.keys(b)
            .forEach(w => {
                b[w].volume = volId;
                setContent(b[w], container, true)
            })
            return console.log("no booklets, did sicha")
        }
        console.log(b,isSicha,"Maamar")

        b.forEach(w=> {
            w.volume = volId;
            console.log(w,"HI")
            var h = setMeluketBooklet(w,container);
        })
    }

    function setContent(g, parent, isSicha, docId) {
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
//7:30 to 8:58
            parent.appendChild(item);
            console.log("HI!",g)
            var id = docId ||
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
            divIndexTitle.textContent = g.title || g.Title ;
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

    function setMeluketBooklet(b, c, id) {
        var bn = b.booklet_name || '';
        if(bn) {
            const bookletName = document.createElement('div');
            bookletName.classList.add('booklet-name');
            bookletName.textContent = bn
            c.appendChild(bookletName)
        }

        b.contents.forEach((g) => {
            g.volume = b.volume;
            setContent(g, c, false, id);
        });
    }
}

