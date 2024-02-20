//B"H

const expanded = document.getElementById('expanded');
const toggleButtons = document.querySelectorAll('.right-box .toggle-button');
let currentState = ''; // Initialize the state variable

var clickedAtAll=false;
var old;
toggleButtons.forEach(button => {
button.addEventListener('click', () => {

    var t = document.querySelector("#work_title");
   
   if(!clickedAtAll) {
    clickedAtAll = true;
    if(t) {
        old = t.textContent;
    }
   }
    
    const newState = button.id === 'indexButton' ? 'index' : 'settings';

    // Set different content based on the state
    if (newState === 'index') {
        if(t) {
            
            t.textContent = "Table of Contents"
        }
    expanded.innerHTML = /*html*/`
        <!-- Content for the 'index' state -->
        <!-- Add your index content here -->
        <div class="index-body">
        
        <div class="index-container">
          <div class="index title">
          </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
            <div class="index-item">
                <div class="index-header">
                    <div class="index-title">משפטים ב</div>
                    <div class="index-number">148</div>
                </div>
                <div class="index-line"></div>
                <div class="index-content">
                    משמן של היתידות מוכח שהיו יכולים לתקוע אותם בארץ, אך רש"י אומר "איני יודע" האם תקעו אותם בפועל. "ואומר אני ששמן מוכיח עליהם", שמזה שהתורה קוראת אותם בשם יתידות משמע שהיו תקועים – דזהו ענין היתד לתקעו. ב' אופנים בהשראת השכינה בקרקע המדבר.
                </div>
            </div>
        </div>
        </div>
    </div>
    `;
    } else if (newState === 'settings') {
        if(t) {
            t.textContent = "Settings"
        }
    expanded.innerHTML = /*html*/`
        <!-- Content for the 'settings' state -->
        <!-- Add your settings content here -->
        <div class="settings-parent">
        <div class="settings">
            <div class="settings-section font-size">
                <div class="setting">
                    <div class="setting-name">TEXT SIZE</div>
                    <div class="settings-toggles">
                        <button class="decrease-size" onclick="decreaseFont()">&#x1F5DA;</button>
                        <button class="increase-size" onclick="increaseFont()">&#128474;</button>
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
    expanded.style.height = currentState === newState ? '0' : (newState === 'settings' ? '20vh' : '70vh');
    if(currentState === newState) {
        if(t) {
            t.textContent = old
        }
    }
    currentState = currentState === newState ? '' : newState;
    console.log("HI!",currentState,old)
   
});
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
