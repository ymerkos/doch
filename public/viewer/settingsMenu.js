//B"H

  

import indexer from "/scripts/indexify.js";
var desktopHeight = 50;
const expanded = document.getElementById('expanded');
const toggleButtons = document.querySelectorAll('.right-box .toggle-button');
let currentState = ''; // Initialize the state variable
var newState
var clickedAtAll=false;
var old;

var indexHTML = null;

var sichaIndexData =null;
async function getIndexHTML(holder) {
    if(!holder) holder = document.createElement("div");
    if(window.isMaamar) {
        await indexer({
            htmlEl: holder,
            volumeNumber: window.curVolume,
            url: window.isMaamar ? "/viewer/meluket/" :`/viewer/sicha/`,
            
            databasePath: [
                "books",
                window.isMaamar ? "Meluket" : 
                "Likkutei Sichos",
                "TOC_VOL"
            ]
        })///b> נבוא לענין מ״ש בזהר דישראל ומלאכים מקדשי לי׳ לעילא ותתא כולא כחדא. דהנה בדרך כלל ההעלאת מ״ן של נש״י כמו שהם למטה מלובשים בגוף נקרא העלאת מ״ן בבחי׳ חיצוניות לגבי העלאת מ״ן דמלאכים שאינן בגופות גשמיים ולכן מתלהבים ברשפי אש האהבה בפנימי׳ וכן ביראה זעות מחיל כסא. ולכן העלאת מ״ן דמלאכים נקרא העלאת מ״ן דפנימית. וזהו החילוק שבין הקדושה שישראל מקדשים למטה ובין העלאת מ״ן של קדושת המלאכים ויש עוד מדרגה שלישית בהעלאת מ״ן והוא העלאת מ״ן דמקיפים עצמן. דהיינו הנשמות כמו שהם למעלה בלתי מלובשים בגוף. שזהו העלאת מ״ן מבחי׳ מקיפים עצמן כי הנשמה כמו שהיא למעלה אין לה גוף וכלי המגביל כלל משא״כ המלאכים שיש להם גופים שהם רוחות ואש לוהט. וכמ״ש מזה במ״א בד״ה מזמור שיר חנוכת הבת ולכן העלאת מ״ן דנשמות שבלי גופים נקרא העלאת מ״ן דמקיפים לגבי העלאת מ״ן דמלאכים (אך כבר נתבאר למעלה דעיקר האתעדל״ת והעלאת מ״ן זהו מנשמות ישראל המלובשים למטה בגוף. אשר ע״כ צ״ל דבחינת העלאת מ״ן שבבחי׳ מקיף שייך ג״כ למטה ממש בנשמה המלובשת בגוף. וכמשנ״ת במ״א בד״ה ראה ריח בני גבי ריח בוגדיו שבחי׳ תשובה הוא העלאת מ״ן שבבחי׳ מקיף כו׳ וכן בכל אדם צ״ל כל ימיו בתשובה וזהו בחי׳ בכל מאדך שהוא בחי׳ גלי גבול של הכלי והיינו בחי׳ מקיף אלא שזהו באמת בחי׳ גילוי מן הנשמה שלמעלה מן הגוף שבבחי׳ מקיף וכמ״ש במ״א סד״ה שמאלו תחת לראשי. שבכל מאדך הוא בחי׳ עבודת עיקר הנשמה היינו בחי׳ המקיף כו׳ והמכוון שהמקיף מאיר בבחי׳ הנשמה שבגוף להיות בחי׳ בכל מאדך ועד״ז נתבאר בד״ה שאו את ראש כו׳ לגלגלתם בפ׳ במדבר. ובד״ה כי תצא להמשיך גילוי אלקות מבחי׳ מזל היא הנשמה שלמעלה מן הגוף כו׳. ובביאור ע״פ ששים המה מלכות. בענין חסידים הראשונים כו׳ ע״ש ובד״ה ויקהל משה בענין הנשמה יתירה שמתגלה בשבת כו׳. והנה בכל לבבך ובכל נפשך זהו העלאת מ״ן דפנימית אך פי׳ בכל נפשך הוא ג״כ לבושי הנפש מודומ״ע אשר המעשה הוא העלאת מ״ן דחיצוניות כו׳. נמצא בכל לבבך  ובכל נפשך ובכל מאדך זהו ג׳ בחינות העלאת מ״ן הנ״ל וג׳ בחי׳ אלו י״ל שזהו כענין ג׳ בחי׳ מזון לבוש בית המבואר במ״ כי מזון היינו א״פ. ולבוש זהו מעשה המצות והוא העלאת מ״ן דחיצוניות. ובית זהו בכל מאדך כו׳ כמ״ש סד״ה השמים כסאי) נמצא יש ג׳ מדרגות בהעלאת מ״ן היינו בחי׳ מקיפים ופנימים וחיצוניות והן דרך כלל ג׳ עולמות בריאה יצירה עשיה כי יוצר אור ובורא חשך שיצירה נקרא אור פנימי ובריאה נקרא חשך ר״ל בחי׳ מקיף שאינו מושג ביצירה וכך הוא סדר ההשתלשלות שמהמקיף נמשך אח״כ הארה להיות בבחי׳ א״פ ועצם האור נשאר בבחי׳ מקיף. ואח״כ מהא״פ נעשה מקיף למטה בעולם תחתון שנחשב האור מקיף התחתון בחי׳ חיצוניות לגבי הא״פ שלמעלה ממנו כו׳. וזהו בחי׳ עשייה [ומ״מ עשייה שרשו לעילא כנ״ל שהחיצוניות שרשו גבוה מהא״פ כו׳ וכמ״ש ג״כ ע״פ יביאו לבוש מלכות איך התהוות העשייה גשמיות הוא דייקא מבחי׳ סכ״ע וכמ״ש בזהר וירא (קט״ו א׳) עשייה איהו לעילא כו׳ וכ״ה בפ׳ בהר דק״ח ע״ב]. וזהו ענין ג׳ העדרים ששלח יעקב מנחה לעשו אחיו שהוא העלאת מ״ן לעולם התהו שמשם נפלו הכלים ונשברו ונתהוה מזה עשו וכמ״ש בד״ה ויקח מן הבא בידו וג׳ עולמות בי״ע הן שנתהוו משבה״כ לכן העלה מ״ן ג׳ עדרים שהן ג׳ בחי׳ הנ״ל מקיפים ופנימיים וחיצוניות. ונקרא כל א׳ עדר בפ״ע שהוא בחי׳ ומדרגה משונה ומובדל מזולתה. כמו החילוק בין נשמות שבגופים לגבי המלאכים. וכן חילוק מדרגת המלאכים שהם בגופות רוחניים לגבי הנשמות שהם בלי גוף כלל. וז״ש עדר עדר לבדו כו׳ ויצו את הראשון כו׳ ויצו גם את השני גם את השלישי כו׳ הרי חלקם לד׳ מדרגות ממש. אף שדרף פרט גם בכל מדרגה מג׳ מדרגות הללו שי בה כמה ריבוא רבבות בחי׳ ומדרגות שונות זה מזה מ״מ כולם בבחי׳ סוג א׳ כמו העלאת מ״ן דחיצוניות נקרא דרך כלל העלאת מ״ן דעשייה וזהו כמשל העדר א׳ אף שבעדר זה יש ג״כ כמה מדרגות יש שעיקר עבודתם בצדקה וגמ״ח ויש שעיקר עבודתם בעסק התורה ויש שעיקר עבודתם בתפלה ויש בתענית וכיוצא בזה ועכ״ז כללותם קומה אחת וכמו עד״מ בעדר אחד יש כמה שינויים בצאן זה מראהו וקומתו וטובו כך וזה כך מ״מ הכל עדר א׳ והעלאת מ״ן דפנימית הוא בחי׳ וסוג אחר כו׳ ולכן נק׳ עדר בפ״ע כו׳ והעלה יעקב מ״ן מכל ג׳ בחי׳ אלו להמ
        
        console.log(window.gg=holder,holder.innerHTML)
    } else {
        console.log("HI",sichaIndexData)
        if(!sichaIndexData) {
            var p = location.pathname.split("/");
            var ls = p[p.length-1].split("_")[1];
            var data = await getKeys("books/Likkutei Sichos/TOC_VOL/"+ls);
            window.TOC = data;
            
            setThings(data, (w) => `/likkutei-sichos/view/${ls}/${w.page}_${ls}`, holder);
            sichaIndexData = holder.innerHTML;
        } else {
            holder.innerHTML = sichaIndexData
        }
    }
    return holder.innerHTML;
}

