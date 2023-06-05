/*HOME -- REALTIMEPRODUCTS*/

/**********************************************************CONSTANTES/VARIABLES*************************************************************/

const socket = io();
let URLPathName = window.location.pathname,
  URLdomain = window.location.host,
  protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/products";
let opc = "static";
let btnsDelete, btnAdd;
let storeProducts = [],
  resExo = [];
let options;
let dataPagination;
let querySelect;
let query = {};

const contain = document.querySelector(".container__grid"),
  tittleDinamic = document.querySelector(".dinamic__tittle--h3"),
  form = document.querySelector("form"),
  formInput = document.querySelectorAll(".input-field label"),
  formCancel = document.querySelector(".form--btnCancel");

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
  selectOrder = document.getElementById("orderProducts"),
  selectCategory = document.getElementById("categoryProducts"),
  selectStatus = document.getElementById("statusProducts"),
  categoryOption = document.getElementById("selectCategory");

/*****************************************************************CLASES*************************************************************/

class NewProduct {
  constructor() {
    this.tittle = inputTittle.value;
    this.description = inputDescription.value;
    this.code = +inputCode.value;
    this.status = "success";
    this.stock = +inputStock.value;
    this.category = categoryOption.value;
    this.price = +inputPrice.value;
    this.thumbnail = validarUrl()
      ? inputThumbnail.value
      : "https://energiaypotencia.com/img/imagen-no-disponible.jpg";
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
              class="btn fas fa-edit btnAddProduct"
            > 
            </button>
          </div>
        </div>
      </div>`;
    btnAdd = document.querySelector(".btnAddProduct");
    return btnAdd;
  } else {
    contain.innerHTML = "";
    let html;
    let error, empty;
    for (const product of storeProducts) {
      product.stock == 0 ? (empty = "empty") : (empty = "");
      product.status == "error" && opc == "static" && product.stock != 0
        ? (error = "error")
        : (error = "");
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
            <div class="card-img-overlay">
              <button
                type="button"
                class="btn fas fa-trash-alt card__btnDelete"
                id=${product._id}
              >
              </button>
              <button
                type="button"
                class="btn btn-outline-warning btn-sm btnUpdate"
              >
                <a
                  class="fas fa-edit"
                  href="/realtimeproducts/${product._id}"
                ></a>
              </button>
            </div>
            <div class="card-body">
              <b class="card-text--description">${product.description}</b>
              <u class="card-text--price">S/.${product.price}</u>
            </div>
            <div class="card-footer">
              <b class="card-text--code">
                Code: <b class="code">${product.code}</b>
              </b>
              <b class="card-text--stock ${empty}">
                Stock: <b> ${product.stock}</b>
              </b>
            </div>
          </div>
        </div>`;
      contain.innerHTML += html;
    }
    btnsDelete = document.querySelectorAll(".card__btnDelete");
    return btnsDelete;
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
  if (RouteIndex === "realTP/") {
    categoryOption.value = storeProducts[0].category;
    tittleDinamic.innerHTML = "Update Product";
    inputTittle.value = storeProducts[0].tittle;
    inputDescription.value = storeProducts[0].description;
    inputCode.value = storeProducts[0].code;
    inputPrice.value = storeProducts[0].price;
    inputStock.value = storeProducts[0].stock;
    inputThumbnail.value = storeProducts[0].thumbnail;
    formInput.forEach((label) => {
      label.focus();
    });
    if (opc == "static") {
      updateData(storeProducts[0]._id, { status: "error" });
      socket.emit("updatingProduct", storeProducts[0].tittle + " updating...");
      opc = "updating";
    } else {
      selectDelete();
    }
  } else {
    opc = "static";
  }
}

