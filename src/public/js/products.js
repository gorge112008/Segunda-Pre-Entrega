const socket = io();
let URLPathName = window.location.pathname,
  URLdomain = window.location.host,
  protocol = window.location.protocol;
let UrlP = protocol + "//" + URLdomain + "/api/products";
let UrlC = protocol + "//" + URLdomain + "/api/carts";
let opc = "static";
let btnAdd;
let storeProducts = [],
  resExo = [],
  defaultStore = [];
let opciones;
let dataPagination;
let querySelect;
let query = {},
  ListCarts = [];

const containDinamic = document.querySelector(".main__container__dinamic"),
  tittleDinamic = document.querySelector(".dinamic__tittle--h3"),
  form = document.querySelector("form"),
  formInput = document.querySelectorAll(".input-field label"),
  btnviewClose = document.querySelector(".btnViewClose"),
  contain = document.querySelector(".container__grid"),
  asideButton = document.querySelector(".asideSD__dropdown--button");

const dinamicPages = document.querySelector(".dinav__pages--center"),
  selectPrevPage = document.getElementById("page__btnIzq"),
  selectNextPage = document.getElementById("page__btnDer");

const validateProducts = document.getElementById("validate"),
  inputTittle = document.getElementById("tittle"),
  inputDescription = document.getElementById("description"),
  inputCode = document.getElementById("code"),
  inputPrice = document.getElementById("price"),
  inputStock = document.getElementById("stock"),
  inputThumbnail = document.getElementById("thumbnail"),
  inputStatus = document.getElementById("status"),
  selectOrder = document.getElementById("orderProducts"),
  selectCategory = document.getElementById("categoryProducts"),
  selectStatus = document.getElementById("statusProducts"),
  categoryOption = document.getElementById("selectCategory");

/*****************************************************************CLASES*************************************************************/
class NewCart {
  constructor() {
    this.products = [{ status: "sucess", payload: [] }];
  }
}

class NewParams {
  constructor(limit, page, sort, query) {
    this.limit = limit ? limit : 10;
    this.page = page ? page : 1;
    this.sort = sort ? sort : "";
    query ? (this.query = query) : "";
  }
}

/*****************************************************************FUNCIONES*************************************************************/
async function crearListStock(stock) {
  let optListStock = [];
  for (let i = 1; i <= stock; i++) {
    optListStock[i] = i.toString();
  }
  return optListStock;
}

async function defaultCart() {
  const cart = new NewCart();
  await createCart(cart);
  socket.emit("NewCart", `Nuevo carrito por defecto Creado`);
}

async function crearListCarts() {
  let carts = await getDataCart();
  if (carts.length == 0) {
    await defaultCart();
    carts = await getDataCart();
  }
  let optListCarts = [];
  ListCarts=[];
  for (let i = 1; i <= carts.length; i++) {
    optListCarts[i] = `Cart (${i.toString()}): ${carts[i - 1]._id}`;
    ListCarts.push(carts[i - 1]._id);
  }
  return optListCarts;
}

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
            <p class="card-text--empty">Try other filters first</p>
          </div>
        </div>
      </div>`;
    btnAdd = document.querySelectorAll(".btnAddToCart");
    return btnAdd;
  } else {
    contain.innerHTML = "";
    let html;
    for (const product of storeProducts) {
      (product.status == "error" && opc == "static") || product.stock == 0
        ? (error = "error")
        : (error = "");
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
            <div class="card-img-overlay">
              <button
                type="button"
                class="btn btn-outline-warning btn-sm btnView"
                id="btnView"
              >
                <a
                  class="fa-regular fa-eye"
                  href="/products/${product._id}"
                ></a>
              </button>
            </div>
            <div class="card-body">
              <b class="card-text--description">${product.description}</b>
              <u class="card-text--price">S/.${product.price}</u>
              
            </div>
            <div class="card-footer--products">
              <p class="card-text--stock">
                Stock: <b> ${product.stock}</b>
              </p>
              <button
                type="button"
                class="fa light fa-cart-shopping btn btn-outline-warning btn-sm btnAddtoCart ${error}"
                id=${product._id}
              >
              </button>
            </div>
          </div>
        </div>`;
      contain.innerHTML += html;
    }
    btnAdd = document.querySelectorAll(".btnAddtoCart");
    return btnAdd;
  }
}

