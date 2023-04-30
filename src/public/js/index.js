/*INDEX*/

/*******************************************************CONSTANTES/VARIABLES*************************************************************/

const nav = document.querySelector(".nav"),
asideDropdown= document.querySelector(".aside__dropdown"),
btnDropdown= document.querySelector(".aside__dropdown--contain button"),
asideMenu= document.querySelector(".aside__menu"),
buttonKHMenu= document.querySelector(".aside__menu--keep-hide button"),
buttonOptionsMenu=document.querySelector(".aside__menu--options button"),
menuOption=document.querySelector(".aside__menu--options-ul");

/*****************************************************************FUNCIONES*************************************************************/

function hideNav() {
    if (window.location.pathname=="/") {
        nav.classList.add("hidden");
        asideDropdown.classList.add("hidden");
    }  
}

/*****************************************************************EVENTOS*************************************************************/

btnDropdown.onclick = () => {
    asideMenu.className=="aside__menu keep"? asideMenu.classList.remove("keep"):asideMenu.classList.add("keep");
};

buttonKHMenu.onclick = () => {
    asideMenu.className=="aside__menu keep"? asideMenu.classList.remove("keep"):asideMenu.classList.add("keep");
};

buttonOptionsMenu.onclick = () => {
    menuOption.className=="aside__menu--options-ul hidden"? menuOption.classList.remove("hidden"):menuOption.classList.add("hidden");
}

hideNav();



