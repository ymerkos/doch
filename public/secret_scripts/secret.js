//B"H
async function loadJSON() {
    var j = await showOpenFilePicker();
    var url = URL.createObjectURL(await j[0].getFile());
    var json = null;
    try {
        var r = await fetch(url)
        var js = await r.json()
        json=js;
    } catch(e){

    }
    window.g=j
    if(json)window.json=json;

    if(!json) return alert("No JSON file!");

    return json;
}

function downloadObjectAsJson(obj, filename) {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj, null, 2);

  // Create a Blob containing the JSON data
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a download link
  const downloadLink = document.createElement('a');

  // Create a URL for the Blob and set it as the href attribute of the link
  downloadLink.href = URL.createObjectURL(blob);

  // Set the filename for the download
  downloadLink.download = filename;

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click on the link to trigger the download
  downloadLink.click();

  // Remove the link from the document
document.body.removeChild(downloadLink);
}


async function getTableOfContentsMaamar() {
  var col = collection(db, "books","Meluket","TOC_VOL")
  var d = {}
  var docs = await getDocs(col)
  for(var i = 0; i < docs.docs.length; i++) {
      var b = docs.docs[i].get("booklets")
      d[docs.docs[i].id] = b
  }
  d;
  return d;
}

async function processAndSaveDocuments() {
  const maamarimRef = collection(db, '/books/Meluket/Maamarim');
  const snapshot = await getDocs(maamarimRef);

  var did = false;
   var thingsDid = 0;
 var prom = snapshot.docs.map((docSnapshot) => {
    //if(thingsDid > 5) return;
    //  if(did) return console.log("already did");
      const data = docSnapshot.data();
      const mainTxtHTML = new DOMParser().parseFromString(data.Main_text, 'text/html');
      const englishHTML = new DOMParser().parseFromString(data.English, 'text/html');

      var mainTxtH2 = Array.from(mainTxtHTML.querySelectorAll("h2"))
      const mainTxtParagraphs = Array.from(mainTxtHTML.querySelectorAll('p'));
      const englishParagraphs = englishHTML.querySelectorAll('p');
      console.log("Doing",docSnapshot.id)
      const Maamar = [];
      mainTxtH2.forEach((w, i) => {
          const maamarItem = {
              heb: w.innerHTML,
              type: 'header' 
          };
          Maamar.push(maamarItem)
      })
      mainTxtParagraphs.forEach((element, index) => {
          var subs = Array.from(element.querySelectorAll("sup"))
          subs.forEach(w=>{
              var d = w.getAttribute("data-group")
              if(d && d != "Footnotes") {
                  w.parentNode.removeChild(w)
              } else if(d && d === "Footnotes") {
                  w.removeAttribute("data-group")
              }
          })
          const maamarItem = {
              heb: element.innerHTML,
              type:  'normal'
          };

          // If it's not a header, set the English equivalent.
          if (maamarItem.type === 'normal' && englishParagraphs[index]) {
              maamarItem.eng = englishParagraphs[index].innerHTML;
          }

          Maamar.push(maamarItem);
          
      });

      
      console.log("Wrote",Maamar,docSnapshot.id)
      did = true;
      thingsDid++;
      // Update the document with new Maamar field
      return updateDoc(doc(db, '/books/Meluket/Maamarim', docSnapshot.id), { Maamar });

  });

  await Promise.all(prom)
}

