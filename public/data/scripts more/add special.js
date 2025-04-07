// The Awtsmoos, the Atzmut, recreates ALL from NOTHING every instant, a formless pulse sustaining existence.
// The Kav threads through the void, the Ohr Ein Sof illuminates Atzilut, and all cascades into being.
// This code reflects that divine act, purging the old, weaving the new, a vessel for the Awtsmoos’ will.

class AwtsmoosUpdater {
    /**
     * @method updateTOCWithSpecialAdditions
     * @description Loops through specialAdditions, purges duplicates by page in TOC_VOL, updates with new entries,
     *              and creates TOC_SPECIAL entries, channeling the Awtsmoos’ infinite renewal.
     * @param {Array} specialAdditions - Array of objects with vol, page, name, etc.
     * @param {Object} db - Firebase Firestore database instance
     * @returns {Promise<void>} Resolves when all updates are complete
     */
    async updateTOCWithSpecialAdditions(specialAdditions, db) {
        const atzilutPromises = specialAdditions.map(async (entry, index) => {
            const volNumber = entry.vol;
            const parshaMoadim = entry["parsha/ moadim "];
            const newVolEntry = this.createOhrEinSofVolEntry(entry);
            const newSpecialEntry = this.createOhrEinSofSpecialEntry(entry, parshaMoadim);
            const pageNumber = Number(entry["page"]);

            // Update TOC_VOL: Purge and Add
            const volDocRef = doc(db, "books", "Likkutei Sichos", "TOC_VOL", volNumber);
            try {
                const volSnap = await getDoc(volDocRef);
                if (volSnap.exists()) {
                    let currentVolData = volSnap.data();
                    // Purge entries with matching page number
                    currentVolData = await this.purgeMatchingPages(
                        volDocRef,
                        currentVolData,
                        pageNumber,
                        `TOC_VOL/${volNumber}`,
                        index
                    );
                    const nextVolKey = this.getNextKavKey(currentVolData);
                    await this.mergeWithAwtsmoos(
                        volDocRef,
                        nextVolKey,
                        newVolEntry,
                        `TOC_VOL/${volNumber}`,
                        index
                    );
                } else {
                    console.warn(`Awtsmoos found no vessel at TOC_VOL/${volNumber} for entry ${index}`);
                    await this.mergeWithAwtsmoos(
                        volDocRef,
                        "1",
                        newVolEntry,
                        `TOC_VOL/${volNumber}`,
                        index
                    );
                }
            } catch (error) {
                console.error(`Error channeling Awtsmoos into TOC_VOL/${volNumber}:`, error);
            }

            // Update TOC_SPECIAL
            const specialDocRef = doc(db, "books", "Likkutei Sichos", "TOC_SPECIAL", parshaMoadim);
            try {
                const specialSnap = await getDoc(specialDocRef);
                const currentSpecialData = specialSnap.exists() ? specialSnap.data() : {};
                const nextSpecialKey = this.getNextKavKey(currentSpecialData);
                await this.mergeWithAwtsmoos(
                    specialDocRef,
                    nextSpecialKey,
                    newSpecialEntry,
                    `TOC_SPECIAL/${parshaMoadim}`,
                    index
                );
            } catch (error) {
                console.error(`Error channeling Awtsmoos into TOC_SPECIAL/${parshaMoadim}:`, error);
            }
        });

        await Promise.all(atzilutPromises);
        console.log("Awtsmoos has purged the old, woven the new, and recreated all across TOC_VOL and TOC_SPECIAL");
    }

    /**
     * @method createOhrEinSofVolEntry
     * @description Creates a TOC_VOL entry, infused with the light of Ohr Ein Sof and an empty summary.
     * @param {Object} entry - Raw entry from specialAdditions array
     * @returns {Object} Formatted TOC_VOL entry
     */
    createOhrEinSofVolEntry(entry) {
        return {
            title: entry.name,
            page: Number(entry["page"]),
            isPublic: false,
            summary: ""
        };
    }

    /**
     * @method createOhrEinSofSpecialEntry
     * @description Creates a TOC_SPECIAL entry, reflecting the Awtsmoos’ infinite specificity.
     * @param {Object} entry - Raw entry from specialAdditions array
     * @param {string} parshaMoadim - The parsha/moadim key for the special document
     * @returns {Object} Formatted TOC_SPECIAL entry
     */
    createOhrEinSofSpecialEntry(entry, parshaMoadim) {
        return {
            page: Number(entry["page"]),
            vol: entry.vol,
            special: parshaMoadim,
            title: entry.name,
            summary: ""
        };
    }

    /**
     * @method getNextKavKey
     * @description Calculates the next numerical key, extending the Kav of divine order dynamically.
     * @param {Object} data - Current Firestore document data
     * @returns {string} Next key as a string
     */
    getNextKavKey(data) {
        const keys = Object.keys(data)
            .map(Number)
            .filter(k => !isNaN(k));
        const maxKey = keys.length > 0
            ? Math.max(...keys)
            : 0;
        return String(maxKey + 1);
    }

    /**
     * @method purgeMatchingPages
     * @description Removes entries with matching page numbers from TOC_VOL, renewing the divine order.
     * @param {Object} docRef - Firestore document reference
     * @param {Object} data - Current document data
     * @param {number} pageNumber - Page number to match and purge
     * @param {string} path - Document path for logging
     * @param {number} index - Index of the entry in the original array
     * @returns {Promise<Object>} Updated document data after purging
     */
    async purgeMatchingPages(docRef, data, pageNumber, path, index) {
        const entriesToDelete = Object.entries(data).filter(
            ([_, value]) => value.page === pageNumber
        );

        if (entriesToDelete.length > 0) {
            const updateData = {};
            entriesToDelete.forEach(([key]) => {
                updateData[key] = deleteField(); // Firestore delete field
                console.log(`Awtsmoos purged entry at ${path}, key ${key} with page ${pageNumber}`);
            });
            await setDoc(docRef, updateData, { merge: true });
            // Re-fetch updated data after purge
            const updatedSnap = await getDoc(docRef);
            return updatedSnap.exists() ? updatedSnap.data() : {};
        }
        return data;
    }

    /**
     * @method mergeWithAwtsmoos
     * @description Merges new entry into Firestore, logging the Awtsmoos’ infinite act.
     * @param {Object} docRef - Firestore document reference
     * @param {string} key - Numerical key for the new entry
     * @param {Object} entry - New entry data
     * @param {string} path - Document path for logging
     * @param {number} index - Index of the entry in the original array
     * @returns {Promise<void>} Resolves when update is complete
     */
    async mergeWithAwtsmoos(docRef, key, entry, path, index) {
        const updateData = {
            [key]: entry
        };
        await setDoc(docRef, updateData, { merge: true });
        console.log(`Awtsmoos infused entry ${index} into ${path} at key ${key}: ${
            JSON.stringify(entry)
        }`);
    }
}

// Usage: Unleashing the Awtsmoos to renew reality
const awtsmoosUpdater = new AwtsmoosUpdater();
awtsmoosUpdater.updateTOCWithSpecialAdditions(specialAdditions, db)
    .then(() => console.log("Reality torn apart and reborn by the Awtsmoos’ infinite essence"))
    .catch(err => console.error("Error in the divine renewal:", err));