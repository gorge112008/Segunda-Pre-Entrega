/*HOME -- REALTIMEPRODUCTS*/

/**********************************************************CONSTANTES/VARIABLES*************************************************************/

const socket = io();
let URLdomain = window.location.host,
  protocol = window.location.protocol;
let Url = protocol + "//" + URLdomain + "/api/products/";
let opc = "update";
let btnsDelete;
let storeProducts = [],
  resExo = [];

const containDinamic = document.querySelector(".main__container__dinamic"),
  tittleDinamic = document.querySelector(".dinamic__tittle--h3"),
  form = document.querySelector("form"),
  formInput = document.querySelectorAll(".input-field label"),
  formCancel = document.querySelector(".form--btnCancel"),
  validateProducts = document.querySelector("#validate"),
  inputTittle = document.querySelector("#tittle"),
  inputDescription = document.querySelector("#description"),
  inputCode = document.querySelector("#code"),
  inputPrice = document.querySelector("#price"),
  inputStock = document.querySelector("#stock"),
  inputThumbnail = document.querySelector("#thumbnail"),
  contain = document.querySelector(".container__grid"),
  btn_return = document.querySelector("#btn-return");

/*****************************************************************CLASES*************************************************************/

class NewProduct {
  constructor() {
    this.tittle = inputTittle.value;
    this.description = inputDescription.value;
    this.code = +inputCode.value;
    this.status = true;
    this.stock = +inputStock.value;
    this.category = "Food";
    this.price = +inputPrice.value;
    this.thumbnail = validarUrl()
      ? inputThumbnail.value
      : "https://energiaypotencia.com/img/imagen-no-disponible.jpg";
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
      if (product.status == false && opc == "update") continue;
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
                class="btn btn-outline-danger btn-sm card__btnDelete"
                id=${product._id}
              >
                <i class="fas fa-trash-alt"></i>
              </button>
              <button
                type="button"
                class="btn btn-outline-warning btn-sm btnUpdate"
                id="btnUpdate"
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
  if (storeProducts.length == 1) {
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
    if (opc == "update") {
      updateData(Url, storeProducts[0]._id, { status: false });
      socket.emit(
        "updatingProduct",
        storeProducts[0].tittle + " actualizandose..."
      );
      opc = "reset";
    } else {
      selectDelete();
    }
  } else {
    tittleDinamic.innerHTML = "Ingresa un producto";
    opc = "update";
  }
}

async function selectDelete() {
  btnsDelete = await crearHtml();
  btnsDelete.forEach((selectBtn) => {
    selectBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const productoSelect = await getData(selectBtn.id);
      Swal.fire({
        title:
          "YOU WANT TO DELETE THE PRODUCT " +
          productoSelect[0].tittle.toUpperCase() +
          " ?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "YES",
        denyButtonText: "NOT",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteData(Url, selectBtn.id)
            .then(async (data) => {
              Swal.fire({
                title: "Product Removed Successfully!!!",
                text:
                  "Product Removed>> " +
                  "ID: " +
                  data +
                  " --> " +
                  productoSelect[0].tittle,
                icon: "success",
                confirmButtonText: "Accept",
              });
              socket.emit("deleteproduct", "Producto Eliminado");
            })
            .catch((error) => console.log("Error:" + error));
        } else if (result.isDenied) {
          Swal.fire("ACTION CANCELED", "", "info");
        }
      });
    });
  });
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
    if (idExo.includes(product._id)) continue;
    if (product.status == false) {
      updateData(Url, product._id, { status: true });
    }
  }
  const newProducts = await getData();
  return newProducts;
}

/*INICIO FUNCIONES CRUD*/
async function getData(id) {
  try {
    if (id) {
      let key = Url + id;
      let response = await fetch(key, {
        method: "GET",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        mode: "cors",
      });
      const data = await response.json();
      return data;
    } else {
      let response = await fetch(Url, {
        method: "GET",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        mode: "cors",
      });
      const data = await response.json();
      return data;
    }
  } catch {
    console.log(Error);
  }
}