function validarUrl() {
  try {
    new URL(inputThumbnail.value);
    return true;
  } catch (err) {
    return false;
  }
}

async function selectAction() {
  if (RouteIndex==="productP/") {
    categoryOption.value = storeProducts[0].category;
    tittleDinamic.innerHTML = "View Product";
    inputTittle.value = storeProducts[0].tittle;
    inputDescription.value = storeProducts[0].description;
    inputCode.value = storeProducts[0].code;
    inputPrice.value = storeProducts[0].price;
    inputStock.value = storeProducts[0].stock;
    storeProducts[0].status == "success"
      ? (inputStatus.value = "success")
      : (inputStatus.value = "updating");
    formInput.forEach((label) => {
      label.focus();
    });
    btnviewClose.focus();
    socket.emit("viewingProduct", storeProducts[0]._id);
    selectAddCart();
  } else {
    opc = "static";
  }
}
async function validarStock(idProduct, stockModif) {
  const product = await getDatabyID(idProduct);
  const newStock = product[0].stock - stockModif;
  updateProduct(idProduct, { stock: newStock });
}

async function selectAddCart() {
  try {
    btnAdd = await crearHtml();
    btnAdd.forEach((selectBtn) => {
      selectBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const idProduct = selectBtn.id;
        const optCarts = await crearListCarts();
        const productoSelect = await getDatabyID(selectBtn.id);
        const pStock = productoSelect[0].stock;
        const optStock = await crearListStock(pStock);
        let numCart;
        let selectedCardId;
        Swal.fire({
          text: "Which cart do you want to add products?",
          input: "select",
          inputOptions: optCarts,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "YES",
          denyButtonText: "NOT",
        }).then(async (result) => {
          if (result.isConfirmed) {
            numCart = Swal.getPopup().querySelector("select").value;
            selectedCartId = ListCarts[numCart - 1];
            console.log("Carrito "+numCart+" Seleccionado");
            Swal.fire({
              html: `How many ${productoSelect[0].tittle} do you want to add to the cart?`,
              input: "select",
              inputOptions: optStock,
              showDenyButton: true,
              showCancelButton: false,
              confirmButtonText: "YES",
              denyButtonText: "NOT",
            }).then(async (result) => {
              if (result.isConfirmed) {
                const selectValue =
                  Swal.getPopup().querySelector("select").value;
                const quantity = { stock: selectValue };
                validarStock(idProduct, +selectValue);
                updateCart(selectedCartId, idProduct, quantity)
                  .then(async (data) => {
                    Swal.fire({
                      title: "Product Added to Cart Successfully!!!",
                      text:
                        "Product Added>> " +
                        "ID: " +
                        idProduct +
                        " --> " +
                        productoSelect[0].tittle,
                      icon: "success",
                      confirmButtonText: "Accept",
                    });
                    socket.emit("updateproduct", "Productos Actualizados");
                    socket.emit(
                      "addingProductCart",
                      `Se ha añadido ${selectValue} ${productoSelect[0].tittle} al carrito ${numCart}.`
                    );
                  })
                  .catch((error) => console.log("Error:" + error));
              } else if (result.isDenied) {
                Swal.fire("ACTION CANCELED", "", "info");
              }
            });
          } else if (result.isDenied) {
            Swal.fire("ACTION CANCELED", "", "info");
          }
        });
      });
    });
  } catch (error) {
    console.log(error + ": No hay productos para agregar al carrito");
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
    selectAddCart();
  } else {
    selectAddCart();
  }
}

function saveUpdate(data) {
  Swal.fire({
    title: "ESTA SEGURO DE MODIFICAR EL PRODUCTO?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "SI",
    denyButtonText: "NO",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "center",
        text: "Updated Product: " + data.tittle,
        icon: "success",
        title: "Product Update Successfully!",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      socket.emit("updateproduct", "Se ha actualizado un producto");
      setTimeout(() => {
        window.location.href = "../realtimeproducts";
      }, 1000);
    } else if (result.isDenied) {
      Swal.fire("ACCIÓN CANCELADA", "", "info");
      return;
    }
  });
}

