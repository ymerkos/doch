//B"H
// Function to process and fix field names
async function fixMainTextFields() {
    const sichosCollectionRef = collection(db, "books", "Likkutei Sichos", "Sichos");

    try {
        const sichosSnapshot = await getDocs(sichosCollectionRef);

        for (const docSnap of sichosSnapshot.docs) {
            const docRef = docSnap.ref;
            const data = docSnap.data();

            // Check if "Main_Text" exists and "Main_text" does not exist
            if (data.Main_Text !== undefined && data.Main_text === undefined) {
                console.log(`Fixing document: ${docSnap.id}`);

                const mainTextValue = data.Main_Text; // Store value before deleting

                await updateDoc(docRef, {
                    Main_text: mainTextValue,  // Add the correct field
                    Main_Text: deleteField()  // Proper way to delete a field in the modular SDK
                });

                console.log(`Fixed document: ${docSnap.id}`);
            } else {
                console.log(`No changes needed for: ${docSnap.id}`);
            }
        }
    } catch (error) {
        console.error("Error processing documents:", error);
    }
}

// Run the function
fixMainTextFields();