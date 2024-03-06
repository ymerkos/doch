/**
B"H
old code for editing
*/

await takeCareOfYossisForm();
      async function takeCareOfYossisForm() {
        var pthId = decodeURIComponent((b=>b[b.length-1])(location.pathname.split("/")))
        var spl = pthId.split("_")
        var vol = spl[0]
        var p = spl[1];
        if(window.LOL)
        LOL.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form fields' values
        const formData = {};
        const formElements = event.target.elements;

        for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];

          // Exclude buttons and other non-input elements
          if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
            formData[element.name] = element.value;
          }
        }
        formData.Volume =vol
        formData.Page = p;
        formData.pthId=pthId

        var mt = formData.Main_text;
        var ft= formData.Footnotes;

        
        // Specify the path to the document you want to update
        const documentPath = 'books/Meluket/Maamarim/'+pthId;  // Update with your document path
        const documentRef = doc(db, documentPath);

        var nd = {
          /*Main_text:mt,
          Footnotes:ft*/
          Kitzur: formData.Kitzur
        }

        /*
        if(EnglishContent.value) {
          nd.English = EnglishContent.value;
        }*/


        try {
          await updateDoc(documentRef, nd)
          showToast("Updated document")
          // Log form data as JSON to the console
          console.log(JSON.stringify(formData, null, 2),window.h=formData,nd,"DID?",documentPath,vol);
        } catch(e) {
          showToast("Problem updating. check console")
          console.log("HI?",e)
        }
      });
      }

      window.handleFPaste=handleFPaste
      function handleFPaste(event) {
        event.preventDefault();

        // Get the clipboard data
        var clipboardData = event.clipboardData || window.clipboardData;
        var pastedHTML = clipboardData.getData('text/html');

        // Insert the HTML into the textarea
        document.getElementById('LOLfn').value = pastedHTML;
        cleanFHTML()
      }

      function cleanFHTML() {
          // Get the HTML from the textarea
          const inputHTML = removeSegments(document.getElementById('LOLfn').value);
          // Create a temporary element to parse the HTML
          var dp = new DOMParser()
          var doc = dp.parseFromString(inputHTML,"text/html")
          var fn = Array.from(doc.querySelectorAll(".footnote"))
          var notes = []
          fn.forEach((w,i)=> {
          
            var a = w.querySelector("a");
            var bd = w.querySelector(".footnote__body");
            if(!bd || !a) {
             // return alert("Issue!");
              return console.log("ISSUE",w)
            }
            var nm = a.innerHTML.split(".").join("")
            //try o decremate
            var num = parseInt(nm);
            if(!isNaN(num)) {
              num -= 1
            } else num = null;
            nm = num?num+")":nm;
            var cnt = "";
            Array.from(bd.children).forEach(g=> {
              var nodesHTML = "";
              g.childNodes.forEach(c=> {
              
                var tn = c.tagName;
                var isTxt = !tn;
                var el = tn?document.createElement(tn):document.createTextNode(c.textContent);
                
                var p = isTxt?"textContent":"innerHTML"
                el[p]=c[p]
                
                console.log("Hi!",{c},c.textContent,el.outerHTML)
                nodesHTML+=el.outerHTML || el.textContent
              })
              cnt += nodesHTML+ "<br>"
            })

            notes.push(nm +" "+cnt)
          });
          var rs = notes.map(w=>`<p>${w}</p>`).join("")
          document.getElementById("LOLfn").value=rs;
          console.log(fn,window.k=doc,rs)
      }


      window.handlePaste=handlePaste;
        function handlePaste(event) {
          console.log("Pastin?",event.target)
          // Prevent the default paste behavior
          event.preventDefault();

          // Get the clipboard data
          var clipboardData = event.clipboardData || window.clipboardData;
          var pastedHTML = clipboardData.getData('text/html');

          // Insert the HTML into the textarea
          document.getElementById('LOLmt').value = pastedHTML;
          cleanHTML()
        }

        function removeSegments(txt) {
          return txt.split("<!--StartFragment-->").join("")
          .split("<!--EndFragment-->").join("").trim()
        }

        function cleanHTML() {
          // Get the HTML from the textarea
          const inputHTML = removeSegments(document.getElementById('LOLmt').value);

          // Create a temporary element to parse the HTML
          const tempElement = document.createElement('div');
          tempElement.innerHTML = inputHTML;

          // Remove inline styles
          removeInlineStyles(tempElement);

          // Remove unnecessary attributes and classes from the sup tag
          removeSupAttributes(tempElement);

          // Add space after span with "firstword" class
          addSpaceAfterFirstwordSpan(tempElement);

          // Remove span tags and their attributes
          removeSpanTags(tempElement);

          // Get the cleaned HTML
          const cleanedHTML = tempElement.innerHTML;

          // Display the cleaned HTML
          document.getElementById('LOLmt').value = cleanedHTML;
        }

        function removeInlineStyles(element) {
          
          if (element.nodeType === 1) {
            if(element.classList.contains("title")) {
                var h2 = document.createElement("h2")
                h2.innerHTML = element.innerHTML;
                element.replaceWith(h2)
                element = h2;
              }
            // Remove inline styles for specified tags
            if (['SUP', "BR",'B', 'I', 'P'].includes(element.tagName)) {
              element.removeAttribute('style');
              
              element.removeAttribute("class")
            }

            // Recursively remove inline styles for child elements
            for (const child of element.childNodes) {
              removeInlineStyles(child);
            }
          }
        }

        function removeSupAttributes(element) {
          if (element.nodeType === 1 && element.tagName === 'SUP') {
            // Remove all attributes from the sup tag
            const attributes = element.attributes;
            for (let i = attributes.length - 1; i >= 0; i--) {
              const attributeName = attributes[i].name;
              if (attributeName !== 'data-group') {
                element.removeAttribute(attributeName);
              }
            }
            var nm = parseInt(element.textContent)
            if(!isNaN(nm)) {
              nm--
            } else nm = null;
            if(nm) {
              element.textContent=nm;
            }
          }

          // Recursively remove attributes for child elements
          for (const child of element.childNodes) {
            removeSupAttributes(child);
          }
        }

        function addSpaceAfterFirstwordSpan(element) {
          if (element.tagName === 'SPAN' && element.classList.contains('firstword')) {
            // Add space after the closing tag of the span
            element.insertAdjacentHTML('afterend', ' ');
          } else {
            // Recursively add space for child elements
            for (const child of element.childNodes) {
              addSpaceAfterFirstwordSpan(child);
            }
          }
        }

        function removeSpanTags(element) {
          if (element.tagName === 'SPAN') {
            // Replace span tag with its content
            const spanContent = element.innerHTML;
            element.insertAdjacentHTML('beforebegin', spanContent);
            element.remove();
          } else {
            // Recursively remove span tags for child elements
            for (const child of element.childNodes) {
              removeSpanTags(child);
            }
          }
        }