console.log("Nickel👍");

const hamburger = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
})
