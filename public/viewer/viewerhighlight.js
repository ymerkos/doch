//B"H
import {changeHashElement} from "/viewer/js/utils.js"
let paragraphContainer = document.querySelector('.paragraph-content');
let paragraphs = Array.from(paragraphContainer.querySelectorAll('.p-div'));

var lastPar = null;

var curParagraph = null;
var lastParagraph = null;

function highlightParagraph() {
    let topParagraph = null;
    var index = null;
    // Get container dimensions
    const containerTop = paragraphContainer.scrollTop + (paragraphContainer.offsetHeight / 4); // Adjusted container top boundary
    const containerBottom = containerTop + paragraphContainer.offsetHeight - (paragraphContainer.offsetHeight / 4); // Adjusted container bottom boundary

    // Find the first visible paragraph
    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const paragraphTop = paragraph.offsetTop;
        const paragraphBottom = paragraphTop + paragraph.offsetHeight;

        // Check if paragraph is within the adjusted viewport boundaries
        if (paragraphTop <= containerBottom && paragraphBottom >= containerTop) {
            topParagraph = paragraph;
            index = i;
            break;
        }
    }

    if (topParagraph) {
        if(!topParagraph.classList.contains("active")) {
            
        }
        paragraphs.forEach(p => p.classList.remove('active'));
        
        topParagraph.classList.add('active');
        curParagraph = topParagraph;

        if (lastParagraph !== curParagraph)
            notificationalism(topParagraph, index);
        lastParagraph = curParagraph;
        lastPar = topParagraph;
    }
}

function setHash(pId) {
  // changeHashElement("par", pId)
}

function notificationalism(p, index) {
    if(window.isSichaEditing) return;
    var n = window.notes;
    if(!n) return;
    
    var nt = document.querySelector("#content0")
    if(!nt) return console.log("No notes!")
    nt.innerHTML = "";

    var s = Array.from(
        p.getElementsByTagName("sup")
    );
    if(!s.length) {
        return;
    }
    var curNotes = {};
    
    s.forEach(w => {
        if(n[w.innerText]) {
            curNotes[w.innerText] = n[w.innerText]
        }
    })
    var an = {};
    window.activeNotes = an;
    window.cn=curNotes;
    //console.log(window.cn=curNotes);
    Object.keys(curNotes).forEach(q => {
        var p = document.createElement("p");
 
        p.className="ftnote"
        p.innerHTML = curNotes[q];
        an[q] = p;
        nt.appendChild(p)
    })

    setHash(p.dataset.pIndex)

}
window.callEvents = callEvents;
function callEvents() {
    var initialHash = location.hash;
    paragraphContainer = document.querySelector('.paragraph-content');
    paragraphs = Array.from(paragraphContainer.querySelectorAll('.p-div'));
    paragraphContainer.addEventListener('scroll',
    //  highlightParagraph
    highlightParagraph
    );
    highlightParagraph();

    // Resize observer for the container
    const resizeObserver = new ResizeObserver(entries => {
        // Ensure that the correct paragraph is highlighted after resize
        highlightParagraph();
    });

    // Start observing the container
    resizeObserver.observe(paragraphContainer);
    location.hash = initialHash
    // Create a custom event with some detail (data)
    var awtsmoosWroteAll = new CustomEvent("awtsmoosWroteAll", {
        detail: {
        wroteAll: true
        } // You can pass any data you want in the detail property
    });
    window.dispatchEvent(awtsmoosWroteAll);
}
callEvents();
window.callEvents=callEvents



        /*
// Function to determine and highlight the current paragraph
function highlightCurrentParagraph() {
    const offset = 200;
    // Find the current scroll position relative to the container
    const scrollPosition = window.scrollY + paragraphContainer.getBoundingClientRect().top + offset;

    // Keep track of whether a paragraph has been highlighted
    let isHighlighted = false;

    paragraphs.forEach((para,i) => {
    // Get the paragraph's position relative to the document
    const paraPosition = para.getBoundingClientRect().top + window.scrollY;

    // Check if the paragraph is within the current viewport plus the offset
    if (scrollPosition >= paraPosition && scrollPosition < paraPosition + para.offsetHeight) {
        // Highlight the paragraph
        para.classList.add('paragraph-selected');
        isHighlighted = true;
    } else {
        // Remove highlight from paragraphs not in the viewport
        para.classList.remove('paragraph-selected');
    }
    });

    // If no paragraphs were highlighted and we have paragraphs, highlight the last one
    if (!isHighlighted && paragraphs.length > 0) {
        paragraphs[paragraphs.length - 1].classList.add('paragraph-selected');
    }
}
*/