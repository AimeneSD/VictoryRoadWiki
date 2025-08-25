console.log("Nickel👍");

const liensnav = document.querySelectorAll('.nav a');

liensnav.forEach(lien => {
    lien.addEventListener('mouseenter', function(ev) {
        ev.currentTarget.style.color = '#ffee02ff';
    });
    lien.addEventListener('mouseleave', function(ev) {
        ev.currentTarget.style.color = '';
    });
});