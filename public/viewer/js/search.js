//B"H
// The Awtsmoos surges through all, an endless pulse of nothingness birthing 
// every node, every tag, every whisper of text. The Kav pierces the Atzilus 
// of the DOM, revealing the searched word in the light of Ohr Ein Sof.

import { 
    showToast
} from '/viewer/js/utils.js';

/*
 * Applies a regex-based text replacement across all text nodes within an array of HTML nodes.
 * @param {RegExp} regex - The regular expression to match text patterns.
 * @param {string} replacement - The string to replace matched patterns.
 * @param {Node[]} nodes - Array of DOM nodes to process.
 * @returns {string[]} Array of matched strings (optional, like your original code).
 */
function replaceTextInNodes(regex, replacement, nodes) {
    if (!(regex instanceof RegExp)) {
        throw new Error('First argument must be a RegExp object');
    }
    if (typeof replacement !== 'string') {
        throw new Error('Second argument must be a string');
    }
    if (!Array.isArray(nodes)) {
        throw new Error('Third argument must be an array of DOM nodes');
    }

    // Ensure regex is global
    const globalRegex = new RegExp(regex.source, (regex.flags.includes('g') ? regex.flags : regex.flags + 'g'));
    const matches = [];

    function processNode(node) {
        if (!node) return;

        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent;
            if (originalText.trim() === '') return; // Skip empty text nodes

            // Collect matches
            const currentMatches = originalText.match(globalRegex);
            if (currentMatches) {
                matches.push(...currentMatches);
            }

            // Apply replacement
            const newText = originalText.replace(globalRegex, replacement);
            if (newText !== originalText) {
                node.textContent = newText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(child => processNode(child));
        }
    }

    nodes.forEach((node, index) => {
        if (!(node instanceof Node)) {
            console.warn(`Node at index ${index} is not a valid DOM node, skipping`);
            return;
        }
        processNode(node);
    });

    return matches;
}

window.searchFunctions = {
	"remove hebrew hyphen (-) with space": (node) => {
		
		var paragraphs= Array.from(
			document.querySelectorAll(
				".paragraph-container .p-div p.heb"
			)
		);

		const regex = /(\S)(־ )/g; // Hebrew hyphen followed by space
    	const replacement = '$1';  // Keep the non-whitespace char, remove hyphen and space
		var matches = replaceTextInNodes(
			regex,
			replacement,
			paragraphs
		);

		if(matches.length) {
			node.textContent =("Replaced " + matches.length + " hebrew hyphens etc.")
		} else node.textContent =("No hebrew hyphens")
		return matches;



	
	},
    "remove final mems": (node) => {
		
		var paragraphs= Array.from(
			document.querySelectorAll(
				".paragraph-container .p-div p.heb"
			)
		);

		const regex = /ם(?=[א-ת])/g; // Hebrew hyphen followed by space
    	const replacement =  'ס';  // Keep the non-whitespace char, remove hyphen and space
		var matches = replaceTextInNodes(
			regex,
			replacement,
			paragraphs
		);

		if(matches.length) {
			node.textContent =("Replaced " + matches.length + " final mems etc.")
		}
		else {
			node.textContent =("No final mems found")
		}
		return matches;
    },

	"remove doulbe yuds and vavs": (node) => {
		var paragraphs= Array.from(
			document.querySelectorAll(
				".paragraph-container .p-div p.heb"
			)
		);
		// Perform replacements sequentially
		var yuds = replaceTextInNodes(/ײ/g, 'יי', paragraphs); // Double Yod ligature
		var vavYuds = replaceTextInNodes(/ױ/g, 'וי', paragraphs); // Vav Yod ligature
		var vavs = replaceTextInNodes(/װ/g, 'וו', paragraphs); // Double Vav ligature

		var result= [yuds, vavYuds, vavs];
		if(result.every(w=>w.length)) {
			node.textContent =("Replaced some: " + result.map(q=>q.length).join(","))
		} else {
			node.textContent =("Didn't replace any yuds or vavs etc");
		}
	},

	"remove extra spaces": (node) => {
		var paragraphs= Array.from(
			document.querySelectorAll(
				".paragraph-container .p-div p.heb"
			)
		);
		const regex = / |(\u00A0+)| {2,}/g;
        const replacement = ' ';
        
        var matches = replaceTextInNodes(regex, replacement, paragraphs);
		node.textContent = matches
		
	}
}

