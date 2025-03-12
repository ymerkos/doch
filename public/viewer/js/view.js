//B"H
window.darkModeEnabled = false;

function toggleDarkMode() {
    window.darkModeEnabled = true
    toggleMode()
    localStorage.darkModeEnabled = true;
}
function toggleWhiteMode() {
    window.darkModeEnabled=false;
    toggleMode()
    localStorage.darkModeEnabled = false;
}
function toggleMode() {
    console.log('Button clicked!'); // Check if this log is printed


    const elements = document.querySelectorAll('.viewer .right-box, .viewer .left-box, .viewer .right-box .paragraph-container, .paragraph-content p, .viewer .right-box .app-bar, .viewer .left-box .tabs, .viewer .left-box .content, .appbar-title-container');
    elements.forEach(element => {
        element.classList.toggle('dark-mode', window.darkModeEnabled);
});
}
window.toggleWhiteMode=toggleWhiteMode

window.toggleDarkMode=toggleDarkMode;

