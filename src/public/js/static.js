/*HOME -- REALTIMEPRODUCTS*/

/**********************************************************CONSTANTES/VARIABLES*************************************************************/

const socket = io();
let URLdomain = window.location.host,
  protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/products";
let opc = "static";
let btnsDelete;
let storeProducts = [],
  resExo = [],
  defaultStore = [];
let opciones;
let dataPagination;
let querySelect;
let query = {};

const contain = document.querySelector(".container__grid"),
  asideAddProduct = document.querySelector(
    ".asideAdd__dropdown--addProduct button"
  ),
  asideText = document.querySelector(".asideAdd__menu--addProduct button"),
  asideButton = document.querySelector(".asideAdd__dropdown--button");

const navConteiner = document.querySelector(".dinav__container"),
  navPages = document.querySelector(".dinav__container--pages");

const dinamicPages = document.querySelector(".dinav__pages--center"),
  selectPrevPage = document.getElementById("page__btnIzq"),
  selectNextPage = document.getElementById("page__btnDer");

const selectOrder = document.getElementById("orderProducts"),
  selectCategory = document.getElementById("categoryProducts"),
  selectStatus = document.getElementById("statusProducts"),
  categoryOption = document.getElementById("selectCategory");

selectStatus.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  let query = { status: selectedValue };
  let page = 1;
  if (opciones) {
    if (selectedValue == "") {
      delete opciones.query.status;
      if (JSON.stringify(opciones.query) == "{}") {
        delete opciones.query;
      } else {
        query = opciones.query;
      }
      opciones.page = page;
    } else {
      opciones.query
        ? (opciones.query = Object.assign(opciones.query, query))
        : (opciones.query = query);
    }
  } else {
    opciones = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(opciones));
  filters();
});

asideAddProduct.addEventListener("click", () => {
  formAddProduct.className == "dinamic__container--addProduct dinamico"
    ? formAddProduct.classList.remove("dinamico")
    : formAddProduct.classList.add("dinamico");
  asideText.innerHTML == "Add New Product"
    ? (asideText.innerHTML = "Close")
    : (asideText.innerHTML = "Add New Product");
  asideButton.innerHTML == `<i class="fa-regular fa-square-plus fa-spin"></i>`
    ? (asideButton.innerHTML = `<i class="fa-regular fa-square-plus fa-spin fa-spin-reverse"></i>`)
    : (asideButton.innerHTML = `<i class="fa-regular fa-square-plus fa-spin" </i>`);
});

selectOrder.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  opciones
    ? (opciones.sort = selectedValue)
    : (opciones = new NewParams(null, null, selectedValue, null));
  sessionStorage.setItem("values", JSON.stringify(opciones));
  filters();
});

selectCategory.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  let query = { category: selectedValue };
  let page = 1;
  if (opciones) {
    if (selectedValue == "") {
      delete opciones.query.category;
      if (JSON.stringify(opciones.query) == "{}") {
        delete opciones.query;
      } else {
        query = opciones.query;
      }
      opciones.page = page;
    } else {
      opciones.query
        ? (opciones.query = Object.assign(opciones.query, query))
        : (opciones.query = query);
    }
  } else {
    opciones = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(opciones));
  filters();
});

selectPrevPage.addEventListener("click", () => {
  const prevPage = dataPagination.prevPage;
  console.log(prevPage);
  opciones = new NewParams(null, prevPage, null, null);
  sessionStorage.setItem("values", JSON.stringify(opciones));
  pagination();
  filters();
});

selectNextPage.addEventListener("click", () => {
  const nextPage = dataPagination.nextPage;
  opciones = new NewParams(null, nextPage, null, null);
  sessionStorage.setItem("values", JSON.stringify(opciones));
  pagination();
  filters();
});

/*****************************************************************CLASES*************************************************************/

class NewParams {
  constructor(limit, page, sort, query) {
    this.limit = limit ? limit : 10;
    this.page = page ? page : 1;
    this.sort = sort ? sort : "";
    query ? (this.query = query) : "";
  }
}

/*****************************************************************FUNCIONES*************************************************************/

