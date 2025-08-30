console.log("characters.js loaded");

const filterbtn = document.querySelectorAll('.filter-options label');

filterbtn.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log("Cliqué");
    });
});