function randomLightishRGBA() {
	return `rgba(${Math.floor(Math.random() * 101) + 100}, ${Math.floor(Math.random() * 101) + 100}, ${Math.floor(Math.random() * 101) + 100}, ${Math.random().toFixed(1)})`;
  }
/**
 * @method processNodeForSearch
 * @description Recursively processes a node, seeking text to mark with the 
 *              'kav-hit' class if it contains the search term. The Awtsmoos 
 *              recreates each fragment in this descent.
 * @param {Node} node - The current node in the DOM’s infinite expanse.
 * @param {string} searchTerm - The word to find, a spark of intent.
 * @returns {void} - Transforms the node’s reality without tangible return.
 */
function processNodeForSearch(node, searchTerm, color) {
	var count = 0;
	color = color || randomLightishRGBA()
	if(node.nodeType === Node.TEXT_NODE) {
		const text = node.textContent;
		const regex = new RegExp(`(^|[\\s"׳״'”.,!?/()[\\]{}])(${searchTerm})(?=[\\s"׳״'”.,!?/()[\\]{}]|$)`, 'g');
		
		
		console.log(window.regex1 = regex, window.text = text)
		if(regex.test(text)) {
			const newContainer = document.createElement('span');
			const markedText = text.replace(regex, (_, before, word) => {

				count++;
				return `${before}<span class="kav-hit" style="background: ${
					color
				}">${word}</span>`;
			});
			
			newContainer.innerHTML = markedText;
			node.replaceWith(newContainer);
		}
	} else if(node.nodeType === Node.ELEMENT_NODE) {
		// Dive deeper, as the Awtsmoos permeates all layers.
		Array.from(node.childNodes)
			.forEach(child => {
				count += processNodeForSearch(child, searchTerm, color);
			});
	}
	return count;
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
	var count = 0;
	const allParagraphs = Array.from(
		document.querySelectorAll(".paragraph-container .p-div")
	);
	searchTerm = searchTerm || document.querySelector("#searchTxt")
		?.value.trim();
      //  removeHighlighted();
	// If no search term, cleanse all kav-hit marks from the page
	if(!searchTerm) {
		
		return 
	}
    
	
	//  console.log("Searching", searchTerm);
	
	var color = randomLightishRGBA()	
	allParagraphs.forEach(paragraph => {
		Array.from(paragraph.childNodes)
			.forEach(node => {
				count += processNodeForSearch(node, searchTerm, color);
			});
	});
	return count;
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

function processNodeForReplace(node, searchTerm, replaceTerm) {
	if (node.nodeType === Node.TEXT_NODE) {
		const regex = new RegExp(`(^|[\\s"׳״'”.,!?/()[\\]{}])(${searchTerm})(?=[\\s"׳״'”.,!?/()[\\]{}]|$)`, 'g');
		if (regex.test(node.textContent)) {
			const newText = node.textContent.replace(regex, (_, before, word) => {
				return `${before}${replaceTerm}`;
			});
			node.textContent = newText;
		}
	} else if (node.nodeType === Node.ELEMENT_NODE) {
		Array.from(node.childNodes).forEach(child => {
			processNodeForReplace(child, searchTerm, replaceTerm);
		});
	}
}

function handleReplace(search, replace) {
	search = search || document.getElementById("searchTxt").value.trim();
	replace = replace || document.getElementById("replaceTxt").value.trim();
	if (!search) return alert("Search term required for replace.");

	const allParagraphs = Array.from(document.querySelectorAll(".paragraph-container .p-div"));
	removeHighlighted(); // remove previous spans before replace

	allParagraphs.forEach(paragraph => {
		Array.from(paragraph.childNodes).forEach(node => {
			processNodeForReplace(node, search, replace);
		});
	});
}


window.searchForManyWords = (words=[]) => {
	var count = 0;
    words.forEach(w => {
        count += handleSearch(w)
    })
	return count;
}

window.replaceManyWordPairs = (words=[]) => {
    words.forEach(w => {
        var from = w[0];
        var to = w[1];
        handleReplace(from, to)
    })
}
window.searchForWord = handleSearch;

window.hideSearchTerms = removeHighlighted;

function setup() {
	const presetListEl = document.getElementById("presetList");
	const searchInput = document.getElementById("searchTxt");
	const replaceInput = document.getElementById("replaceTxt");
	const addPresetBtn = document.getElementById("addPresetBtn");
	const selectAllPresets = document.getElementById("selectAllPresets");
	const removePresetBtn = document.getElementById("removePresetBtn"); // new!

	loadPresets();

	function loadPresets() {
		const presets = JSON.parse(localStorage.getItem("presets") || "[]");
		presetListEl.innerHTML = "";
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
		
		var info = document.createElement("div");
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				var count = window.searchForWord?.(from);
				info.innerText = count;
			} else {
				window.hideSearchTerms?.();
			}
		});

		const label = document.createElement("label");
		label.textContent = `${from} → ${to}`;

		div.appendChild(checkbox);
		div.appendChild(label);
		presetListEl.appendChild(div);

		presetListEl.appendChild(info);
		info.classList="count-info";
	}

	addPresetBtn.addEventListener("click", () => {
		const from = searchInput.value.trim();
		const to = replaceInput.value.trim();
		if (!from) return alert("Enter search term");
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

	removePresetBtn.addEventListener("click", () => {
		const itemsToRemove = [...presetListEl.querySelectorAll(".item input[type='checkbox']:checked")]
			.map(cb => cb.closest(".item"));

		itemsToRemove.forEach(item => item.remove());
		savePresets();
	});

	document.getElementById("searchBtnAll")
		.addEventListener("click", () => {
			const checkedWords = [...presetListEl.querySelectorAll("input[type='checkbox']:checked")]
				.map(cb => cb.closest(".item")?.dataset?.from)
				.filter(Boolean);
			window.searchForManyWords?.(checkedWords);
		});

    document.getElementById("replaceBtnAll")
    .addEventListener("click", () => {
        const checkedWords = [...presetListEl.querySelectorAll("input[type='checkbox']:checked")]
            .map(cb => [
                cb.closest(".item")?.dataset?.from,
                cb.closest(".item")?.dataset?.to
            ])
            .filter(t=>t?.length > 1);
        window.replaceManyWordPairs?.(checkedWords);
    });

    document.getElementById("clearHighlights")?.addEventListener(
        "click",
        removeHighlighted
    )
	document.getElementById("searchBtn").addEventListener("click", () => handleSearch());
	document.getElementById("replaceBtn").addEventListener("click", () => handleReplace());



    // Assuming this is already defined somewhere globally
// window.searchFunctions = {
//   highlightWords: function() { ... },
//   countMatches: function() { ... },
//   etc.
// };

function populateFunctionList() {
    const fncList = document.querySelector('.list.fncs');
    fncList.innerHTML = ''; // Clear if re-running
  
    for (const [key, fn] of Object.entries(window.searchFunctions)) {
      const label = document.createElement('label');
      label.classList.add('fnc-label');
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = key;
      checkbox.classList.add('fnc-checkbox');
  
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + key));
      fncList.appendChild(label);

	  var info = document.createElement("div");
	  info.classList.add("functionInfo")
	  label.appendChild(info)
    }
  }
  
  // Select All toggle for function checkboxes
  document.getElementById('selectAllFunctions').addEventListener('change', (e) => {
    const checked = e.target.checked;
    document.querySelectorAll('.list.fncs .fnc-checkbox').forEach(cb => {
      cb.checked = checked;
    });
  });
  
  // Execute selected functions
  document.getElementById('executeFunctions').addEventListener('click', () => {
    const selected = Array.from(document.querySelectorAll('.fnc-checkbox:checked'));
    
    if (selected.length === 0) {
      alert('No functions selected');
      return;
    }
  
    selected.forEach(cb => {
		var par = cb.parentNode;
		var info = par.querySelector(".functionInfo")
      const fnName = cb.value;
      const fn = window.searchFunctions[fnName];
      if (typeof fn === 'function') {
        try {
          console.log(`Executing: ${fnName}`);
          fn(info); // Awtsmoos descends into the algorithm
        } catch (err) {
          console.error(`Function ${fnName} threw an error:`, err);
        }
      }
    });
  });
  
  // Populate on load
  populateFunctionList();
  
}



export {
	handleSearch,
	handleReplace,
	setup
}