async function crearHtml() {
  if (storeProducts.length == 0) {
    contain.innerHTML = "";
    contain.innerHTML = `
    <div class="container__empty__card">
        <div class="card">
          <div class="card-item--empty">
          <i class="fa-solid fa-rectangle-xmark fa-beat-fade"></i>
          </div>
          <div class="card-body--empty">
            <b class="card-text--empty">Not Products Found</b>
            <p class="card-text--empty">You have not added any product with this filters</p>
            <p class="card-text--empty">Try adding a product first</p>
          </div>
          <div class="card__footer--empty">
            <button
              type="button"
              class="btn btn-outline-warning btn-sm btnAdd"
              id="btnAdd"
            > <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
      </div>`;
  } else {
    contain.innerHTML = "";
    let html;
    let error;
    for (const product of storeProducts) {
      product.status == "error" && opc == "static"?error="error":error="";
      html = `<div class="container__grid__card ${error}">
          <div class="card">
            <div class="card-header--filled">
              <h5 class="card-title--filled">${product.tittle}</h5>
            </div>
            <img
              class="card-img-top--filled"
              src=${product.thumbnail}
              alt="Card image cap"
            />
            <div class="card-body">
              <b class="card-text--description">${product.description}</b>
              <u class="card-text--price">S/.${product.price}</u>
            </div>
            <div class="card-footer">
              <b class="card-text--code">
                Code: <b class="code">${product.code}</b>
              </b>
            </div>
          </div>
        </div>`;
      contain.innerHTML += html;
    }
  }
}

async function filters() {
  let valores = JSON.parse(sessionStorage.getItem("values"));
  let totalParams;
  let valueQuery;
  let querys;
  if (valores) {
    valores.sort != null
      ? (selectOrder.value = valores.sort)
      : (selectOrder.value = "");
    if (valores.query != null) {
      const conta = Object.keys(valores.query).length;
      for (let i = 0; i < conta; i++) {
        valueQuery = Object.entries(valores.query)[i][0];
        querys = { [valueQuery]: valores.query[valueQuery] };
        query = Object.assign(valores.query, querys);
      }
    }
    let Params = {
      limit: valores.limit,
      page: valores.page,
      sort: valores.sort,
    };
    valores.query == null
      ? (totalParams = Params)
      : (totalParams = Object.assign(Params, query));
    storeProducts = await getData(totalParams);
  }
  pagination();
  if (storeProducts.length == 0) {
    Swal.fire({
      title: "NO PRODUCTS FOUND",
      text: "No products found with the selected filters",
      icon: "warning",
      confirmButtonText: "Accept",
    });
   
  } 
  await crearHtml();
}

async function pagination() {
  dataPagination ? (dataPagination = dataPagination) : await getData();
  const {
    payload,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nexLink,
  } = dataPagination;
  dinamicPages.innerHTML = "";
  dinamicPages.innerHTML = `<p>Page<button>${page}</button>of ${totalPages}</p>`;
  if (hasPrevPage == false) {
    selectPrevPage.disabled = true;
    selectPrevPage.classList.replace(
      "dinav__pages--izq",
      "dinav__pages--disabled"
    );
  } else {
    selectPrevPage.disabled = false;
    selectPrevPage.className != "dinav__pages--izq" &&
      selectPrevPage.classList.replace(
        "dinav__pages--disabled",
        "dinav__pages--izq"
      );
  }
  if (hasNextPage == false) {
    selectNextPage.disabled = true;
    selectNextPage.classList.replace(
      "dinav__pages--der",
      "dinav__pages--disabled"
    );
  } else {
    selectNextPage.disabled = false;
    selectNextPage.className != "dinav__pages--der" &&
      selectNextPage.classList.replace(
        "dinav__pages--disabled",
        "dinav__pages--der"
      );
  }
}

async function focusbtn() {
  const buttonsMax = document.querySelectorAll(".nav__container--a a");
  const buttonsMin = document.querySelectorAll(".asideAdd__dropdown--contain a");
  buttonsMax.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
  buttonsMin.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
}

/*INICIO FUNCIONES CRUD*/
async function getData(params) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    console.log(queryParams);
    let response = await fetch(`${Url}?${queryParams}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    dataPagination = data;
    const newData = data.payload;
    return newData;
  } catch {
    console.log(Error);
  }
}

async function getDatabyID(id) {
  let response = await fetch(`${Url}/${id}`, {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    mode: "cors",
  });
  const data = await response.json();
  return data;
}

/*FIN FUNCIONES CRUD*/

/*****************************************************************SOCKETS*************************************************************/

socket.on("callProducts", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  sessionStorage.removeItem("values");
  focusbtn();
  filters();
});
