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