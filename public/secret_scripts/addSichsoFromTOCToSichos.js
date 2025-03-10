//B"H

// Function to process TOC and create/merge Sichos documents
async function processBooks() {
    const tocCollectionRef = collection(db, "books", "Likkutei Sichos", "TOC_VOL");

    try {
        const tocSnapshot = await getDocs(tocCollectionRef);

        tocSnapshot.forEach(async (docSnap) => {
            const volume = docSnap.id; // Volume name from document ID
            const data = docSnap.data(); // Object with indexed keys
            
            // Convert the object to an actual array
            const dataArray = Array.from({ length: Object.keys(data).length }, (_, i) => data[i]);
            //console.log("DATA",dataArray,volume)
          //  return;
            for (const entry of dataArray) {
                if (!entry || !entry.page || !entry.title) {
                    console.warn(`Skipping invalid entry in volume ${volume}.`);
                    continue;
                }

                const { page, title } = entry;
                const sichosPath = `books/Likkutei Sichos/Sichos/${page}_${volume}`;
                const sichosDocRef = doc(db, sichosPath);

                const sichosDocSnap = await getDoc(sichosDocRef);

                if (!sichosDocSnap.exists()) {
                    
                    await setDoc(sichosDocRef, {
                        Footnotes: "",
                        Main_Text: "",
                        Title: title,
                        Page: page,
                        Volume: volume
                    });
                    console.log(`Created document: ${sichosPath}`);
                } else {
                    console.log(`Document already exists: ${sichosPath}`);
                }
            }
        });
    } catch (error) {
        console.error("Error processing books:", error);
    }
}

// Run the function
processBooks();//