const hamburgerBtn=document.querySelector('.navbar_hamburgerBtn');
const menu = document.querySelector('.navbar_menu');
const icon = document.querySelector('.navbar_account');

hamburgerBtn.addEventListener('click',()=>{
    menu.classList.toggle('active');
    icon.classList.toggle('active');
    
});