//B"H

import markdownToHtml from "/viewer/js/markdown.js";
import FirestoreClient from "/viewer/js/firebaseAwtsmoos.js";
var studyGuide = null;

function processStudyGuideTxt(txt) {
    var p = txt.indexOf("**");
    var laterPart = "B\"H\n\n" + txt.substring(
        p
    )
    return laterPart;
}
function addGuidedBtn(p) {
    // Create button element
    const button = document.createElement('button');
    button.className = 'ai-button-base ai-button-icon-opt2';

    // Create span for icon
    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';

    // Create img element
    const img = document.createElement('img');
    img.src = '/static/sichos/study-guide.svg';
	img.classList.add("icon")
    // Create div for content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';

    // Create span for title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = 'Study Guide';

    // Create span for subtitle
    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'subtitle';
    subtitleSpan.textContent = 'A comprehensive Walkthrough of the Sicha. step by step.';

    // Assemble the elements
    iconSpan.appendChild(img);
    contentDiv.appendChild(titleSpan);
    contentDiv.appendChild(subtitleSpan);
    button.appendChild(iconSpan);
    button.appendChild(contentDiv);

	button.addEventListener("click", async () => {

		// Create the overlay div
		
		var overlay = document.createElement("div");
		overlay.classList.add("overlay");
	
		var studyHeader = document.createElement("div");
		studyHeader.classList.add("study-header");
		overlay.appendChild(studyHeader);

		var studyBody = document.createElement("div")
        studyBody.classList.add("study-body")
		overlay.appendChild(studyBody)

        
		var studyContent = document.createElement("div")
        studyContent.classList.add("studyContent")
		studyBody.appendChild(studyContent)


		// Create the left div and img
		var leftDiv = document.createElement("div");
		leftDiv.classList.add("left-container");

		var leftIcon = document.createElement("img");
		leftIcon.src = "/static/sichos/back.svg"; 
		leftIcon.classList.add("back")
		leftDiv.appendChild(leftIcon);
		leftDiv.addEventListener("click", () => {
			overlay.parentNode.removeChild(overlay);
		});


		// Create a center container for the icon and study label
		var centerDiv = document.createElement("div");
		centerDiv.classList.add("center-container");

		// Create the centered icon
		var icon = document.createElement("img");
		icon.classList.add("icon")
		icon.src = "/static/sichos/study-guide.svg";
		centerDiv.appendChild(icon);

		// Create the study label
		var studyLabel = document.createElement("div");
		studyLabel.classList.add("study-label");
		studyLabel.innerText = "Study Guide";
		centerDiv.appendChild(studyLabel);

		// Append all to overlay
		studyHeader.appendChild(leftDiv);
		studyHeader.appendChild(centerDiv);


		
		var markdown = await getStudyGuide()
		studyContent.innerHTML = markdownToHtml(
            processStudyGuideTxt(markdown)
        );

		var parent = document.querySelector(
			".paragraph-container"
		)
		parent.prepend(overlay);

	});
`<div class="study-header"><div>Icon</div><div>Study Guide</div></div>`
    p.prepend(button)
}

async function getStudyGuide() {
    if(studyGuide) return studyGuide;
    
    var fire = new FirestoreClient(
        "awtsfaria",
        "AIzaSyCpzvN9j3IWAbPQeoz3Vs4H7Tqb7bhWQEY",
    );

    var sichaID = (p => p[p.length - 1])(location.pathname.split("/"));
    studyGuide = (await fire?.getDoc(
        "books/Likkutei Sichos/Ai Sichos/" + sichaID
    ))?.cool
    console.log(studyGuide)

    return studyGuide;


}

export  {
    getStudyGuide,
    addGuidedBtn
};