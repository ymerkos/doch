//B"H

function toggleEnglish(e) {
    var btn = e.target;
    if(!window.showingEnglish) {
        window.showingEnglish = true;

        btn.innerText = "א";
        return;;
        var cd = window?.currentData;
        if(!cd) {
            console.log("no english");
            return;
        }

        var Maamar = cd.Maamar;
        if(!Maamar) {
            return console.log("no Maamar")
        }

        var maamarParagraphHolder = document.querySelector(
            ".paragraph-container.maamer"
        );
        Maamar.forEach((w, i) => {
            var eng = w.eng;
            if(!eng) return;
            var englishPar = document.createElement("p");
            englishPar.innerHTML = eng;
            englishPar.classList.add("english-p")
            var child = maamarParagraphHolder?.children?.[i];
            if(!child) return;
            child.appendChild(englishPar)
        })
    } else {
        window.showingEnglish = false;
        btn.innerText = "A";
        return;
        var eng = document.querySelectorAll(
            ".english-p"
        )

        eng.forEach(q => {
            q.parentNode.removeChild(q)
        })
    }
}

export {
    toggleEnglish
}