toggleButtons.forEach(button => {

button.addEventListener('click', async () => {

    var t = document.querySelector("#work_title");
   
   if(!clickedAtAll) {
    clickedAtAll = true;
    if(t) {
        old = t.textContent;
    }
   }
    
    newState = button.id === 'indexButton' ? 'index' : 'settings';

    // Set different content based on the state
    if (newState === 'index') {
        if(t) {
            
            t.textContent = "Table of Contents"
        }
 

    
    expanded.innerHTML = ""

    var idxb = document.createElement("div");
    expanded.appendChild(idxb)
    idxb.className = "index-body";

    var idxc = document.createElement("div");
    idxc.className="index-container container";
    idxb.appendChild(idxc);
    
    await getIndexHTML(idxc);
    
        idxc.dataset.menu = true;

//        expanded.innerHTML = indexD.innerHTML;
    } else if (newState === 'settings') {
        if(t) {
            t.textContent = "Settings"
        }
    expanded.innerHTML = /*html*/`
        <!-- Content for the 'settings' state -->
        <!-- Add your settings content here -->
        <div class="settings-parent" data-menu="true">
        <div class="settings">
            <div class="settings-section font-size">
                <div class="setting">
                    <div class="setting-name">TEXT SIZE</div>
                    <div class="settings-toggles">
                        <button class="decrease-size" onclick="decreaseFont()">
                        <img src="/resources/svg/increase_font_size_symbol.svg">
                        </button>
                        <button class="increase-size" onclick="increaseFont()">
                        <img src="/resources/svg/increase_font_size_symbol.svg">
                        </button>
                    </div>
                </div>
            </div>
    
            <div class="settings-section color-mode">
                <div class="setting">
                    <div class="setting-name">THEME</div>
                    <div class="settings-toggles">
                        <button class="light" onclick="toggleWhiteMode()"></button><button class="dark" id="darkModeButton" onclick="toggleDarkMode()"></button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
    }

    // Toggle the height
    expanded.style.height = currentState === newState ? '0' : (newState === 'settings' ? '20vh' : `${desktopHeight}vh`);
    if(currentState === newState) {
        if(t) {
            t.textContent = old
        }
    }
    currentState = currentState === newState ? '' : newState;
    console.log("HI!",currentState,old)
   
});
expanded.onblur = () => {
    expanded.style.height = 0;
}
});


addEventListener("click", e=> {

    if (!e.target.closest('[data-menu="true"]')) {
        var t = document.querySelector("#work_title");
        // If not, execute the rest of your code here
        // For example:
        expanded.style.height = 0;
        if(currentState === newState) {
            if(t) {
                t.textContent = old
            }
        }
        console.log("Clicked outside the menu element or its children");
    }
});


var tabs = Array.from(document.getElementsByClassName("tab"));
var indicator = document.querySelector(".tab-indicator");
var contents = document.getElementsByClassName("content");

for (var i = tabs.length - 1; i >= 0; i--) {
((i) => tabs[i].onclick = () => switchTab(i))(i);
}

// Listen for window resize event
window.addEventListener("resize", updateIndicator);

// Initialize first tab as active
switchTab(3);

// Function to switch tabs
function switchTab(tabIndex) {
// Update tabs
for (var i = tabs.length - 1; i >= 0; i--) {
contents[i].classList.remove("active");
tabs[i].classList.remove("active");
}
tabs[tabIndex].classList.add("active");
contents[tabs.length - 1 - tabIndex].classList.add("active");

// Move indicator
updateIndicator();
}

// Function to update the indicator position and size
function updateIndicator() {
    var activeTab = document.querySelector(".tab.active");

    if (activeTab) {
    indicator.style.width = activeTab.offsetWidth + 'px';
    indicator.style.left = activeTab.offsetLeft + 'px';
    }
}
