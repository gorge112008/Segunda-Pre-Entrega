const socket = io();
let URLPathName = window.location.pathname,
URLdomain = window.location.host,
  protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/carts";
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
    ".asideAdd__dropdown--contain button"
  );

const navConteiner = document.querySelector(".dinav__container"),
  navPages = document.querySelector(".dinav__container--pages");

/*****************************************************************CLASES*************************************************************/



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
    for (const listProduct of storeProducts) {
        const product=listProduct.product;
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

async function focusbtn() {
  const buttons = document.querySelectorAll(".nav__container--a a");
  buttons.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
}

/*INICIO FUNCIONES CRUD*/
async function getData() {
  try {
    let response = await fetch(`${Url}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    const newData=await getDatabyID(data[0]._id);
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
  const products=data[0].products;
    dataPagination = products;
    const newData = products[0].payload;
    console.log(URLPathName);
  return newData;
}

/*FIN FUNCIONES CRUD*/

/*****************************************************************SOCKETS*************************************************************/

socket.on("callProducts", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  focusbtn();
  crearHtml();
  getData();
});
