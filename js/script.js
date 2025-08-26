console.log("Nickel👍");

const sidebar = document.querySelector('.sidebar');
const offScreenMenu = document.querySelector('.off-screen-menu');
sidebar.addEventListener('click', () =>{
    sidebar.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
})




const liensnav = document.querySelectorAll('.redirect-text');

liensnav.forEach(lien => {
    lien.addEventListener('mouseenter', function(ev) {
        ev.currentTarget.style.color = '#ffffffff';
    });
    lien.addEventListener('mouseleave', function(ev) {
        ev.currentTarget.style.color = '';
    });
});