async function selectDelete() {
  try {
    if (storeProducts != 0) {
      btnsDelete = await crearHtml();
      btnsDelete.forEach((selectBtn) => {
        selectBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const productSelect = await getDatabyID(selectBtn.id);
          Swal.fire({
            title:
              "YOU WANT TO DELETE THE PRODUCT " +
              productSelect[0].tittle.toUpperCase() +
              " ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then((result) => {
            if (result.isConfirmed) {
              deleteData(selectBtn.id)
                .then(async (data) => {
                  Swal.fire({
                    title: "Product Removed Successfully!!!",
                    text:
                      "Product Removed>> " +
                      "ID: " +
                      data +
                      " --> " +
                      productSelect[0].tittle,
                    icon: "success",
                    showConfirmButton: true,
                    allowOutsideClick: false,
                  });
                  filters();
                  socket.emit("deleteproduct", "Product Removed");
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
    } else if (storeProducts.length == 0) {
      btnAdd = await crearHtml();
      btnAdd.addEventListener("click", () => {
        if (
          formAddProduct.className ==
          "dinamic__container--addProduct inactiveAdd"
        ) {
          formAddProduct.classList.remove("inactiveAdd");
          listProduct.classList.remove("m12");
          listProduct.classList.add("m7");
          selectCategory.value == ""
            ? (categoryOption.value = "Food")
            : (categoryOption.value = selectCategory.value);
          inputTittle.focus();
        } else if (
          formAddProduct.className == "dinamic__container--addProduct"
        ) {
          formAddProduct.classList.add("inactiveAdd");
          listProduct.classList.remove("m7");
          listProduct.classList.add("m12");
        }
      });
    }
  } catch (error) {
    console.log(error + ": No hay productos para agregar o eliminar");
  }
}

async function filters() {
  let values = JSON.parse(sessionStorage.getItem("values"));
  let totalParams;
  let valueQuery;
  let querys;
  if (values) {
    values.sort != null
      ? (selectOrder.value = values.sort)
      : (selectOrder.value = "");
    if (values.query != null) {
      const conta = Object.keys(values.query).length;
      for (let i = 0; i < conta; i++) {
        valueQuery = Object.entries(values.query)[i][0];
        querys = { [valueQuery]: values.query[valueQuery] };
        query = Object.assign(values.query, querys);
      }
    }
    storeProducts.length == 1
      ? (values.page = values.page - 1)
      : (values.page = values.page);
    values.page == 0 ? (values.page = 1) : (values.page = values.page);
    let Params = {
      limit: values.limit,
      page: values.page,
      sort: values.sort,
    };
    values.query == null
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
  selectDelete();
}

function saveUpdate(data) {
  Swal.fire({
    title: "ARE YOU SURE TO MODIFY THE PRODUCT?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "YES",
    denyButtonText: "NOT",
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
      socket.emit("updateproduct", "A product has been updated");
      setTimeout(() => {
        window.location.href = "../realtimeproducts";
      }, 1000);
    } else if (result.isDenied) {
      Swal.fire("ACCIÓN CANCELADA", "", "info");
      return;
    }
  });
}

async function validateStatus(idExo) {
  let getProducts = await getData({ limit: 100, status: "error" });
  for (const product of getProducts) {
    if (idExo.includes(product._id)) continue;
    await updateData(product._id, { status: "success" });
  }
  const newProducts = await getData();
  return newProducts;
}

async function validateProduct(product) {
  const codeProduct = await getData({ code: product.code });
  const inputError = [];
  let result = "Success";
  if (inputStock.value < 0) {
    inputStock.value = "";
    inputStock.focus();
    inputError.unshift("The entered stock cannot be negative");
    result = "Error";
  }
  if (inputPrice.value <= 0) {
    inputPrice.value = "";
    inputPrice.focus();
    inputError.unshift("The entered price cannot be negative");
    result = "Error";
  }
  if (codeProduct.length == 0) {
    if (product.code < 0) {
      inputCode.value = "";
      inputCode.focus();
      inputError.unshift("The code entered cannot be negative");
      result = "Error";
    }
  } else {
    if (RouteIndex === "realTP") {
      inputCode.value = "";
      inputCode.focus();
      inputError.unshift("The code entered already exists");
      result = "Error";
    }
  }
  return [result, inputError];
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

async function postData(data) {
  try {
    let response = await fetch(Url, {
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

async function updateData(id, data) {
  try {
    let response = await fetch(`${Url}/${id}`, {
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
      const datos = await response.json();
      return datos;
    }
  } catch {
    console.log(Error);
  }
}

async function deleteData(id) {
  try {
    let response = await fetch(`${Url}/${id}`, {
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
/*FIN FUNCIONES CRUD*/

/*****************************************************************SOCKETS*************************************************************/
socket.on("callProducts", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  if (storeProducts.length == 1) {
    sessionStorage.setItem("productUpdate", storeProducts[0]._id);
    if (RouteIndex === "realTP") {
      storeProducts = await getData();
      filters();
      validateProducts.click();
    }
  } else if (storeProducts.length != 1) {
    if (RouteIndex === "realTP/") {
      let idProduct = sessionStorage.getItem("productUpdate");
      storeProducts = await getDatabyID(idProduct);
      filters();
    }
  }
  sessionStorage.removeItem("values");
  focusAction();
  selectAction();
  filters();
});

socket.on("f5NewProduct", async (addMsj) => {
  console.log(addMsj);
  if (RouteIndex === "realTP") {
    storeProducts = await getData();
    filters();
  }
});

socket.on("f5deleteProduct", async (deletedMsj) => {
  console.log(deletedMsj);
  if (RouteIndex === "realTP") {
    storeProducts = await getData();
    filters();
  }
});

socket.on("f5updateProduct", async (updatedMsj) => {
  console.log(updatedMsj);
  const btnDel = document.querySelector(".card__btnDelete");
  btnDel.classList.remove("hidden");
  if (RouteIndex === "realTP") {
    storeProducts = await getData({});
    filters();
    const btnDel = document.querySelector(".card__btnDelete");
    btnDel.classList.remove("hidden");
  }
});

socket.on("updatingProduct", async (updatingMsj) => {
  console.log(updatingMsj);
  if (RouteIndex === "realTP/") {
    validateProducts.classList.add("hidden");
    let productUpdate = await getDatabyID(storeProducts[0]._id);
    storeProducts = productUpdate;
    selectAction();
  } else {
    storeProducts = await getData({});
    filters();
  }
});

socket.on("viewingProduct", async (id) => {
  if (RouteIndex === "realTP/") {
    validateProducts.classList.add("hidden");
    let productView = await getDatabyID(storeProducts[0]._id);
    storeProducts = productView;
    selectAction();
    const btnDel = document.querySelector(".card__btnDelete");
    btnDel.classList.add("hidden");
  } else {
    let int = -1;
    let btnDel = [];
    selectAction();
    btnDel = document.querySelectorAll(".card__btnDelete");
    for (const product of storeProducts) {
      int++;
      if (product._id == id) {
        btnDel[int].classList.add("hidden");
      }
    }
  }
});

socket.on("orderExonerate", async (msj) => {
  console.log(msj);
  if (RouteIndex === "realTP/") {
    socket.emit("responseExonerate", storeProducts[0]._id);
    //console.log("Response de producto a exonerar emitido");
  }
});

socket.on("idExonerate", async (id) => {
  //console.log("Id de exoneracion recibida: "+id);
  resExo.push(id);
  //console.log("Id de exoneracion agregada: "+resExo);
});

socket.on("actualize", async (products) => {
  console.log("Successful Validation");
  if (RouteIndex === "realTP") {
    storeProducts = products;
    filters();
  }
});

socket.on("finValidate", async (msj) => {
  console.log(msj);
  validateProducts.classList.add("hidden");
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
    socket.emit("exonerateStatus", "Exonerating Status");
    const validProducts = await validateStatus(resExo);
    //console.log("Productos Validados Correctamente" + validProducts);
    //console.log("Vaciando arreglo de Exoneraciones");
    resExo.length == 0
      ? socket.emit("finExo", "Exemption Completed")
      : validateProducts.classList.remove("hidden");
    resExo = [];
    socket.emit("validateStatus", validProducts);
  } catch {
    console.log("Error Validating Products");
  }
};

formCancel.onclick = () => {
  if (RouteIndex === "realTP/") {
    updateData(storeProducts[0]._id, { status: "success" });
    opc = "static";
    socket.emit("updateproduct", "Updated Products");
    window.location.href = "../realtimeproducts";
  } else {
    form.reset();
  }
};

inputThumbnail.addEventListener("click", () => {
  inputThumbnail.select();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const product = new NewProduct();
  validateProduct(product)
    .then((response) => {
      [result, inputError] = response;
      if (result == "Success") {
        if (RouteIndex === "realTP/") {
          updateData(storeProducts[0]._id, product)
            .then((data) => {
              saveUpdate(data);
            })
            .catch((error) => console.log("Error:" + error));
        } else if (RouteIndex === "realTP") {
          postData(product)
            .then(async (data) => {
              storeProducts = await getData();
              filters();
              Swal.fire({
                title: "Product Added Successfully!",
                text: "Registered Product: " + data.tittle,
                icon: "success",
                confirmButtonText: "Accept",
              });
              form.reset();
              socket.emit("addproduct", "New Product Added");
            })
            .catch((error) => console.log("Error:" + error));
        }
      } else if (result == "Error") {
        let i = 1;
        let action=(RouteIndex==="realTP")?"Invalid New Product":"Invalid Product Update";
        const errorMsj = inputError.reduce(
          (acum, ele) =>
            acum + `<ul><li><b>Error ${i++}>></b> ${ele}...</li></ul>`,
          `<b>${action}</b>`
        );
        Swal.fire({
          html: `<ul>${errorMsj}</ul>`,
          icon: "error",
          confirmButtonText: "Accept",
        });
      }
    })
    .catch((error) => console.log("Error:" + error));
});

selectStatus.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  let query = { status: selectedValue };
  let page = 1;
  if (options) {
    if (selectedValue == "") {
      delete options.query.status;
      if (JSON.stringify(options.query) == "{}") {
        delete options.query;
      } else {
        query = options.query;
      }
      options.page = page;
    } else {
      options.query
        ? (options.query = Object.assign(options.query, query))
        : (options.query = query);
      query = options.query;
      options.page = page;
    }
  } else {
    options = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(options));
  filters();
});

selectOrder.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  options
    ? (options.sort = selectedValue)
    : (options = new NewParams(null, null, selectedValue, null));
  sessionStorage.setItem("values", JSON.stringify(options));
  filters();
});

selectCategory.addEventListener("change", async (event) => {
  const selectedValue = event.target.value;
  let query = { category: selectedValue };
  let page = 1;
  if (options) {
    if (selectedValue == "") {
      delete options.query.category;
      if (JSON.stringify(options.query) == "{}") {
        delete options.query;
      } else {
        query = options.query;
      }
      options.page = page;
    } else {
      options.query
        ? (options.query = Object.assign(options.query, query))
        : (options.query = query);
      options.page = page;
    }
  } else {
    options = new NewParams(null, null, null, query);
  }
  sessionStorage.setItem("values", JSON.stringify(options));
  filters();
});

selectPrevPage.addEventListener("click", () => {
  const prevPage = dataPagination.prevPage;
  options
    ? (options.page = prevPage)
    : (options = new NewParams(null, prevPage, null, null));
  sessionStorage.setItem("values", JSON.stringify(options));
  pagination();
  filters();
});

selectNextPage.addEventListener("click", () => {
  const nextPage = dataPagination.nextPage;
  options
    ? (options.page = nextPage)
    : (options = new NewParams(null, nextPage, null, null));
  sessionStorage.setItem("values", JSON.stringify(options));
  pagination();
  filters();
});
