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
let querySelect={};

const contain = document.querySelector(".container__grid"),
  asideAddProduct = document.querySelector(
    ".asideAdd__dropdown--contain button"
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
    if (querySelect!={}) {
      querySelect.value=""
      querySelect=selectStatus;
    }else{
      querySelect=selectStatus;
    }
    let query;
    let page = 1;
    selectedValue == "" ? query == "" : (query = { status: selectedValue });
    if (opciones) {
      opciones.query = query;
      opciones.page = page;
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
    if (querySelect!={}) {
      querySelect.value=""
      querySelect=selectCategory;
    }else{
      querySelect=selectCategory;
    }
    let query;
    let page = 1;
    selectedValue == "" ? query == "" : (query = { category: selectedValue });
    if (opciones) {
      opciones.query = query;
      opciones.page = page;
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
    contain.innerHTML = `<div class="container__empty__card">
        <div class="card">
          <div class="card-item">
            <i class="fa-regular fa-rectangle-xmark"></i>
          </div>
          <div class="card-body">
            <b class="card-text--empty">No Products Found</b>
            <p class="card-text--empty">You have not added any product</p>
            <p class="card-text--empty">Add first product now</p>
          </div>
          <div class="card-footer">
            <button
              type="button"
              class="btn btn-outline-warning btn-sm btnAdd"
              id="btnAdd"
            >
              <a class="fas fa-edit" href="../realtimeproducts"></a>
            </button>
          </div>
        </div>
      </div>`;
  } else {
    contain.innerHTML = "";
    let html;
    for (const product of storeProducts) {
      html = `<div class="container__grid__card">
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
  let query;
  let totalParams;
  if (valores) {
    valores.sort != null
      ? (selectOrder.value = valores.sort)
      : (selectOrder.value = "");
    if (valores.query != null) {
        valueQuery=Object.entries(valores.query)[0][0];
        query =  {[valueQuery]: valores.query[valueQuery] } ;
    } else {
      selectCategory.value = "";
      query = "";
    }
    let Params = {
      limit: valores.limit,
      page: valores.page,
      sort: valores.sort,
    };
    query == ""
      ? (totalParams = Params)
      : (totalParams = Object.assign(Params, query));
    storeProducts = await getData(totalParams);
  }
  pagination();
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
  filters();
});