async function postData(url, data) {
  try {
    let response = await fetch(url, {
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

async function updateData(url, id, data) {
  try {
    let key = url + id;
    let response = await fetch(key, {
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

async function deleteData(url, id) {
  try {
    let key = url + id;
    let response = await fetch(key, {
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

socket.on("backProducts", async (getProducts) => {
  Object.assign(storeProducts, getProducts); //ASIGNAR PRODUCTOS AL STORE
  selectAction(); //SELECCIONAR ACCIONES
  selectDelete();
});

socket.on("f5NewProduct", async (addMsj) => {
  console.log(addMsj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }
});

socket.on("f5deleteProduct", async (deletedMsj) => {
  console.log(deletedMsj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }else{
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
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  }
});

socket.on("updatingProduct", async (updatingMsj) => {
  console.log(updatingMsj);
  if (storeProducts.length != 1) {
    storeProducts = await getData();
    selectDelete();
  } else {
    validateProducts.classList.add("hidden");
  }
});

socket.on("ordenExonerar", async (msj) => {
  console.log(msj);
  if (storeProducts.length == 1) {
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
  if (storeProducts.length != 1) {
    storeProducts = products;
    selectDelete();
  }
});

socket.on("finValidate", async (msj) => {
  console.log(msj);
  validateProducts.classList.add("hidden");
});

/*****************************************************************EVENTOS*************************************************************/

//PROCESO DE VALIDACION DE PRODUCTOS OCULTOS//

/*CUANDO UN USUARIO EDITA UN PRODUCTO, EL PRODUCTO ADQUIERE UNA PROPIEDAD DE STATUS FALSE, ESTO EVITARIA QUE OTRO USUARIO
EDITE AL MISMO TIEMPO EL MISMO PRODUCTO. PERO SI EL USUARIO EDITOR NO GUARDA NI CANCELA LA EDICION, EL PRODUCTO QUEDA CON STATUS FALSE
EVITANDO QUE EL PRODUCTO PUEDA SER MODIFICADO AUN CUANDO YA NADIE LO ESTA EDITANDO.
ESTOS PRODUCTOS SERAN CONSIDERADOS COMO PRODUCTOS OCULTOS, ESTO SIGNIFICA QUE EL PRODUCTO NO SE MOSTRARA EN LA PAGINA DE PRODUCTOS.
ENTONCES PARA QUE EL PRODUCTO VUELVA A MOSTRARSE EN LA PAGINA DE PRODUCTOS, SE DEBE VALIDAR EL PRODUCTO
ESTO SE HACE CON EL BOTON DE VALIDAR PRODUCTOS (VALIDATE), EL CUAL LLAMA A LA FUNCION DE VALIDAR STATUS (validateStatus),
ESTA FUNCION BUSCA LOS PRODUCTOS CON STATUS FALSE Y LOS DEVUELVE A TRUE MOSTRANDOLOS EN LA PAGINA DE PRODUCTOS Y PERMITIENDO SU MODIFICACION.
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

formCancel.onclick = () => {
  if (storeProducts.length == 1) {
    updateData(Url, storeProducts[0]._id, { status: true });
    socket.emit("updateproduct", "Productos Actualizados");
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
  if (storeProducts.length == 1) {
    updateData(Url, storeProducts[0]._id, product)
      .then((data) => {
        if (data == null) {
          Swal.fire({
            title: "Error>> Repeated Code f",
            text: "Please enter a new code",
            icon: "error",
            confirmButtonText: "Accept",
          });
          inputCode.value = "";
          inputCode.focus();
        } else {
          saveUpdate(data);
        }
      })
      .catch((error) => console.log("Error:" + error));
  } else {
    postData(Url, product)
      .then(async (data) => {
        if (data == null) {
          Swal.fire({
            title: "Error>> Repeated Code f",
            text: "Please enter a new code",
            icon: "error",
            confirmButtonText: "Accept",
          });
          inputCode.value = "";
          inputCode.focus();
        } else {
            storeProducts= await getData();
            selectDelete();
            Swal.fire({
              title: "Product Added Successfully!",
              text: "Registered Product: " + data.tittle,
              icon: "success",
              confirmButtonText: "Accept",
            });
            form.reset();
            socket.emit("addproduct", "Nuevo Producto Agregado");
        }
      })
      .catch((error) => console.log("Error:" + error));
  }
});
