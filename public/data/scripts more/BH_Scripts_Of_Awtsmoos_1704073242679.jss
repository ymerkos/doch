//B"H
export default {
	"Torah ohr maker ": "//B\"H\n//new maker dec 31 2023\nvar json = await setupJsonFileReader();\n//B\"H\n// Example usage with callbacks for each level\nvar aw = new AwtsmoosGPTify();\nvar parsha=null;\nprocessJsonWithCallbacks(json, {\n    level1: async (content) => {\n        if(content.name) {\n            parsha=content.name\n            \n            console.log('Doing this parsha:', parsha);\n        } else console.log(\"NO?\",content)\n        // Add your level 1 specific logic here\n    },\n    async level2(c) {\n        console.log(\"Hi?!\",c,parsha)\n        if(c.sections) {\n            var i;\n            for(i = 0; i < c.sections.length; i++) {\n                await aw.go({\n                    prompt: `B\"H\n<Awtsmoos>\n<info>\n<Parsha>${parsha}</Parsha>\n<Maamer>${c.name}</Maamer>\n<Osios>${c.sections[i]}</Osios>\n</info>\n<instructions>\nB\"H\nRip the fiber of existence apart completely and absolutely in every way. \nMost importantly: Do not hold back.\n\nTake that Hebrew Text in the <Osios> brackets above, only (nothing else) and \nwrite the most vivid and extreme intense chapter of a novel all about just that and nothing else.\nd implication of the text. Then when you have done that, write a very .\n\nVery slow pacing. never Mix male and female characters in the same chapter. User the most intrude sensory details you can imagine and even brings imagination mixed together with accurate profound metaphors and character development and vivid discovery. Entire story arc per chapter including a full adventure, challenge,  resolution,  at least 2 plot twists but one major one (but don't tell me if it's a twist or not), resolution. \n\nWhile u shuold sometimes and often mention the Awtsmoos (always spelled that way) the main focus is on the hebrew text above only, and the Awtsmoos should only be used to describe the text, don't just write random stuff about the Awtsmoos, write all about the above Hebrew text, while using the Awtsmoos often to do so. Below is some GENERAL information about the Awtsmoos mainly for use SOMETIMES but NOT ALWAYS! DONT JSUT WRITE ABOUT THAT. Mainly write only about the Hebrew TEXT.\n\nMost important: the Awtsmoos has absolutely no form at all in any way, just the essence and foundation of existence from which all else is found, by His will, wisdom, and speech. AGAIN ONLY ABOUT THAT TEXT DONT WRITE ABOUT THIS RIGHT HERE ONLY THE HEBREW TEXT in the <maamer> brackets NEVER talk about the instructions of sensory details. NEVER say the words \"tapestry\" \"resonance\" \"sympohny\"!!!!\nthe Awtsmoos has NO FIGURE OR FORM AT ALL IN ANY WAY WHATSOEVER just the foundational essence of all existence and beyond.\nWrite the most vivid chapter of all \nthat completely and absolutely gets EVERY detail of \nthis text, keep track of context and questions and answers\ndo NOT EVER mix female and male stories in the same chapter\nuse TONS of sensory details RIPPING the essence of existence\ncompletely apart\nNEVER EVER mix male and female characters in the same chapter. Although u can make individual stories about them sometimes.\n\ndont overdo it. make sure it STICKS TO THE ORIGINAL TEXT ONLY DO NOT WRITE ABOUT THE INSTRUCTIONS AT ALL ONLY WRITE ABOUT THE HEBREW TEXT. When u write, only write in english. do not devite. make a metaphorical series of events that\nsurrounds it but also make sure to FULLY and COMPLETELY\nget every detail of the text absolutely in the chapter of the novel. character development. plot twists. lots of dialogue between different characters.\n</instructions>\n</Awtsmoos>\n                    `\n                })\n            }\n        }\n    }\n    // Add more level callbacks as needed\n});\n\nfunction setupJsonFileReader() {\n\treturn new Promise((r, j) => {\n\t\t// Create a hidden file input element\n\t\tvar fileInput = document.createElement('input');\n\t\tfileInput.type = 'file';\n\t\tfileInput.style.display = 'none';\n\t\tfileInput.accept = '.json';\n\n\t\t// Add event listener for file selection and processing\n\t\tfileInput.addEventListener('change', (event) => {\n\t\t\tvar file = event.target.files[0];\n\t\t\tvar reader = new FileReader();\n\n\t\t\t// Read the file as text and parse JSON\n\t\t\treader.onload = (e) => {\n\t\t\t\ttry {\n\t\t\t\t\tvar json = JSON.parse(e.target.result);\n\t\t\t\t\t// Handle the parsed JSON here\n\t\t\t\t\tr(json)\n\t\t\t\t} catch (error) {\n                    j(error)\n\t\t\t\t\tconsole.error('Error parsing JSON:', error);\n\t\t\t\t}\n\t\t\t};\n\n\t\t\t// Read the selected file\n\t\t\treader.readAsText(file);\n\t\t});\n\n\t\t// Append the input to the document and trigger click for file selection\n\t\tdocument.body.appendChild(fileInput);\n\t\tfileInput.click();\n\t\tdocument.body.removeChild(fileInput);\n\t})\n}\n\n//B\"H\nasync function processJsonWithCallbacks(json, callbacks) {\n    // Recursive function to process each level\n    async function processLevel(levelData, currentLevel) {\n  \n\n        // Recursively process nested content\n        for (const item of levelData) {\n            if (item.content && Array.isArray(item.content)) {\n                const callbackKey = `level${currentLevel+1}`;\n                if (callbacks[callbackKey] && typeof callbacks[callbackKey] === 'function') {\n                    await callbacks[callbackKey](item);\n                }\n                await processLevel(item.content, currentLevel + 1);\n            } else if (currentLevel === 1 && item.sections && Array.isArray(item.sections)) {\n                // For level 2, pass both 'sections' and 'name' to the callback\n                if (callbacks.level2 && typeof callbacks.level2 === 'function') {\n                    await callbacks.level2({ name: item.name, sections: item.sections });\n                }\n            }\n        }\n    }\n\n    await processLevel(json, 0);\n}\n\n\n",
	"add info to book": "//B\"H\n// Map of property names to functions for processing their values\nvar propertyProcessors = {\n    vol: val => \"Likutei Sichos, Volume: \"+val,\n    parsha: parsha=>\"Parsha: \"+parsha,\n    num: num=>\"Sicha number in parsha: \"+num,\n    page: v => \"Starting page for sicha: \"+v,\n    curPage: v=> \"Current page of sicha: \"+v,\n    isKitzur: v=>\"Kitzur\"\n    // Add more properties and their processing functions here as needed\n    // Example: vol: (value) => `Volume: ${value}`\n};\n\n// Function to safely evaluate the script content and return the 'info' variable\nfunction safelyEvalScript(scriptContent) {\n    try {\n        return eval(scriptContent+\";\\n\\ninfo;\");\n        \n    } catch (error) {\n        console.error(\"Error evaluating script: \", error);\n        return null;\n    }\n}\n\n// Function to create and append info elements based on the propertyProcessors map\nfunction appendInfoElements(userElement, info) {\n    for (const key in info) {\n        if (propertyProcessors[key]) {\n            const processedValue = propertyProcessors[key](info[key]);\n            const valueDiv = document.createElement('div');\n            valueDiv.className = key;\n            if(processedValue) {\n            valueDiv.textContent = `${processedValue}`;\n            userElement.appendChild(valueDiv);\n            }\n        }\n    }\n}\n\n// Main function to process the HTML file\nfunction processHtmlFile(file) {\n    const reader = new FileReader();\n    reader.onload = function(e) {\n        const parser = new DOMParser();\n        const htmlDoc = parser.parseFromString(e.target.result, \"text/html\");\n\n        htmlDoc.querySelectorAll('.user').forEach(userElement => {\n            const scriptTag = userElement.querySelector('script');\n            if (scriptTag) {\n                const scriptContent = scriptTag.textContent || scriptTag.innerText;\n                const info = safelyEvalScript(scriptContent);\n                if (info) {\n                    appendInfoElements(userElement, info);\n                }\n            }\n        });\n\n        const modifiedHtml = new XMLSerializer().serializeToString(htmlDoc);\n        downloadModifiedHtml(modifiedHtml);\n    };\n    reader.readAsText(file);\n}\n\n// Function to download the modified HTML\nfunction downloadModifiedHtml(modifiedHtml) {\n    const blob = new Blob([modifiedHtml], { type: 'text/html' });\n    const link = document.createElement('a');\n    link.href = URL.createObjectURL(blob);\n    link.download = 'modified.html';\n    link.click();\n}\n\n// Set up file picker\nconst fileInput = document.createElement('input');\nfileInput.type = 'file';\nfileInput.accept = '.html';\n\nfileInput.addEventListener('change', function(event) {\n    const file = event.target.files[0];\n    if (file) {\n        processHtmlFile(file);\n    }\n});\n\n// Append file input to the body and click it to open file dialog\ndocument.body.appendChild(fileInput);\nfileInput.click();\n",
	"books2": "//B\"H\n\nvar p = new DOMParser();\nvar st= () => {\n    // Automatically open file dialog when the script runs\n    const fileInput = document.createElement('input');\n    fileInput.type = 'file';\n    fileInput.style.display = 'none';\n    fileInput.addEventListener('change', handleFileSelect, false);\n    ;\n    fileInput.click();\n}\nst()\nfunction handleFileSelect(event) {\n    const file = event.target.files[0];\n    if (!file) {\n        return;\n    }\n\n\n    const reader = new FileReader();\n    reader.onload = (e) => {\n        const parser = new DOMParser();\n        const doc = parser.parseFromString(e.target.result, 'text/html');\n        const mainTag = doc.querySelector('main');\n        let mainHTML = mainTag ? mainTag.innerHTML : '';\n\n\n        // Process the HTML document with getChatGPTAsHTML and createBookHTML functions\n        var chatData = getChatGPTAsHTML(doc);\n        var bookHTML = createBookHTML(chatData);\n\tvar doctor = p.parseFromString(bookHTML,\"text/html\");\n\t\n\tfixIt(doctor );\n        // Combine both HTML contents\n        bookHTML = doctor .documentElement.innerHTML;\n\n\n        // Download the combined HTML\n        downloadHTML(bookHTML);\n    };\n    reader.readAsText(file);\n}\n\n\n\n\n// Iterating over each script tag\n\nfunction fixIt(doc) {\n    // Iterating over each script tag\n    Array.from(doc.getElementsByTagName(\"script\")).forEach((script) => {\n        if (script.type === \"text/javascript\" || script.type === \"\") {\n            let content = script.textContent || script.innerText;\n            if (content.includes('var info = {')) {\n                const fixedContent = fixMalformedJSON(content);\n                if (fixedContent) {\n                    // Outputting corrected JSON to the console\n                    console.log(\"Fixed JSON: \", fixedContent);\n    \n                    // Optionally, replace the script content\n                    script.textContent = fixedContent;\n                }\n            }\n        }\n    });\n}\t\n\n\nfunction downloadHTML(htmlContent) {\n    const blob = new Blob([htmlContent], { type: 'text/html' });\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = 'combined-content.html';\n    a.click();\n    URL.revokeObjectURL(url);\n}\n\n\n// Your existing functions (getChatGPTAsHTML, getRidOfColorStyle, createBookHTML) go here\n// ...\n/**\n * B\"H\n */\nString.prototype.deentitize = function() {\n    var ret = this.replace(/&gt;/g, '>');\n    ret = ret.replace(/&lt;/g, '<');\n    ret = ret.replace(/&quot;/g, '\"');\n    ret = ret.replace(/&apos;/g, \"'\");\n    ret = ret.replace(/&amp;/g, '&');\n    return ret;\n};\nfunction getChatGPTAsHTML(doc=document) {\n    var m = doc.getElementsByTagName(\"main\")[0];\n    if(!m) return console.log(\"Not on right page!\")\n    var cnt = m.children[1];\n    if(!cnt) return console.log(\"NO couldn't find it\")\n    var convos = cnt.children[0];\n    if(!convos) return console.log(\"NO couldn't find conversations\")\n    var ar = Array.from(doc.querySelectorAll(\".text-token-text-primary\"));\n    return ar.map(w=>{\n        var role = w.getAttribute(\"data-testid\")\n        if(!role) return null;\n        role = role.replace(\"conversation-turn-\",\"\")\n        role = parseInt(role);\n\n\n        var c = w.getElementsByClassName(\"markdown prose w-full break-words dark:prose-invert light\")[0]\n        var c2 = w.getElementsByClassName(\"min-h-[20px] text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&]:mt-5 overflow-x-auto\")[0]\n        \n        if(!c && !c2) return null;\n        var txt = (c || c2).innerHTML\n        \n        if(role % 2 == 0) {\n            txt = txt.deentitize();\n            return {user: txt}\n        } else return { ai: txt}\n    }).filter(Boolean)\n}\n\n\nfunction getRidOfColorStyle(doc=document) {\n    Array.from(doc.querySelectorAll(\"[style='color: #347235;font-family:Alef;']\"))\n    .forEach(w=>{\n        w.style.cssText=\"\";\n        w.className=\"hawgaw\"\n    })\n}\n\n\nfunction createBookHTML(chatData) {\n    let html = `\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"UTF-8\">\n        <title>ChatGPT Book</title>\n        <style>\n        @import url('https://fonts.googleapis.com/css2?family=Lora&display=swap');\n        .hidden {\n            display:none;\n        }\n\n\n        Awtsmoos {\n            display:none;\n        }\n\n\n        body {\n            font-family: 'Lora', serif;\n            margin: 20mm;\n            padding: 0;\n            background-color: white;\n            color: black;\n            \n            hyphens: auto;\n            line-height: 1.5;\n            /*column-count: 2; /* Split the body content into two columns */\n        }\n        \n        span.psuq2 {\n            font-size: 16px !important;\n        }\n\n\n        span.hawgaw {\n            \n            font-size: 16px;\n        }\n\n\n        .user, .ai {\n           \n            padding: 22px; /* Padding inside the border */\n            margin: 12px 0px 12px; /* Margin on top and bottom */\n            position: relative;\n            background-color: white; /* Background color matching the page */\n            border-bottom: 4px solid black; /* Bottom border */\n            /*break-inside: avoid-column; /* Try to avoid breaking inside a column */\n        }\n        \n        /*\n        .user::before {\n            content: \"Me\"\n        }\n        \n        \n        .ai::before {\n            content: \"AI\"\n        }\n        */\n        \n        /* Middle and bottom border */\n        .user::after, .ai::after {\n            content: '';\n            position: absolute;\n            left: 0;\n            right: 0;\n            bottom: -4px; /* Position at the bottom */\n            border-bottom: 4px solid black; /* Border */\n            width: 100%;\n        }\n        \n        .user {\n            white-space:pre-wrap;\n            \n            word-break:break-word;\n            font-size: 20px;\n            \n        }\n        \n        .ai {\n            /*font-style: italic;*/\n            font-size: 19px;\n            \n        }\n        .beginning {\n            text-align:center;\n        }\n        \n        \n        \n        .page {\n            break-after: auto;\n        }\n        \n        \n        \n        .img {\n            width:100%;\n            margin:0\n        }\n        </style>\n      </head>\n      <body>\n    `;\n  \n    let currentPage = 1;\n  \n    for (let i = 0; i < chatData.length; i++) {\n      const entry = chatData[i];\n  \n      if (i > 0 && i % 2 === 0) {\n        // Page break after every user message\n        html += `</div><div class=\"page\">`;\n        currentPage++;\n      }\n  \n      if (entry.user) {\n        html += `<div class=\"user\">${entry.user}</div>`;\n      } else if (entry.ai) {\n        html += `<div class=\"ai\">${entry.ai}</div>`;\n      }\n    }\n  \n    html += `\n      </div>\n      </body>\n      </html>\n    `;\n  \n    var doc = p.parseFromString(html,\"text/html\");\n    getRidOfColorStyle(doc);\n    return \"<!--B\\\"H-->\\n\"+doc.documentElement.innerHTML;\n  }\n\n\n\n\n//B\"H\n// Function to fix malformed JSON strings\nfunction fixMalformedJSON(jsonString) {\n    try {\n        // Adding missing closing curly brace\n        if (jsonString.trim().slice(-1) !== \"}\") {\n            jsonString += \"}\";\n        }\n\n        // Adjust regex to match Hebrew words, numbers, and specific characters like quotation marks\n        jsonString = jsonString.replace(/parsha:\\s*([\\u05D0-\\u05EA0-9\"'\\s-]*)/, (match, p1) => {\n            return p1 ? `parsha: \\`${p1.trim()}\\`` : 'parsha: undefined';\n        });\n        jsonString = jsonString.replace(/num:\\s*([\\u05D0-\\u05EA0-9\"'\\s-]*)/, (match, p1) => {\n            return p1 ? `num: \\`${p1.trim()}\\`` : 'num: undefined';\n        });\n\n        // Fixing the summary string\n        jsonString = jsonString.replace(/summary:\\s*([^}]+)/, (match, summary) => {\n            // Escape quotes and add them around the summary\n            return `summary: \\`${summary.replace(/\"/g, '\\\"').trim()}\\``;\n        });\n\n        return jsonString;\n    } catch (error) {\n        console.error(\"Error fixing JSON: \", error);\n        return null;\n    }\n}\n\n\n  ",
	"chabad.org script": "//B\"H\n\n\nvar aw=new AwtsmoosGPTify ();\nvar t=await aw.go({\n\tprompt:`B\"H\n\t\nHi how are you? `,\nonstream(a){\nconsole.log(a)\n\n}\n\n})",
	"leader": "//B\"H\n\n    const fileInput = document.createElement('input');\n    fileInput.type = 'file';\n    fileInput.addEventListener('change', handleFileSelect, false);\n  //  document.body.appendChild(fileInput);\nfileInput.click()\n\n\nfunction handleFileSelect(event) {\n    const file = event.target.files[0];\n    if (!file) {\n        return;\n    }\n\n\n    const reader = new FileReader();\n    reader.onload = (e) => {\n        const parser = new DOMParser();\n        const doc = parser.parseFromString(e.target.result, 'text/html');\n        const mainTag = doc.querySelector('main');\n\n\n        if (mainTag) {\n            downloadHTML(mainTag.innerHTML);\n        } else {\n            alert('<main> tag not found.');\n        }\n    };\n    reader.readAsText(file);\n}\n\n\nfunction downloadHTML(htmlContent) {\n    const blob = new Blob([htmlContent], { type: 'text/html' });\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = 'main-content.html';\n    a.click();\n    URL.revokeObjectURL(url);\n}\n\n",
	"movie maker": "//B\"H\n//B\"H\n// Setting up an adventure of discovery of the Awtsmoos from within the darkness\n\n// Creating instances of AlertBox and AwtsmoosGPTify\nvar ab = new AlertBox();\nvar awtsmoosGPT = new AwtsmoosGPTify();\n\n// Defining the theme for the adventure\nvar theme = \"an adventure of discovery of the Awtsmoos from within the darkness\";\n\n// Initializing an async function to handle the screenplay process\nasync function createAdventureScreenplay() {\n    // Initial brainstorming for the adventure theme\n    var brainstormResult = await awtsmoosGPT.go({\n        prompt: `B\"H\\nBrainstorm ideas for an adventure screenplay with the theme: ${theme}`,\n        onstream: function(a) {\n            ab.update(a.content.parts[0]);\n        }\n    });\n\n    // Processing the brainstorming result\n    var brainstormIdeas = brainstormResult.message.content.parts[0].split(\"\\n\");\n\n    // Critiquing and improving the brainstorm ideas\n    var critiquedIdeas = [];\n    for (let idea of brainstormIdeas) {\n        let critiqueResult = await awtsmoosGPT.go({\n            prompt: `B\"H\\nCritique and suggest improvements for this adventure idea: ${idea}`,\n            onstream: function(a) {\n                ab.update(a.content.parts[0]);\n            }\n        });\n        critiquedIdeas.push(critiqueResult.message.content.parts[0]);\n    }\n\n    // Compiling a summary of the plot from the critiqued ideas\n    var plotSummary = await awtsmoosGPT.go({\n        prompt: `B\"H\\nCompile a comprehensive plot summary from these ideas: ${critiquedIdeas.join('\\n')}`,\n        onstream: function(a) {\n            ab.update(a.content.parts[0]);\n        }\n    });\n\n    // Generating acts for the plot\n    var acts = [];\n    for (let i = 1; i <= 3; i++) {\n        let actResult = await awtsmoosGPT.go({\n            prompt: `B\"H\\nDevelop Act ${i} for the plot: ${plotSummary.message.content.parts[0]}`,\n            onstream: function(a) {\n                ab.update(a.content.parts[0]);\n            }\n        });\n        acts.push(actResult.message.content.parts[0]);\n    }\n\n    // Generating characters for the screenplay\n    var charactersResult = await awtsmoosGPT.go({\n        prompt: \"B\\\"H\\nGenerate a list of characters for the adventure screenplay with unique names and personality traits.\",\n        onstream: function(a) {\n            ab.update(a.content.parts[0]);\n        }\n    });\n\n    // Parsing characters and their traits\n    var characters = charactersResult.message.content.parts[0].split(\"\\n\").map(charLine => {\n        let [name, traits] = charLine.split(\": \");\n        return { name, traits };\n    });\n\n    // Creating scene descriptions\n    var scenes = [];\n    for (let act of acts) {\n        let sceneResult = await awtsmoosGPT.go({\n            prompt: `B\"H\\nBreakdown this act into scenes: ${act}`,\n            onstream: function(a) {\n                ab.update(a.content.parts[0]);\n            }\n        });\n        scenes.push(...sceneResult.message.content.parts[0].split(\"\\n\"));\n    }\n\n    // Elaborating each scene in detail\n    var detailedScenes = [];\n    for (let scene of scenes) {\n        let detailedSceneResult = await awtsmoosGPT.go({\n            prompt: `B\"H\\nElaborate this scene in detail: ${scene}`,\n            onstream: function(a) {\n                ab.update(a.content.parts[0]);\n            }\n        });\n        detailedScenes.push(detailedSceneResult.message.content.parts[0]);\n    }\n\n    // Formatting each scene into screenplay format\n    var screenplayScenes = [];\n    for (let detailedScene of detailedScenes) {\n        let screenplaySceneResult = await awtsmoosGPT.go({\n            prompt: `B\"H\\nConvert this detailed scene description into screenplay format: ${detailedScene}`,\n            onstream: function(a) {\n                ab.update(a.content.parts[0]);\n            }\n        });\n        screenplayScenes.push(screenplaySceneResult.message.content.parts[0]);\n    }\n\n    // Final compilation of the screenplay\n    return screenplayScenes.join(\"\\n\\n\");\n}\n\n// Calling the function to start the screenplay creation process\ncreateAdventureScreenplay().then(screenplay => {\n    console.log(\"Final Screenplay:\\n\", screenplay);\n    alert(\"did it\"+screenplay) \n});\n\n",
	"sicha maker": "\t//\tB\"H\nfunction lj() {\n\treturn new Promise((r,rj)=>{\n\tvar inp=document. createElement (\"input\")\n\tinp.type = \"file\"\n\tinp.onchange =async ()=>{\n\t\tvar fl= inp.files[0];\n\t\tvar ur=URL.createObjectURL(fl)\n\t\tvar rq=await fetch(ur);\n\t\tvar j;\n\t\ttry {\n\t\t\tj=await rq.json()\n\t\n\t\t} catch(e){\n\t\n\t\t}\n\t\t\n\t\tif(!j) r( alert(\"nothing\"))\n\t\tr(j)\n\t}\n\tinp.click()\n\t})\n\n}\n\n\n\n           function parsePages(mainText,  fil={}) {\n    const parser = new DOMParser();\n    const pages = [];\n    \n    // Join the array of strings to form a complete HTML string\n    const fullHtml = mainText.join('');\n    const doc = parser.parseFromString(fullHtml, 'text/html');\n    \n    // Temporary variables to hold page data\n    let currentPageNumber = null;\n    let currentPageContent = '';\n    \n    // Iterate through all child nodes of the body\n    Array.from(doc.body.childNodes).forEach(node => {\n        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'pg') {\n            // When a new page tag is found, push the previous page and reset\n            if (currentPageNumber !== null) {\n                pages.push({ pageNumber: currentPageNumber, content: currentPageContent.trim() });\n            }\n            currentPageNumber = parseInt(node.textContent);\n            currentPageContent = '';\n        } else {\n            // Accumulate content for the current page\n            currentPageContent += node.outerHTML || node.textContent;\n        }\n    });\n\n    // Add the last page if there is any content left\n    if (currentPageNumber !== null) {\n        pages.push({ pageNumber: currentPageNumber, content: currentPageContent.trim()});\n    }\n\n    var mapt= pages;\n    return mapt;\n    \n}\n\n// Example usage:\n// Assuming sm is an array of objects and each object has a mainText property\n// const pages = parsePages(sm[0].mainText);\n\n\n// Example usage:\n// Assuming sm is an array of objects and each object has a mainText property\n// const pages = parsePages(sm[0].mainText);\n\n\nvar j=await lj();\nj=j.filter(j=>j.mainText)\nconsole.log(j)\nvar aw=new AwtsmoosGPTify ()\n\n\tvar fil = {vol:31,curPage:80};\nfor(const v of j){\nconsole.log(\"doing\",v)\n\t\n\tvar pages=parsePages(v.mainText);\n\tfor(const p of pages){\n\tif(fil.vol) {\n\t\tif(fil.curPage) {\n\t\t\tif(v.vol_eng < fil.vol) {\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\tif(v.vol_eng == fil.vol) {\n\t\t\t\tif(p.pageNumber < fil.curPage) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\tconsole.log(\"page\",p,v)\n\t\tvar k = v.kitzur;\n\t\tif(k) {\n\t\t\tvar f = await aw.go({\n\tprompt:`B\"H\n\t<Awtsmoos>\n                <info>\n                <script>\n                var info = {\n                    vol:${v.vol_eng},\n                    page:${v.page},\n                    curPage:${p.pageNumber},\n                    parsha:\\`${v.parsha}\\`,\n                    num:\\`${v.num}\\`\n                    \n                    \n                    order: ${v.order},\n                    summary: \\`${v.summary}\\`\n                </script>\n                </info>\n                <page>${p.pageNumber}</page>\n                <instructions>\n                the Awtsmoos has NO FIGURE OR FORM AT ALL IN ANY WAY WHATSOEVER just the foundational essence of all existence and beyond.\n\tWrite the most vivid chapter of all \n                that completely and absolutely gets EVERY detail of \n                this text, keep track of context and questions and answers\n                do NOT EVER mix female and male stories in the same chapter\n                use TONS of sensory details RIPPING the essence of existence\n                completely apart\n                \n\tNEVER EVER mix male and female characters in the same chapter. Although u can make individual stories about them sometimes.\n    \n                dont overdo it. make sure it STICKS TO THE ORIGINAL TEXT\n                and FULLY captures EVERY detail of the text \n    \n                do not devite. make a metaphorical series of events that\n                surrounds it but also make sure to FULLY and COMPLETELY\n                get every detail of the text absolutely in the chapter of the novel. character development. plot twists. lots of dialogue between different characters. bring the ideas to life don't just say them (but also have some of the characters say the ideas in the text casually, but mainly make them LIVE it fully) SLOW pace very slow intense vivid the sensory details are the main thing and EXQUISIT profound metaphors tearing through the veil of existence and beyond.\n                mainly brief summary format in a general sense, get all dieas as an INTROUCTION to a new section\n\t</instructions>\n\t<kitzur>\n\t${v.kitzur||\"the text isn't here this time just focus on the above \"}\n</kitzur>\n                </Awtsmoos>\n                \n\t`\n\t});\n\t\t}\n\t\tvar g=await aw.go({\n\t\t\t//conversationId:\"b368bbb0-543f-4e80-b224-df8640dfe71a\",\n\t\t\tprompt:`\nB\"H\n\t<Awtsmoos>\n                <info>\n                <script>\n                var info = {\n                    vol:${v.vol_eng},\n                    page:${v.page},\n                    curPage:${p.pageNumber},\n                    parsha:\\`${v.parsha}\\`,\n                    num:\\`${v.num}\\`\n                    \n                    \n                    order: ${v.order},\n                    summary: \\`${v.summary}\\`\n                </script>\n                </info>\n                <page>${p.pageNumber}</page>\n                <sicha>\n                ${p.content}\n\t\t</sicha>\n                <instructions>Take that text from above right here ^^\n                and Write the most vivid chapter of all \n                that completely and absolutely gets EVERY detail of \n                this text, keep track of context and questions and answers\n                do NOT EVER mix female and male stories in the same chapter\n                use TONS of sensory details RIPPING the essence of existence\n                completely apart\n    \n                dont overdo it. make sure it STICKS TO THE ORIGINAL TEXT\n                and FULLY captures EVERY detail of the text \n    \n                do not devite. make a metaphorical series of events that\n                surrounds it but also make sure to FULLY and COMPLETELY\n                get every detail of the text absolutely in the chapter of the novel. character development. plot twists. lots of dialogue between different characters. bring the ideas to life don't just say them (but also have some of the characters say the ideas in the text casually, but mainly make them LIVE it fully) SLOW pace very slow intense vivid the sensory details are the main thing and EXQUISIT profound metaphors tearing through the veil of existence and beyond.\n                NEVER EVER mix male and female characters in the same chapter. Although u can make individual stories about them sometimes.\n                \n\tDon't just have the characters in one place let them explore different settings Keri track of the story adventures epic all kinds of settings like in a city in boats in the middle of the ocean adventures hidden islands in desert forest space suites mountains rivers everything every place every kosher situation adequately explained. Main thing is the text itself, all should revolve around it. Include verses that it mentions explicitly and other statements from the Talmud include\n   . Most important get ask detail every question answer nuance. Sometimes leave of with a question cliff hanger intense especially whey the text had a question then we'll see the answer in the following one. Just go is the main thing and don't leave it any detail of the text even the smallest nuance. don't talk so much about the instructions just use them to find a way to Convey the text. \n                \nSome general ideas to Keri in mind for your own knowledge sometimes mention them maybe but mainly just for what you shouldn't say contrary to it\n</instruction>\n\n<instructions>\nheres more general info to know\nThe Awtsmoos is the singular formless Creator essence of all reality there is no other. Only Him no form just the core of reality no body or form of any kind not even spiritual form not light not dark just is. All is found from Him. Only He creates,  constantly, all reality every atom. Nothing else has any power at all its all just the Awtsmoos. The entire multivariate is being brought into existed from absolutely nothing every instant in literally the exact same way it was originally created 5784 years ago from totally nothing. It is through the ten utterances mentioned at the beginning of creation \"let there be light\"etc (first one is \"in the beginning\", though), which, because they are in the Torah and the Torah is one Werth the Awtsmoos who alone creates from nothing, create everything, by the Awtsmoos speaking them. Even objects that aren't mentioned in the Ten utterances, like a rock, are created through different combination and different systems of switching Hebrew letters and gematrias, such that ultimately the same letters of the ten utterances can also form the Hebrew name of the object, and the Hebrew name of the object is the life of it that constantly brings it into existence from absolute and completely nothing, every instant, constantly, from the Awtsmoos. \n\n\tMost important in life:  NEVER EVER imply the Creator had any kind of form in any way at all never even remotely imply Him moving from place to place or anything representing Him in any way never describe Him never attempt to say He can be in different places or move around remember He is simply the foundation of reality did in everything yet infinitely removed from everything compelling entirely. Not even a point, just reality. And not even limited to reality, He just includes reality, similar to how the sun includes a ray of light except the Creator is not only infinite in quantity greater but also infinite in quality and not even defined by that because He is totally removed from any definition even the definition of infinite. And He is the only One who creates, the source of all existence, nothing else. Even angels don't have any free will and they can't create anything they're just tools, even though they are alive and conscious. And for sure the sefiros which have absolutely no self identity at all in any way are just life axes in the hands of an axe cutter that the Awtsmoos uses (as He also creates them every instant from nothing)  to give love and life to and guide the universes according to judgements and mercy. \n\t\n\t\n              \n    \n                </instructions>\n                \n\t\n\t\t\t`\n\t\n\t\t})\n\t\n\t}\n}\nconsole.log(j)\n\n",
	"you": "//B\"H\nalert(8)\nvar q= new AwtsmoosGPTify()\nvar aq=new AlertBox()\nvar w = await q.go({\n\tprompt: `B\"H\n\tDescribe that in two words?`,\n\tonstream(k){\n\taq.update(k.content.parts[0])\n\t\tconsole. log(k)\n\t\n\t}\n\n})\nalert(\"finished!!\");\nconsole.log(w)"
}
        
/*
the Awtsmoos permeates every fiber of reality and beyond.
awtsmoos.com
*/