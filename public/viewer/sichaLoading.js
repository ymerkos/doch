//B"H

import firebaseConfig from "../config.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";


import { getAuth, GoogleAuthProvider} 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
    getFirestore,
    getDoc,
    where,
    query,
    getDocs,

    collection,
    doc,
    enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
var db = null;
var sichaId = null;

var sichaL = "לקוטי שיחות"
var maamarL = 'סה"מ מלוקט'
var app = initializeApp(firebaseConfig);

const auth = getAuth(app);
db = getFirestore();

enableIndexedDbPersistence(db)
  .then(r => {
    console.log("offline persistence",r)
  })
  .catch((err) => {
    console.log("Problem with offline persistence: ", err)
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });


async function getIt() {
    
    var sichaId = getLastPath("sicha", true);
    if(!sichaId) {
        console.log("No sicha with that ID found");
    }

    if(sichaId)
        getSicha(sichaId);

    var maamId = getLastPath("meluket", true)
    if(maamId) {
        console.log("found mamar getting")
        getMaamar(maamId)
    }
}

await getIt();
window.getIt = getIt;
window.getMaamar = getMaamar;
window.getSicha = getSicha;
async function getMaamar(maamId) {
   
    try {
        maamId = decodeURIComponent(maamId)
    } catch(e) {
        console.log(e)
    }
    console.log("Got id",maamId)
    const sichaPath = `books/Meluket/Maamarim/${maamId}`;
    window.curPath=sichaPath;
    const sichaRef = doc(db, sichaPath);

    try {
        const sichaDoc = await getDoc(sichaRef);

        if (sichaDoc.exists()) {
            var data = {
                Maamar:sichaDoc.get("Maamar"),
                Volume:sichaDoc.get("Volume"),
                Kitzur: sichaDoc.get("Kitzur"),
                Footnotes:sichaDoc.get("Footnotes"),
                Title:sichaDoc.get("Title")
            }
            

            window.curVolume  = data.Volume;
            window.isMaamar = true;
            var userParagraphs = await getUserParagraphs("maamar", maamId)
            window.userParagraphs = userParagraphs;
            console.log("maamar found: ", data,curVolume);
            setTextToDoc(data, false); // Returns the document data
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}
async function getSicha(sichaId) {
    if (!sichaId) {
        console.log("No Sicha ID provided");
        return;
    }

    const sichaPath = `books/Likkutei Sichos/Sichos/${sichaId}`;
    window.curPath=sichaPath;
    const sichaRef = doc(db, sichaPath);

    try {
        const sichaDoc = await getDoc(sichaRef);

        if (sichaDoc.exists()) {
            var data = {
                Main_text:sichaDoc.get("Main_text"),
                Volume:sichaDoc.get("Volume"),
                Footnotes:sichaDoc.get("Footnotes"),
                Title:sichaDoc.get("Title")
            }
            

            window.curVolume  = data.Volume;
            var userParagraphs = await getUserParagraphs("sicha",sichaId)
            window.userParagraphs = userParagraphs;
            console.log("Sicha found: ", data,window.curVolume);
            setTextToDoc(data, true); // Returns the document data
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}
window.collection = collection;
window.db=db;



async function getUserParagraphs(type, docId) {
    console.log(auth)
    if(auth.currentUser) {
        var user = auth.currentUser
        var uid = user.uid;
        try {
            var modifiedId = encodeURIComponent(docId)
            console.log(docId,modifiedId)
            // Construct the query with multiple filters
            const q = query(
                collection(db, 'edit_suggestions'), 
                where('uid', '==', uid), 
                where('type', '==', type),
                where("docId", "==", modifiedId)
            );

            console.log("Doing query", q, type, uid);

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Process the query results
            var results = [];
            querySnapshot.forEach(doc => {
                
                const entry = {};
                // Store document data in the data object using document ID as key
                entry.data = doc.data();
                entry.id = doc.id;
                results.push(entry)
            });

            // Return the data object containing paragraph data
            return results;
        } catch(error) {
            console.error("Problem fetching:", error);
            return null;
        }
    }
    return null;
}


function setTextToDoc(sicha, isSicha = false) {
   
    if(!sicha) {
        alert("problem")
        return;
    }
    window.sicha = sicha;
    footnotify(sicha)
    var maamar= sicha.Maamar;
    var mt = sicha.Main_text;
    var tl = sicha.Title;

    
    var p = document.querySelector(".paragraph-container");
    if(!p) {
        alert("something went wrong")
        return;
    }

    if(!isSicha) {
        p.classList.add("maamer");
    }


    
    if(window.Kitzur) {
        console.log("Kitzur",sicha,sicha.Kitzur)
        if(sicha.Kitzur)
        Kitzur.value = sicha.Kitzur
    }
    if(!maamar && mt) {
        if(window.LOLmt) {
            LOLmt.value=mt;

        }
        if(window.EnglishContent) {
            if(sicha.English)
                EnglishContent.value = sicha.English
        }
        if(window.LOLfn) {
            LOLfn.value=sicha.Footnotes
        }
        
        var eng = sicha.English;
        
        var h2 = document.createElement("h2")
        if(tl) {
            h2.innerHTML = tl;
            mt = h2.outerHTML + mt;
        }


        var vol = sicha.Volume;
        if(vol) {
            
            volumify(vol,isSicha)
        }
        p.innerHTML = processText(mt,eng);
        setSupsForP(p)
        callEvents()
    } else if(maamar) {
        if(!Array.isArray(maamar)) {
            console.log(maamar,"problem")
            return alert("Data is messed up")
        }
        p.innerHTML = "";
        var userPars = userParagraphs || [];
        maamar.forEach((w, i) => {
            if(w.type == "header") {
                var h2 = document.createElement("h2");
                p.appendChild(h2);
                h2.dataset.hIndex = 0;
                h2.innerHTML = w.heb
                

            } else if(w.type == "normal") {
                var par = document.createElement("div")
                par.className = "p-div";
                par.dataset.pIndex = i;
                var num = findUserParagraph(userPars, {
                    paragraph_num: i
                });
               

                if(w.heb) {
                    
                    var paragHeb = document.createElement("p");
                    paragHeb.innerHTML = w.heb;
                    
                    paragHeb.className = "heb"
                    if(num) {
                        if(num.data.lang == "heb") {
                            paragHeb.classList.add("custom")
                            paragHeb.innerHTML = num.data.edited_text;
                        }
                    }
                    par.appendChild(paragHeb)
                }

                if(w.eng) {
                    var engPar = document.createElement("p");
                    engPar.innerHTML = formatNumbers(w.eng);
                    
                    engPar.className = "english-p"
                    if(num) {
                        if(num.data.lang == "eng") {
                            engPar.classList.add("custom")
                            engPar.innerHTML = formatNumbers(num.data.edited_text);
                        }
                    }
                    par.appendChild(engPar)
                    engPar.classList.add("hidden")
                }

                p.appendChild(par)
            }
        });

        var vol = sicha.Volume;
        if(vol) {
            
            
            volumify(vol,isSicha)
        }

        setSupsForP(p)
        callEvents();
    }
}

function findUserParagraph(up, {
    paragraph_num
}) {
    return up.find(w=> w.data.paragraph_num == paragraph_num)
}

function volumify(vol, isSicha) {
    var dc = document.querySelector("#work_title");
    if(dc) {
        dc.textContent = (
            !isSicha?maamarL:sichaL
        ) + " " +
        ("ח" + calculateGematria(vol, true))
    }
}

function getPath() {
    return location.pathname.split("/")
}

function parseDoc(txt) {
    var dp = new DOMParser();
    var d = dp.parseFromString(txt, "text/html")
    return Array.from(d.body.children);
}

window.parseDoc=parseDoc;

function processText(MainText, EnglishText="") {
   var d = parseDoc(MainText);
   var et = null;
   if(EnglishText) {
    et = parseDoc(EnglishText)
   }
   var resultHTML = "";

    d.forEach((w,i) => {
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

/**
 * gets the last path paramter
 * so like /1/2/3 gets 3
 * even if it has # or ? it only 
 * gets the path so 
 * /1/2/3?asdaf#auid 
 * it still only returns 3
 */
/**
 * Gets the last path parameter from the URL.
 * @param {string} searchString - The string to check for in the path parameters.
 * @param {boolean} checkString - Whether to check for the searchString in the path parameters.
 * @returns {string} The last path parameter.
 */
function getLastPath(searchString, checkString) {
    // Get the path from the URL
    const path = window.location.pathname;
    
    // Split the path by '/'
    const pathSegments = path.split('/');
    
    // Get the last segment (parameter)
    let lastSegment = pathSegments[pathSegments.length - 1];
    
    // Remove any query parameters or hash fragments
    const cleanedLastSegment = lastSegment.split(/[?#]/)[0];
    
    // Check if searchString should be checked and exists in the path
    if (checkString && path.includes(searchString)) {
        return cleanedLastSegment;
    }
    
    return cleanedLastSegment;
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
        var par = w.innerHTML;
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



function calculateGematria(hebrewString, convertNumbers = false) {
    const gematriaMap = {
        'א': 1,
        'ב': 2,
        'ג': 3,
        'ד': 4,
        'ה': 5,
        'ו': 6,
        'ז': 7,
        'ח': 8,
        'ט': 9,
        'י': 10,
        'כ': 20,
        'ך': 20, // Final kaf
        'ל': 30,
        'מ': 40,
        'ם': 40, // Final mem
        'נ': 50,
        'ן': 50, // Final nun
        'ס': 60,
        'ע': 70,
        'פ': 80,
        'ף': 80, // Final pe
        'צ': 90,
        'ץ': 90, // Final tzadi
        'ק': 100,
        'ר': 200,
        'ש': 300,
        'ת': 400
    };
  
  
    // Function to convert English numbers to Hebrew equivalents
    function convertNumberToHebrew(number) {
        const numberMap = {
            1: 'א',
            2: 'ב',
            3: 'ג',
            4: 'ד',
            5: 'ה',
            6: 'ו',
            7: 'ז',
            8: 'ח',
            9: 'ט',
            10: 'י',
            15: "טו",
            16: "טז",
          
            20: 'כ',
            30: 'ל',
            40: 'מ',
            50: 'נ',
            60: 'ס',
            70: 'ע',
            80: 'פ',
            90: 'צ',
            100: 'ק',
            200: 'ר',
            300: 'ש',
            400: 'ת'
        };
        return numberMap[number];
    };
  
  
    // Convert English numbers to Hebrew equivalents if requested
    if (convertNumbers) {
      let gematriaValue = "";
          const numbers = hebrewString.match(/\d+/g); // Extract English numbers from the string
          if (numbers) {
              numbers.forEach(number => {
                gematriaValue += " "
                if(number == 15 ) {
                  gematriaValue += ("טו");
                  return;
                }
                if(number == 16 ) {
                  gematriaValue += ("טז");
                  return;
                }
                const digits = number.toString().split(''); // Get individual digits of the number
                const length = digits.length;
                digits.forEach((digit, index) => {
                    const heb = convertNumberToHebrew(parseInt(digit + '0'.repeat(length - index - 1))); // Convert digit to Hebrew
                    
                    if (heb) {
                        gematriaValue += heb;
                    }
                });
            });
          }
  

          return gematriaValue.trim().split(" ").map(w=>addDoubleQuote(w)).join(" ");
    } else {
      
      let gematriaValue = 0;
        // Iterate through each character in the Hebrew string
        for (let i = 0; i < hebrewString.length; i++) {
          const letter = hebrewString[i];
  
          // Check if the letter exists in the gematria map
          if (gematriaMap.hasOwnProperty(letter)) {
              // Add the gematria value of the letter to the total
              gematriaValue += gematriaMap[letter];
          }
      }
      
      return gematriaValue;
    }
  
  }

  

  function addDoubleQuote(str) {
    // Convert the string to an array of characters
    const chars = str.split('');
    
    // Insert the double quote at the second-to-last position
    chars.splice(-1, 0, '"');

    // Join the array back into a string and return
    return chars.join('');
}