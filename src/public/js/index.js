/*INDEX*/

/*******************************************************CONSTANTES/VARIABLES*************************************************************/

const nav = document.querySelector(".nav"),
asideDropdown= document.querySelector(".aside__dropdown"),
asideAddButton = document.querySelector(".asideAdd__dropdown"),
btnDropdown= document.querySelector(".aside__dropdown--contain button"),
asideMenu= document.querySelector(".aside__menu"),
asideMenuAdd= document.querySelector(".asideAdd"),
addProductMenu= document.querySelector(".aside__menu--addProduct"),
buttonMenu= document.querySelector(".aside__menu--addProduct button"),
buttonOptionsMenu=document.querySelector(".aside__menu--options button"),
menuOption=document.querySelector(".aside__menu--options-ul"),
menuAdd=document.querySelector(".dinamic__container--addProduct"),
asideAdd=document.querySelector(".asideAdd__dropdown--addProduct"),
listProduct=document.querySelector(".dinamic__container--listProduct");

/*****************************************************************FUNCIONES*************************************************************/

function hideNav() {
    if (window.location.pathname=="/") {
        nav.classList.add("hidden");
        asideMenu.classList.add("hidden");
        asideMenuAdd.classList.add("hidden");
    }  
    if(window.location.pathname=="/realtimeproducts"){
        addProductMenu.classList.remove("hidden"); 
        asideAdd.classList.remove("hidden"); 
    }
}

/*****************************************************************EVENTOS*************************************************************/

btnDropdown.onclick = () => {
    asideMenu.className=="aside__menu list"? asideMenu.classList.remove("list"):asideMenu.classList.add("list");
};

buttonMenu.onclick = () => {
    if (menuAdd.className=="dinamic__container--addProduct inactiveAdd") {
        menuAdd.classList.remove("inactiveAdd");
        listProduct.classList.remove("m12");
        listProduct.classList.add("m7");
    }else if(menuAdd.className=="dinamic__container--addProduct"){
        menuAdd.classList.add("inactiveAdd");
        listProduct.classList.remove("m7");
        listProduct.classList.add("m12");
    }
};

buttonOptionsMenu.onclick = () => {
    menuOption.className=="aside__menu--options-ul hidden"? menuOption.classList.remove("hidden"):menuOption.classList.add("hidden");
}

hideNav();



