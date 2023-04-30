import { Router } from "express";
import { CartFM, ProductFM } from "../dao/classes/DBmanager.js";

const routerCarts = Router();

/*****************************************************************GET*************************************************************/
routerCarts.get("/carts", async (req, res) => {
  try {
    let carts = await CartFM.getCarts();
    const limit = req.query.limit;
    if (limit && !isNaN(Number(limit))) {
      carts = carts.slice(0, limit);
    }
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
          cartItem.products.forEach( (productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE SUMA
              productItem.quantity++;
              find = 1;
              res.status(200).send("ADDED PRODUCT");
            }
          });
          if (find == 0) {
            cartItem.products.push({ product: responsepid[0]._id, quantity: 1 });
             res.status(200).send("NEW PRODUCT");
          }
          await CartFM.updateCart(cid, cartItem);
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
    await CartFM.deleteCart(cid);
    res.status(200).json(cid);
  } catch (err) {
    res.status(500).json({error: err});
  }
});

routerCarts.delete("/carts/:cid/products/:pid", async function (req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const arrayProducts = await CartFM.getCarts();
    const responsecid = await CartFM.getCartId(cid);
    const responsepid =await ProductFM.getProductId(pid);
    if (!isNaN(responsepid) || !isNaN(responsecid)) {
      res.status(400).send(`Error --> The route is not valid`);
    } else {
      arrayProducts.forEach(async (cartItem) => {
        if (cartItem._id == cid) {
          //SI EL ARREGLO TIENE LA ID DEL CARRITO SE ENTRA
          cartItem.products.forEach((productItem) => {
            if (productItem.product == pid) {
              //SI EL PRODUCTO TIENE LA ID REPETIDA SE RESTA
              productItem.quantity--;
              if (productItem.quantity == 0) {
                let index=cartItem.products.indexOf(productItem); 
                cartItem.products.splice(index, 1);  
              } 
              res.status(200).send("DELETE PRODUCT");
            }
          });
          await CartFM.updateCart(cid, cartItem);
        }
      });
    }
    res.status(400).end();
  } catch (error) {
    res.status(500).send(console.log(error));
  }
});

export default routerCarts;
