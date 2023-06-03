/*INDEX*/

/*******************************************************CONSTANTES/VARIABLES*************************************************************/
/*ALL*/
const navHeader = document.querySelector(".header__nav"),
  navFilters = document.querySelector(".dinav__container--filters"),
  navPages = document.querySelector(".dinav__container--pages"),
  formAddProduct = document.querySelector(".dinamic__container--addProduct"),
  listProduct = document.querySelector(".dinamic__container--listProduct"),
  btnReturn=document.querySelector("#return"),
  btnAddNewCart = document.querySelector(".btnAddNewCart"),
  btnExitCart = document.querySelector(".btnExitCart"),
  btnClearCart =document.querySelector(".btnCleanCart");

/*MLD*/
const asideMLD = document.querySelector(".aside__MLD"),
  mldAsideDropdown = document.querySelector(".asideMLD__dropdown"),
  mldasideAddProduct = document.querySelector(".asideMLD__menu--addProduct"),
  mldBtnAddProduct = document.querySelector(
    ".asideMLD__menu--addProduct button"
  ),
  btnNavigationPanel = document.querySelector(
    ".asideMLD__menu--options button"
  ),
  optionNavigationPanel = document.querySelector(".asideMLD__menu--options-ul");

/*SD*/
const asideSD = document.querySelector(".aside__SD"),
  sdAsideDropdown = document.querySelector(".asideSD__dropdown"),
  sdasideAddProduct = document.querySelector(".asideSD__dropdown--addProduct"),
  sdBtnAddProduct = document.querySelector(
    ".asideSD__dropdown--addProduct button"
  );

/*****************************************************************FUNCIONES*************************************************************/
function actionRoute() {
  const route = window.location.pathname;
  const regex= /^\/[^/]+/;
  const routeName=route.match(regex);
    if (route == "/") {
      navHeader.classList.add("hidden");
      asideMLD.classList.add("hidden");
      asideSD.classList.add("hidden");
    }
    if (routeName == "/realtimeproducts") {
      validID(route);
      mldasideAddProduct.classList.remove("hidden");
      sdasideAddProduct.classList.remove("hidden");
    }

    if (routeName == "/products") {
      validID(route);
    }

    if (routeName == "/cart") {
      validID(route);
    }
  }


function validID(route){
    const regex = /^\/[^/]+\/([^/]+)/;
    const match = route.match(regex);
    let existId;
    if (match) {
      existId = match[1];
    }
    if (existId) {
      navHeader.classList.add("hidden");
      navFilters&&navFilters.classList.add("hidden");
      navPages&&navPages.classList.add("hidden");
      btnAddNewCart&&btnAddNewCart.classList.add("hidden");
      asideMLD.classList.add("hidden");
      asideSD.classList.add("hidden");
      btnExitCart&&btnExitCart.classList.remove("hidden");
      formAddProduct&&formAddProduct.classList.remove("inactiveAdd");
      listProduct&&listProduct.classList.remove("m12");
      listProduct&&listProduct.classList.add("m7");
      btnReturn.classList.add("hidden");
    }
}

function controlerForm() {
  if (
    formAddProduct.className == "dinamic__container--addProduct inactiveAdd"
  ) {
    formAddProduct.classList.remove("inactiveAdd");
    listProduct.classList.remove("m12");
    listProduct.classList.add("m7");
  } else if (formAddProduct.className == "dinamic__container--addProduct") {
    formAddProduct.classList.add("inactiveAdd");
    listProduct.classList.remove("m7");
    listProduct.classList.add("m12");
  }
}

/*****************************************************************EVENTOS*************************************************************/
mldBtnAddProduct.onclick = () => {
  controlerForm();
};

sdBtnAddProduct.onclick = () => {
  controlerForm();
  asideButton.innerHTML == `<i class="fa-regular fa-square-plus fa-spin"></i>`
    ? (asideButton.innerHTML = `<i class="fa-regular fa-square-plus fa-spin fa-spin-reverse"></i>`)
    : (asideButton.innerHTML = `<i class="fa-regular fa-square-plus fa-spin"></i>`);
};

btnNavigationPanel.onclick = () => {
  optionNavigationPanel.className == "asideMLD__menu--options-ul hidden"
    ? optionNavigationPanel.classList.remove("hidden")
    : optionNavigationPanel.classList.add("hidden");
};

actionRoute();
