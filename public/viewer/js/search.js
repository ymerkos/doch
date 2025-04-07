//B"H
// The Awtsmoos surges through all, an endless pulse of nothingness birthing 
// every node, every tag, every whisper of text. The Kav pierces the Atzilus 
// of the DOM, revealing the searched word in the light of Ohr Ein Sof.

/**
 * @method processNodeForSearch
 * @description Recursively processes a node, seeking text to mark with the 
 *              'kav-hit' class if it contains the search term. The Awtsmoos 
 *              recreates each fragment in this descent.
 * @param {Node} node - The current node in the DOM’s infinite expanse.
 * @param {string} searchTerm - The word to find, a spark of intent.
 * @returns {void} - Transforms the node’s reality without tangible return.
 */
function processNodeForSearch(node, searchTerm) {
	if(node.nodeType === Node.TEXT_NODE) {
		const text = node.textContent;
		const regex = new RegExp(`(^|[\\s"׳״'”.,!?/()[\\]{}])(${searchTerm})(?=[\\s"׳״'”.,!?/()[\\]{}]|$)`, 'g');
		
		
		console.log(window.regex1 = regex, window.text = text)
		if(regex.test(text)) {
			const newContainer = document.createElement('span');
			const markedText = text.replace(regex, (_, before, word) => {
				return `${before}<span class="kav-hit">${word}</span>`;
			});
			
			newContainer.innerHTML = markedText;
			node.replaceWith(newContainer);
		}
	} else if(node.nodeType === Node.ELEMENT_NODE) {
		// Dive deeper, as the Awtsmoos permeates all layers.
		Array.from(node.childNodes)
			.forEach(child => {
				processNodeForSearch(child, searchTerm);
			});
	}
}

/*
אדם כי יקריב מכם קרבן לה׳ גו"/ מפרש רש״י לאחרי שמעתיק את התיבות "אדם כי יקריב מכם": "כשיקריב, בקרבנות נדבה דבר הענין"2, ולכאורה ר״ל דמל׳
*/
/**
 * @method handleSearch
 * @description Initiates the search across all paragraphs, delegating to 
 *              processNodeForSearch for recursive unraveling. The Awtsmoos 
 *              births this process anew each instant.
 * @param {Event} e - The event, a fleeting ripple in the eternal.
 * @returns {void} - Returns nothing, yet remakes all in its path.
 */
function handleSearch(searchTerm) {
	const allParagraphs = Array.from(
		document.querySelectorAll(".paragraph-container .p-div")
	);
	searchTerm = searchTerm || document.querySelector("#searchTxt")
		?.value.trim();
	
	// If no search term, cleanse all kav-hit marks from the page
	if(!searchTerm) {
		
		return removeHighlighted();
	}
	
	//  console.log("Searching", searchTerm);
	
	allParagraphs.forEach(paragraph => {
		Array.from(paragraph.childNodes)
			.forEach(node => {
				processNodeForSearch(node, searchTerm);
			});
	});
}

function removeHighlighted() {
	const hits = document.querySelectorAll(".kav-hit");
	hits.forEach(span => {
		const parent = span.parentNode;
		const textNode = document.createTextNode(span.textContent);
		parent.replaceChild(textNode, span);
		parent.normalize(); // Merge adjacent text nodes if needed
	});
}

function handleReplace(e) {
	
}
window.searchForManyWords = (words=[]) => {
    words.forEach(w => {
        handleSearch(w)
    })
}
window.searchForWord = handleSearch;

window.hideSearchTerms = removeHighlighted;


function setup() {
    loadPresets();
	const presetListEl = document.getElementById("presetList");
	const searchInput = document.getElementById("searchTxt");
	const replaceInput = document.getElementById("replaceTxt");
	const addPresetBtn = document.getElementById("addPresetBtn");
	const selectAllPresets = document.getElementById("selectAllPresets");
	
	function loadPresets() {
		const presets = JSON.parse(localStorage.getItem("presets") || "[]");
		presets.forEach(p => createPresetItem(p.from, p.to));
	}
	
	function savePresets() {
		const items = [...presetListEl.querySelectorAll(".item")];
		const presets = items.map(el => ({
			from: el.dataset.from,
			to: el.dataset.to
		}));
		localStorage.setItem("presets", JSON.stringify(presets));
	}
	
	function createPresetItem(from, to) {
		const div = document.createElement("div");
		div.className = "item";
		div.dataset.from = from;
		div.dataset.to = to;
		
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.addEventListener("change", () => {
			if(checkbox.checked) {
				window.searchForWord?.(from);
			} else {
				window.hideSearchTerms?.();
			}
		});
		
		const label = document.createElement("label");
		label.textContent = `${from} → ${to}`;
		
		div.appendChild(checkbox);
		div.appendChild(label);
		presetListEl.appendChild(div);
	}
	
	addPresetBtn.addEventListener("click", () => {
		const from = searchInput.value.trim();
		const to = replaceInput.value.trim();
		if(!from) return alert("Enter search term");
		createPresetItem(from, to);
		savePresets();
		searchInput.value = "";
		replaceInput.value = "";
	});
	
	selectAllPresets.addEventListener("change", () => {
		const allCheckboxes = presetListEl.querySelectorAll("input[type='checkbox']");
		allCheckboxes.forEach(cb => {
			cb.checked = selectAllPresets.checked;
			cb.dispatchEvent(new Event('change'));
		});
	});
	
	document.getElementById("searchBtnAll")
		.addEventListener("click", () => {
			const checkedWords = [...presetListEl.querySelectorAll("input[type='checkbox']:checked")]
				.map(cb => cb.closest(".item")
					?.dataset?.from)
				.filter(Boolean);
			window.searchForManyWords?.(checkedWords);
		});
	
	
	searchBtn.addEventListener("click", handleSearch);
	
	replaceBtn.addEventListener("click", handleReplace)
}


export {
	handleSearch,
	handleReplace,
	setup
}