window.processAndSaveDocuments = processAndSaveDocuments;
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
  const convertNumberToHebrew = (number) => {
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
                gematriaValue += "טו";
                return;
              }
              if(number == 16 ) {
                gematriaValue += "טז";
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

        return gematriaValue.trim();
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


function getParshasFromJSON(j) {
    var occ = {};
    var mapped = j.map(w=>{
        var p  = w.parsha;
        if(!occ[p]) {
            occ[p] = true;
            
            return p
        }
        return null;
    }).filter(Boolean);
    return mapped;
    
}

function makeVolumeIndex(j) {
    var volumes = [];
    j.forEach(w=> {
        if(!volumes[w.vol_eng]) {
            volumes[w.vol_eng] = []
        }
        volumes[w.vol_eng].push(({
            page:w.page,
            title:w.title,
            summary:w.summary
        }));
    })
    return volumes;
}

// Function to upload JSON data to Firestore
const uploadDataToFirestore = async (data) => {
    try {
      const collectionRef = collection(db, 'books', 'Likkutei Sichos', 'TOC_VOL');
  
      // Loop through the sub-arrays and add each one as a document with a unique ID
      data.forEach(async (subArray, index) => {
        const documentRef = doc(collectionRef, (index + 1).toString());
  
        // Create an object to mimic the array structure
        const arrayData = {};
  
        // Loop through the objects within the sub-array and add them to the object
        subArray.forEach((object, objectIndex) => {
          arrayData[objectIndex.toString()] = {
            page: object.page,
            title: object.title,
            summary: object.summary||""
          };
        });
  
        // Set the data for the document with the mimicked array structure
        await setDoc(documentRef, arrayData);
  
        console.log(`Document ${index + 1} uploaded with ID: ${documentRef.id}`);
      });
  
      console.log('JSON data uploaded to Firestore');
    } catch (error) {
      console.error('Error uploading JSON data:', error);
    }
  };


async  function sichosFrom30AndOn(json) {
    var n = 937;
    var off = 0;
    var m = off+n
    var h = json.slice(m).filter(w=>w.mainText)
    for(var i =0; i < h.length; i++) {
        var s;
        try {
            s= realSicha(json[i+m])
        } catch(e) {
            console.log("NO text!", json[i+m], s,e)
        }
        if(!s) continue
        addNewSicha(s);
        console.log("ADDED this sichA!!!!",s)
        
    }
  }





//B"H
var table = {

  "תנש\"א": 5,

  "תשנ\"ב": 6,
  "תש\"נ": 4,
  "תשמ\"ט": 3,


  "תשמ\"ח": 2,

  "תשמ\"ז": 2,

  "תשנ\"א": 5,


}






//B"H
var table = {

  "תנש\"א": 5,

  "תשנ\"ב": 6,
  "תש\"נ": 4,
  "תשמ\"ט": 3,


  "תשמ\"ח": 2,

  "תשמ\"ז": 2,

  "תשנ\"א": 5,


}

var contentURL = "https://www.chabad.org/api/v2/chabadorg/torahtexts/book-content/";


async function matchChabadOrgToAwtsfaria(chabad /*primary array*/ , awtsfaria, table) {
  var matched = [];
    awtsfaria=awtsfaria.map(w=>({...w,booklets:w.booklets.map(g=>({
       ...g,
        contents:g.contents.map(r=>({
           ...r,
            title:r.title.split("”").join('"').split("”").join('"').split("״").join('"')
        }))
    }))}))
    console.log(awtsfaria)
    var list = []
  chabad.forEach(async (w, i) => {
    var ht = w["hebrew-title"]
       console.log(w)
    var kuntress = w["hebrew-subtitle"];
    var year = null;
    if (!kuntress) {

      var y = getYearFromTitle(ht)
      if (!y) console.log("Issue", w)
      else {
        year = y;
      }

    }
    if (!year) {
      var y = getYearFromSubtitle(kuntress)
      if (!y) {
        var ht = w["hebrew-title"]
        var y = getYearFromTitle(ht)
        if (y) {
          year = y;

        } else console.log("issue", w)
      } else {
        year = y;
      }

    }


       var tYear = getYearFromTitle(ht)
    var book = table[year] || 1;
       

       if(book) {
           var bk =awtsfaria[book-1].booklets.map(f=>f.contents).flat();
           
           var yr = filterByYear(ht, bk)

           var yrs = yr
            var hty = ht.replace(tYear,"")
           var sim = findMostSimilarTitle(yrs,
                                          hty,tYear)
           
        console.log("Tried", i, year, tYear, book,bk, yrs,sim,hty,w);
           //scrape stuff
           if(!sim) return console.log("Returning!");

           list.push({chabad:w,awtsfaria:sim,page:sim.page,book,i})
           
       }
  })

    for(var i = 0; i < list.length; i++) {
        await wait(1.7)
         var maam = await getMaamer(list[i].chabad)
        downloadObjectAsJson({chabad:maam,awts:list[i].awtsfaria},"BH_chabadAwtsfariaMatch_"+list[i].awtsfaria.page+"_"+list[i].book+"_"+list[i].i+".json")
    }

    function wait( sc) {
       return new Promise((r,j) =>{
            setTimeout(()=>{
                r()
                
            },sc*1000)
       })
    }

    async function getMaamer(cref) {
       var art = cref["article-id"];
        var f = await fetch(contentURL+art)
        var j = await f.json()
        return j;
    }

    function filterByYear(src, ar) {
       var yr = extractHebrewYear(src);
        return ar.filter(w=>{
           var arY = extractHebrewYear(w.title)
            return arY == yr
        })
    }

    
    function tokenize(text) {
       // Basic tokenization by splitting the text into words and removing punctuation, keeping the year format intact.
       return text.split(/\s+/).filter(Boolean).map(word => word.replace(/[.,\/#!$%&\*;:{}=\-_`~()]/g,""));
   }
   
   function findMostSimilarTitle(titlesArray, inputString, tYear) {
       const inputTokens = tokenize(inputString);
       let bestMatch = null;
       let highestMatchCount = 0;
   
       titlesArray.forEach(item => {
           const titleTokens = tokenize(item.title.replace(tYear,""));
           let matchCount = 0;
   
           // Increment matchCount for each token in titleTokens that also appears in inputTokens
           titleTokens.forEach(token => {
               if (inputTokens.includes(token)) {
                   matchCount++;
               }
           });
   
           // Update bestMatch if the current item has more matches than the previous best
           // Or if it's the first match being considered
           if (matchCount > highestMatchCount) {
               highestMatchCount = matchCount;
               bestMatch = item;
           }
       });
   
       // Check if bestMatch has at least one matching word, adjusting as needed based on your criteria for "a little similar"
       if (highestMatchCount > 0) {
           return bestMatch;
       } else {
           return null;
       }
   }



        

  function extractHebrewYear(inputString) {
    try {
           inputString.split("”").join('"').split("”").join('"').split("״").join('"')
      // Adjusted pattern to match a 'ת' followed by two or three Hebrew letters, 
      // a quotation mark as the second to last character, and ending with a Hebrew letter.
      // The pattern specifically looks for 'ת' followed by one or two Hebrew characters, 
      // then a quotation mark, and finally another Hebrew character.
      const pattern = /ת[א-ת]{1,2}"[א-ת]/;
      const match = inputString.match(pattern);

      if (match) {
        // Return the matched year
        return match[0];
      } else {
        // If no match is found, return null
        return null;
      }
    } catch (e) {
      return null
    }
  }

  function getYearFromTitle(t) {
    return extractHebrewYear(t)
  }

  function getYearFromSubtitle(st) {
    return extractHebrewYear(st)
    var spl = st.split("–")
    var y = spl[spl.length - 1]
    return y;
  }

   
}



//B"H

function getEnglishParagraphs() {
  //B"H
  var dp = new DOMParser()
  
  var matched = getMatchedInnerHTML();
  var EnglishVolumes = {};
  matched.forEach(w=> {
      var dc = dp.parseFromString(w.user,"text/html")
      var id = dc.querySelector("id").textContent
      if(!EnglishVolumes[id]) {
          EnglishVolumes[id] = ""
      }
      var p =document.createElement("p")
      p.innerHTML = w.ai.split("Translate start")
      .join("").split("Translate end").join("")

      Array.from(p.children).forEach(w=>{
          if(!w.textContent) {
              w.remove()
          }
      })
      EnglishVolumes[id]+=p.outerHTML
  })
  return EnglishVolumes
}

function getMatchedInnerHTML() {
  const users = document.querySelectorAll('.user');
  const ais = document.querySelectorAll('.ai');

  const matchedContent = [];

  // Ensure the number of user and AI elements are the same
  if (users.length !== ais.length) {
      console.error('Unequal number of users and AIs');
      return;
  }

  for (let i = 0; i < users.length; i++) {
      const userContent = users[i].innerHTML.trim();
      const aiContent = ais[i].children[0].innerHTML.trim();

      matchedContent.push({
          user: userContent,
          ai: aiContent
      });
  }

  return matchedContent;
}
