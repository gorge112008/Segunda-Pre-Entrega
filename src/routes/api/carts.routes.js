import { Router } from "express";
import { CartFM, ProductFM } from "../../dao/Mongo/classes/DBmanager.js";

const routerCarts = Router();

/*****************************************************************GET*************************************************************/
routerCarts.get("/carts", async (req, res) => {
  try {
    let carts = await CartFM.getCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    let cart = await CartFM.getCartId(cid);
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************POST*************************************************************/
/* RUTAS PARA CREAR CARRITOS Y AGREGAR PRODUCTOS CON POST//

routerCarts.post("/carts", async (req, res) => {
  try {
    const newCart = req.body;
    let productsFind = [];
    if (newCart.products) {
      newCart.products.forEach((productItem) => {
        if (productItem._id) {
          let find = 0;
          productsFind.forEach((findItem) => {
            if (productItem._id == findItem.product) {
              findItem.quantity++;
              find = 1;
            }
          });
          if (find == 0) {
            productsFind.push({ product: productItem._id, quantity: 1 });
          }
        }
      });
      newCart.products = productsFind;
      const response = await CartFM.addCart(newCart);
      res.status(200).send(response);
    } else {
      res.status(400).send("Bad Request--> The cart is not valid");
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.post("/carts/:cid/products/:pid", async function (req, res) { 
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid = await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayProducts.forEach(async (cartItem) => {
        //res.status(200).send("ARRAY"+cartItem._id+"CID:::"+cid);
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          let find = 0;
          const cartProducts=cartItem.products;
          cartProducts[0].payload.forEach( (productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              productItem.quantity++;
              find = 1;
              res.status(200).send("ADDED PRODUCT");
            }
          });
          if (find == 0) {
            cartProducts[0].payload.push({ product: responsepid[0]._id, quantity: 1 });
             res.status(200).send("NEW PRODUCT");
          }
          await CartFM.updateCart(cid, cartProducts);
        }
      });
    }
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});
*/
/******************************************************************PUT************************************************************/
routerCarts.put("/carts/:cid",async(req,res)=>{
  try {
    const cid = req.params.cid;
    const reqProducts=req.body;
    const newProducts = reqProducts.products;
    let productsFind = [];
    if (newProducts.payload) {
      newProducts.payload.forEach((productItem) => {
        if (productItem._id) {
          let find = 0;
          productsFind.forEach((findItem) => {
            if (productItem._id == findItem.product) {
              findItem.quantity++;
              find = 1;
            }
          });
          if (find == 0) {
            productsFind.push({ product: productItem._id, quantity: 1 });
          }
        }
      });
      newProducts.payload = productsFind;
      reqProducts.products=newProducts;
      const response = await CartFM.updateCart(cid,reqProducts);
      res.status(200).send(response);
    } else {
      res.status(400).send("Bad Request--> The cart is not valid");
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerCarts.put("/carts/:cid/products/:pid", async function (req, res) { 
  try {
    //const stock=req.body;
    const stock=10;
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid = await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayProducts.forEach(async (cartItem) => {
        //res.status(200).send("ARRAY"+cartItem._id+"CID:::"+cid);
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          let find = 0;
          const cartProducts=cartItem.products;
          cartProducts[0].payload.forEach( (productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              productItem.quantity=stock;
              find = 1;
              res.status(200).send("ADDED PRODUCT");
            }
          });
          if (find == 0) {
            cartProducts[0].payload.push({ product: responsepid[0]._id, quantity: stock });
             res.status(200).send("NEW PRODUCT");
          }
          const updateProducts={products:cartProducts[0]};
          await CartFM.updateCart(cid, updateProducts);
        }
      });
    }
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});
/*****************************************************************DELETE*************************************************************/

routerCarts.delete("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    //await CartFM.deleteCart(cid); //Opcion para Eliminar el carrito especifico
    let cart = await CartFM.getCartId(cid);
    cart[0].products = [];
    const response = await CartFM.updateCart(cid,cart[0]);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({error: err});
  }
});

routerCarts.delete("/carts/:cid/products/:pid", async function (req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayCarts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid =await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayCarts.forEach(async (cartItem) => {
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          const cartProducts=cartItem.products;
          cartProducts[0].payload.forEach((productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE RESTA
              productItem.quantity--;
              if (productItem.quantity == 0) {
                let index=cartProducts[0].payload.indexOf(productItem); 
                cartProducts[0].payload.splice(index, 1);  
              } 
              res.status(200).send("DELETE PRODUCT");
            }
          });
          await CartFM.updateCart(cid, cartProducts);
        }
      });
    }
    res.status(400).end();
  } catch (error) {
    res.status(500).send(console.log(error));
  }

});

export default routerCarts;
