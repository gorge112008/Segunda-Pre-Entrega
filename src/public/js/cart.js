const socket = io();
let URLPathName = window.location.pathname,
  URLdomain = window.location.host,
  protocol = window.location.protocol;
let UrlP = protocol + "//" + URLdomain + "/api/products";
let UrlC = protocol + "//" + URLdomain + "/api/carts";
let opc = "static";
let btnRemove, btnCloseView, btnRemoveCart;
let storeCarts = [],
  storeProducts = [],
  resExo = [],
  defaultStore = [];
let opciones;
let dataProducts = [];
let querySelect;
let query = {};

const staticContain = document.querySelector(".static__container--cart"),
  titleCart = document.querySelector(".static__tittleCart"),
  containCart = document.querySelector(".container__cart");

/*****************************************************************CLASES*************************************************************/

class NewCart {
  constructor() {
    this.products = [{ status: "sucess", payload: [] }];
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

async function crearHTMLCarts() {
  if (storeCarts.length == 0) {
    Swal.fire({
      title: "NO CARTS FOUND",
      text: "No carts found, create a New Cart",
      icon: "warning",
      confirmButtonText: "Accept",
    });
  } else {
    titleCart.innerHTML = "";
    containCart.innerHTML = "";
    let html;
    let int = -1;
    for (const cart of storeCarts) {
      let countQuantity = 0;
      let cartDetails = cart.products;
      let productsCart = cartDetails[0].payload;
      if (productsCart == []) {
        console.log("CART " + int + " EMPTY");
      } else {
        for (const product of productsCart) {
          if (product.quantity) {
            countQuantity += product.quantity;
          }
        }
      }
      int++;
      html = `<div class="container__cart__card">
    <div class="card col s12">
      <div class="card_cart--header row noMargin">
        <div class="cart-header--filled col s12">
          <h5 class="cart-title--filled">ID CART:
            ${cart._id}	
          </h5>
        </div>
      </div>
      <div class="card_cart--body row noMargin">
        <div class="card_imgCart col s3 m3 l3">
          <img
            src="https://w7.pngwing.com/pngs/225/984/png-transparent-computer-icons-shopping-cart-encapsulated-postscript-shopping-cart-angle-black-shopping.png"
            class="img-fluid rounded-start"
            alt="..."
          />
          <div class="card_imgCart--overlay">
            <b>${int + 1}</b>
          </div>
        </div>
        <button
        type="button"
        class="btn fas fa-trash-alt btnRemoveCart"
        id=${cart._id}
      >
    </button>
        <div class="card_containCart col s8 m8 l8">
          <div class="loaded">
          <b>STATUS CARD:<u class="aquamarine">***${cartDetails[0].status.toUpperCase()}***</u></b>
          <b>QUANTITY OF PRODUCTS: <b class="quantityP">${countQuantity}</b></b>
          </div>
          <button
                type="button"
                class="btn btn-outline-warning btn-sm btnViewCart"
              >
                <a
                  class="fa-regular fa-eye"
                  href="/cart/${cart._id}"
                ></a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
      containCart.innerHTML += html;
    }
    titleCart.innerHTML = `<h5>Carts (${storeCarts.length}):</h5>`;
    btnRemoveCart = document.querySelectorAll(".btnRemoveCart");
    return btnRemoveCart;
  }
}

async function crearHTMLProductsCarts() {
  if (storeProducts.length == 0) {
    titleCart.innerHTML = `<h5>Cart Empty</h5>`;
    containCart.innerHTML = "";
    containCart.innerHTML = `
    <div class="container__empty__card">
        <div class="card">
          <div class="card-item--empty">
          <i class="fa-solid fa-rectangle-xmark fa-beat-fade"></i>
          </div>
          <div class="card-body--empty">
            <b class="card-text--empty">Not Products Found</b>
            <p class="card-text--empty">You have not added any product in this cart</p>
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
    btnClearCart.classList.add("hidden");
    btnAdd = document.querySelector(".btnAddProduct");
    return btnAdd;
  } else {
    containCart.innerHTML = "";
    let html;
    let count = 0;
    for (const listProduct of storeProducts) {
      const product = listProduct.product;
      if (product == null || listProduct.quantity == 0) {
        deletedProductCart(storeCarts[0]._id, product._id);
        continue;
      }
      count++;
      const total = product.price * listProduct.quantity;
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
              class="btn fas fa-trash-alt card__btnDelete"
              id=${product._id}
            >
            </button>
            <button
              type="button"
              class="btn btn-outline-warning btn-sm btnUpdate--Min"
              id=${product._id}
            >
            <i class="fa-regular fa-square-minus"></i>
            </button>
            <button
              type="button"
              class="btn btn-outline-warning btn-sm btnUpdate--Max"
              id=${product._id}
            >
            <i class="fa-regular fa-square-plus"></i>
            </button>
          </div>
            <div class="card-body">
              <b class="card-text--description">${product.description}</b>
              <u class="card-text--price">Precio Unitario: S/.${product.price}</u>
              <b class="card-text--total">Precio Total: S/.${total}</b>
            </div>
            <div class="card-footer">
              <b class="card-text--quantity">
                Cantidad: <b class="quantity">${listProduct.quantity}</b>
              </b>
            </div>
          </div>
        </div>
        </div>`;
      containCart.innerHTML += html;
    }
    containCart.classList.replace("container__cart", "container__grid");
    staticContain.classList.replace(
      "static__container--cart",
      "static__container--grid"
    );
    btnClearCart.classList.remove("hidden");
    titleCart.innerHTML = `<h5>Products Cart (${count}):</h5>`;
    bnUpdateAdd = document.querySelectorAll(".btnUpdate--Max");
    btnUpdateDel = document.querySelectorAll(".btnUpdate--Min");
    btnAllDel = document.querySelectorAll(".card__btnDelete");
    return [bnUpdateAdd, btnUpdateDel, btnAllDel];
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
async function getDataCarts() {
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

async function getDataCartsbyID(id) {
  let response = await fetch(`${UrlC}/${id}`, {
    method: "GET",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    mode: "cors",
  });
  const data = await response.json();
  return data;
}

async function getDataProductsbyID(id) {
  try {
    let response = await fetch(`${UrlC}/${id}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    const dataProducts = data[0].products[0].payload;
    return dataProducts;
  } catch {
    console.log(Error);
  }
}

async function getDataOneProductbyID(id) {
  try {
    let response = await fetch(`${UrlP}/${id}`, {
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

async function updateData(idCart, idProduct, data) {
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

async function updateOneProductbyID(idProduct, data) {
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

async function deletedProductCart(idCart, idProduct) {
  try {
    let response = await fetch(`${UrlC}/${idCart}/products/${idProduct}`, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
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

async function deleteAllProductsCart(idCart) {
  try {
    let response = await fetch(`${UrlC}/${idCart}`, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
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

async function deleteCart(idCart) {
  try {
    let response = await fetch(`${UrlC}/${idCart}/delete`, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
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
/*FIN FUNCIONES CRUD*/

async function selectBtnCartProducts() {
  try {
    if (storeProducts != 0) {
      [bnUpdateAdd, btnUpdateDel, btnAllDel] = await crearHTMLProductsCarts();
      bnUpdateAdd.forEach((btnAdd) => {
        btnAdd.addEventListener("click", async (e) => {
          e.preventDefault();
          const productoSelect = await getDataOneProductbyID(btnAdd.id);
          const pStock = productoSelect[0].stock;
          const pId = btnAdd.id;
          const optStock = await crearListStock(pStock);
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
              const idCart = storeCarts[0]._id;
              const selectValue = Swal.getPopup().querySelector("select").value;
              const quantity = { stock: selectValue };
              const newStock = pStock - +selectValue;
              updateOneProductbyID(pId, { stock: newStock });
              updateData(idCart, pId, quantity)
                .then(async (data) => {
                  Swal.fire({
                    title: "Product(s) Added Successfully!!!",
                    text:
                      "Product Added>> " +
                      productoSelect[0].tittle +
                      " -->Quantity: " +
                      selectValue,
                    icon: "success",
                    confirmButtonText: "Accept",
                  });
                  socket.emit("updateproduct", "Productos Actualizados");
                  socket.emit(
                    "addingCart",
                    `Se ha añadido ${selectValue} ${productoSelect[0].tittle} al carrito.`
                  );
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
      btnUpdateDel.forEach((btnUpd) => {
        btnUpd.addEventListener("click", async (e) => {
          e.preventDefault();
          let selectProduct;
          let products = storeCarts[0].products[0].payload;
          for (const listProduct of products) {
            let product = listProduct.product;
            product._id == btnUpd.id
              ? (selectProduct = listProduct)
              : (selectProduct = selectProduct);
          }
          const quantity = selectProduct.quantity;
          const pId = btnUpd.id;
          const optStock = await crearListStock(quantity);
          Swal.fire({
            html: `How many ${selectProduct.product.tittle} do you want to delete to the cart?`,
            input: "select",
            inputOptions: optStock,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const idCart = storeCarts[0]._id;
              const selectValue = Swal.getPopup().querySelector("select").value;
              const quantity = { quantity: selectValue };
              const product = await getDataOneProductbyID(pId);
              const newStock = product[0].stock + +selectValue;
              updateOneProductbyID(pId, { stock: newStock });
              updateData(idCart, pId, quantity)
                .then(async (data) => {
                  Swal.fire({
                    title: "Product(s) Deleted Successfully!!!",
                    text:
                      "Product Deleted>> " +
                      selectProduct.product.tittle +
                      " -->Quantity: " +
                      selectValue,
                    icon: "success",
                    confirmButtonText: "Accept",
                  });
                  socket.emit("updateproduct", "Productos Actualizados");
                  socket.emit(
                    "deletingCart",
                    `Se ha eliminado ${selectValue} ${selectProduct.product.tittle} del carrito.`
                  );
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
      btnAllDel.forEach((btnDel) => {
        btnDel.addEventListener("click", async (e) => {
          e.preventDefault();
          let Product;
          let products = storeCarts[0].products[0].payload;
          for (const listProduct of products) {
            let product = listProduct.product;
            product._id == btnDel.id
              ? (Product = listProduct)
              : (Product = Product);
          }
          const quantity = Product.quantity;
          const productoSelect = await getDataOneProductbyID(btnDel.id);
          Swal.fire({
            html:
              `<h4>Are you sure to delete the product?<h4>` +
              `\n` +
              `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "YES",
            denyButtonText: "NOT",
          }).then(async (result) => {
            if (result.isConfirmed) {
              const idCart = storeCarts[0]._id;
              const idProduct = btnDel.id;
              const newStock = productoSelect[0].stock + +quantity;
              updateOneProductbyID(btnDel.id, { stock: newStock });
              deletedProductCart(idCart, idProduct)
                .then(async (data) => {
                  Swal.fire({
                    title: "Product Removed Successfully!!!",
                    text: "Product Removed>> " + "ID: " + idProduct,
                    icon: "success",
                    confirmButtonText: "Accept",
                  });
                  socket.emit("updateproduct", "Productos Actualizados");
                  socket.emit(
                    "removeProduct",
                    `Producto ${productoSelect.tittle} Eliminado del Carrito`
                  );
                })
                .catch((error) => console.log("Error:" + error));
            } else if (result.isDenied) {
              Swal.fire("ACTION CANCELED", "", "info");
            }
          });
        });
      });
    } else {
      btnAdd = await crearHTMLProductsCarts();
      btnAdd.addEventListener("click", () => {
        window.location.href = "../products";
      });
    }
  } catch (error) {
    console.log(error + ": No hay productos para remover del carrito");
  }
}

async function selectRemoveCart() {
  try {
    btnRemoveCart = await crearHTMLCarts();
    btnRemoveCart.forEach((selectBtn) => {
      selectBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const cardSelect = await getDataCartsbyID(selectBtn.id);
        Swal.fire({
          html:
            `<h4>Are you sure to delete the cart?<h4>` +
            `\n` +
            `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: "YES",
          denyButtonText: "NOT",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteCart(cardSelect[0]._id)
              .then(async (data) => {
                Swal.fire({
                  title: "Cart Removed Successfully!!!",
                  text: "Cart Removed>> " + "ID: " + cardSelect[0]._id,
                  icon: "success",
                  confirmButtonText: "Accept",
                });
                socket.emit(
                  "removeCart",
                  `Carrito ${cardSelect[0]._id} Eliminado`
                );
              })
              .catch((error) => console.log("Error:" + error));
          } else if (result.isDenied) {
            Swal.fire("ACTION CANCELED", "", "info");
          }
        });
      });
    });
  } catch (error) {
    console.log(error + ": No existen carritos para ser removidos.");
  }
}

/*****************************************************************SOCKETS*************************************************************/

socket.on("callCarts", async (getCarts) => {
  Object.assign(storeCarts, getCarts);
  storeCarts.length == 1
    ? (storeProducts = await getDataProductsbyID(storeCarts[0]._id))
    : (storeProducts = []);
  //ASIGNAR PRODUCTOS AL STORE
  /*if (storeCarts.length == 1) {
    sessionStorage.setItem("cartUpdate", storeCarts[0]._id);
    if (window.location.pathname == "/cart") {
      storeCarts = await getDataCarts();
      crearHTMLCarts();
      ;
    }
  }else if (storeCarts.length != 1) {
    if ((window.location.pathname).startsWith('/cart/') ) {
      let idCart=sessionStorage.getItem("cartUpdate");
      storeProducts = await getDataCartsbyID(idCart);
      crearHTMLProductsCarts();
    }
  }*/
  focusAction();
  storeCarts.length == 1 ? selectBtnCartProducts() : selectRemoveCart();
  //await getDataCarts();
  //selectBtnCartProducts()
  //console.log("llega primero "+JSON.stringify(storeProducts));
});

socket.on("addingCart", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

socket.on("deletingCart", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

socket.on("removeProduct", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

socket.on("emptyCart", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

socket.on("removeCart", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

socket.on("NewCart", async (msj) => {
  console.log(msj);
  if (storeCarts.length == 1) {
    storeProducts = await getDataProductsbyID(storeCarts[0]._id);
    selectBtnCartProducts();
  } else {
    storeProducts = [];
    storeCarts = await getDataCarts();
    selectRemoveCart();
  }
});

/*****************************************************************EVENTOS*************************************************************/

btnAddNewCart.addEventListener("click", () => {
  Swal.fire({
    title: "YOU WANT ADD NEW CART?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "YES",
    denyButtonText: "NOT",
  }).then((result) => {
    if (result.isConfirmed) {
      const cart = new NewCart();
      createCart(cart)
        .then(async (data) => {
          Swal.fire({
            title: "Cart Created Successfully!!!",
            text: "Cart created>> " + "ID: " + data._id,
            icon: "success",
            confirmButtonText: "Accept",
          });
          socket.emit("NewCart", `Nuevo carrito ${data._id} Creado`);
        })
        .catch((error) => console.log("Error:" + error));
    } else if (result.isDenied) {
      Swal.fire("ACTION CANCELED", "", "info");
    }
  });
});

btnClearCart.addEventListener("click", () => {
  Swal.fire({
    html:
      `<h4>Are you sure to empty the cart??<h4>` +
      `\n` +
      `<h6><b>(Remember that you will not be able to recover it!!!)<b><h6>`,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "YES",
    denyButtonText: "NOT",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let idCart = storeCarts[0]._id;
      deleteAllProductsCart(idCart)
        .then(async (data) => {
          Swal.fire({
            title: "All Products Cart Removed Successfully!!!",
            text: "Cart Clean>> " + "ID: " + idCart,
            icon: "success",
            confirmButtonText: "Accept",
          });
          socket.emit("emptyCart", `Carrito ${idCart} Vaciado`);
        })
        .catch((error) => console.log("Error:" + error));
    } else if (result.isDenied) {
      Swal.fire("ACTION CANCELED", "", "info");
    }
  });
});

btnExitCart.onclick = () => {
  window.location.href = "../cart";
};
