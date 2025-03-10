//B"H
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

async function updateDocuments() {
    for (let volume = 30; volume <= 39; volume++) {
        const tocRef = doc(db, `books/Likkutei Sichos/TOC_VOL/${volume}`);
        const tocSnap = await getDoc(tocRef);

        if (!tocSnap.exists()) {
            console.log(`Document ${volume} does not exist.`);
            continue;
        }

        let tocData = tocSnap.data();
        let updatedTocData = {};

        // Add isPublic: true to all properties
        for (let key of Object.keys(tocData)) {
            updatedTocData[key] = { ...tocData[key], isPublic: true };
        }

        // Write back updated TOC document
        await updateDoc(tocRef, updatedTocData);
        console.log(`Updated TOC document ${volume}`);

        // Loop through all properties in the TOC document (assuming it's a map)
        for (let entryKey of Object.keys(tocData)) {
            let entry = tocData[entryKey];
            if (!entry.page) continue; // Skip if no page property

            let page = entry.page;
            let sichaRef = doc(db, `books/Likkutei Sichos/Sichos/${page}_${volume}`);

            // Update the corresponding Sichos document
            await updateDoc(sichaRef, { isPublic: true });
            console.log(`Updated Sichos document ${page}_${volume}`);
        }
    }
}

updateDocuments().catch(console.error);