async function validarStatus(idExo) {
  let getProducts = await getData();
  for (const product of getProducts) {
    console.log(JSON.stringify(product));
    if (idExo.includes(product._id)) continue;
    if (product.status == "error") {
      updateCart(product._id, { status: "success" });
    }
  }
  const newProducts = await getData();
  return newProducts;
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

async function focusAction() {
  const buttonsMax = document.querySelectorAll(".div__container--focusBtn a");
  const buttonsMin = document.querySelectorAll(".asideSD__dropdown--contain a");
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
    let response = await fetch(`${UrlP}?${queryParams}`, {
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
  let response = await fetch(`${UrlP}/${id}`, {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    mode: "cors",
  });
  const data = await response.json();
  return data;
}

async function getDataCart() {
  try {
    let response = await fetch(`${UrlC}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch {
    console.log(Error);
  }
}

async function postData(data) {
  try {
    let response = await fetch(UrlP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

async function createCart(data) {
  try {
    let response = await fetch(UrlC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

async function updateCart(idCart, idProduct, data) {
  try {
    let response = await fetch(`${UrlC}/${idCart}/products/${idProduct}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      datos = await response.json();
      msj = datos.msj;
      return msj;
    }
  } catch {
    console.log(Error);
  }
}

async function updateProduct(idProduct, data) {
  try {
    let response = await fetch(`${UrlP}/${idProduct}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      datos = await response.json();
      msj = datos.msj;
      return msj;
    }
  } catch {
    console.log(Error);
  }
}

async function deleteData(idProduct) {
  try {
    let response = await fetch(`${UrlP}/${idProduct}`, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    return response.json();
  } catch {
    console.log(Error);
  }
}

async function addtoCart(id) {
  try {
    let response = await fetch(UrlC, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}
/*FIN FUNCIONES CRUD*/

/*****************************************************************SOCKETS*************************************************************/

socket.on("callProducts", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  sessionStorage.removeItem("values");
  if (storeProducts.length == 1) {
    sessionStorage.setItem("productView", storeProducts[0]._id);
    if (RouteIndex==="productP") {
      storeProducts = await getData();
      filters();
      validateProducts.click();
      ;
    }
  }else if (storeProducts.length != 1) {
    if (RouteIndex==="productP/" ) {
      let idProduct=sessionStorage.getItem("productView");
      storeProducts = await getDatabyID(idProduct);
      filters();
    }
  }
  focusAction();
  selectAction();
  filters();
});

socket.on("f5deleteProduct", async (deletedMsj) => {
  console.log(deletedMsj);
  if (RouteIndex==="productP") {
    storeProducts = await getData({});
    filters();
  } else {
    setTimeout(() => {
      window.location.href = "../realtimeproducts";
    }, 1000),
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto Eliminado Correctamente",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
  }
});

socket.on("f5updateProduct", async (updatedMsj) => {
  console.log(updatedMsj);
  if (RouteIndex==="productP/") {
    let productUpdate = await getDatabyID(storeProducts[0]._id);
    storeProducts = productUpdate;
    selectAction();
    const btnDel = document.querySelector(".card__btnDelete");
    btnDel.classList.remove("hidden");
  } else {
    storeProducts = await getData({});
    filters();
  }
});

socket.on("updatingProduct", async (updatingMsj) => {
  console.log(updatingMsj);
  if (RouteIndex==="productP/") {
    validateProducts.classList.add("hidden");
    let productUpdate = await getDatabyID(storeProducts[0]._id);
    storeProducts = productUpdate;
    selectAction();
  } else {
    storeProducts = await getData({});
    filters();
  }
});

socket.on("ordenExonerar", async (msj) => {
  console.log(msj);
  if (RouteIndex==="productP/") {
    socket.emit("responseExonerar", storeProducts[0]._id);
    //console.log("Response de producto a exonerar emitido");
  }
});

socket.on("idExonerar", async (id) => {
  //console.log("Id de exoneracion recibida: "+id);
  resExo.push(id);
  //console.log("Id de exoneracion agregada: "+resExo);
});

socket.on("actualizar", async (products) => {
  console.log("Validacion Exitosa");
  if (RouteIndex==="productP") {
    storeProducts = products;
    filters();
  }
});

socket.on("finValidate", async (msj) => {
  console.log(msj);
  validateProducts.classList.add("hidden");
});

socket.on("NewCart", async (msj) => {
  console.log(msj);
  ListCarts=[];
});

socket.on("removeCart", async (msj) => {
  console.log(msj);
  ListCarts=[];
});

/*****************************************************************EVENTOS*************************************************************/

//PROCESO DE VALIDACION DE PRODUCTOS OCULTOS//

/*CUANDO UN USUARIO EDITA UN PRODUCTO, EL PRODUCTO ADQUIERE UNA PROPIEDAD DE STATUS ERROR, ESTO EVITARIA QUE OTRO USUARIO
EDITE AL MISMO TIEMPO EL MISMO PRODUCTO. PERO SI EL USUARIO EDITOR NO GUARDA NI CANCELA LA EDICION, EL PRODUCTO QUEDA CON STATUS ERROR
EVITANDO QUE EL PRODUCTO PUEDA SER MODIFICADO AUN CUANDO YA NADIE LO ESTA EDITANDO.
ESTOS PRODUCTOS SERAN CONSIDERADOS COMO PRODUCTOS OCULTOS, ESTO SIGNIFICA QUE EL PRODUCTO NO SE MOSTRARA EN LA PAGINA DE PRODUCTOS.
ENTONCES PARA QUE EL PRODUCTO VUELVA A MOSTRARSE EN LA PAGINA DE PRODUCTOS, SE DEBE VALIDAR EL PRODUCTO
ESTO SE HACE CON EL BOTON DE VALIDAR PRODUCTOS (VALIDATE), EL CUAL LLAMA A LA FUNCION DE VALIDAR STATUS (validateStatus),
ESTA FUNCION BUSCA LOS PRODUCTOS CON STATUS ERROR Y LOS DEVUELVE A TRUE MOSTRANDOLOS EN LA PAGINA DE PRODUCTOS Y PERMITIENDO SU MODIFICACION.
UNA VEZ VALIDADOS LOS PRODUCTOS, SE ACTUALIZA LA PAGINA DE PRODUCTOS EN EL USUARIO ACTUAL Y TODOS LOS USUARIOS CONECTADOS EN TIEMPO REAL*/

//*******************************PROCESO DE EXONERACION DE PRODUCTOS ACTUALIZANDOSE**************************************//

/*CUANDO SE ACTIVA EL BOTON DE VALIDACION, SI UN PRODUCTO AUN ESTA SIENDO EDITADO POR OTRO USUARIO, ESTE PRODUCTO NO SE VALIDA
Y ENTRA EN UN GRUPO DE EXONERACION, EL CUAL SE VALIDA CUANDO EL USUARIO QUE ESTA EDITANDO EL PRODUCTO LO GUARDA CORRECTAMENTE,
CASO CONTRARIO SE EXCEPTA DEL GRUPO DE EXONERACION Y SOLO PODRA SER VALIDADO MEDIANTE EL BOTON DE VALIDACION DE PRODUCTOS.*/

validateProducts.onclick = async () => {
  try {
    //console.log("Iniciando Validación de Productos");
    socket.emit("exonerarStatus", "Exonerando Status");
    const validProducts = await validarStatus(resExo);
    //console.log("Productos Validados Correctamente" + validProducts);
    //console.log("Vaciando arreglo de Exoneraciones");
    resExo.length == 0
      ? socket.emit("finExo", "Exoneración Finalizada")
      : validateProducts.classList.remove("hidden");
    resExo = [];
    socket.emit("validateStatus", validProducts);
  } catch {
    console.log("Error al Validando Productos");
  }
};

btnviewClose.onclick = () => {
  window.location.href = "../products";
};

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
      query = opciones.query;
      opciones.page = page;
    }
  } else {
    opciones = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(opciones));
  filters();
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
      opciones.page = page;
    }
  } else {
    opciones = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(opciones));
  filters();
});

selectPrevPage.addEventListener("click", () => {
  const prevPage = dataPagination.prevPage;
  opciones
    ? (opciones.page = prevPage)
    : (opciones = new NewParams(null, prevPage, null, null));
  sessionStorage.setItem("values", JSON.stringify(opciones));
  pagination();
  filters();
});

selectNextPage.addEventListener("click", () => {
  const nextPage = dataPagination.nextPage;
  opciones
    ? (opciones.page = nextPage)
    : (opciones = new NewParams(null, nextPage, null, null));
  sessionStorage.setItem("values", JSON.stringify(opciones));
  pagination();
  filters();
});