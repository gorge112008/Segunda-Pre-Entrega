import { Router } from "express";
import { CartFM, ProductFM } from "../dao/Mongo/classes/DBmanager.js";

const routerProducts = Router();

/*****************************************************************GET*************************************************************/

routerProducts.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Valor predeterminado de 10
    const page = parseInt(req.query.page) || 1; // Valor predeterminado de 1
    const reqSort = req.query.sort; // Valor predeterminado de ''
    const sort = {};
    if (reqSort === "asc") {
      sort.price = 1;
    } else if (reqSort === "desc") {
      sort.price = -1;
    }
    const query = req.query.query || "";
    const products = await ProductFM.getProducts({
      limit,
      page,
      sort,
      query,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

routerProducts.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    let product = await ProductFM.getProductId(pid);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************POST*************************************************************/

routerProducts.post("/products", async (req, res) => {
  try {
    const newProduct = req.body;
    let response = await ProductFM.addProduct(newProduct);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************PUT*************************************************************/

routerProducts.put("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const body = req.body;
    let response = await ProductFM.updateProduct(pid, body);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/*****************************************************************DELETE*************************************************************/

routerProducts.delete("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await ProductFM.deleteProduct(pid);
    res.status(200).json(pid);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/****************************************************FINAL ENDPOINTS: GET*************************************************************/
routerProducts.get("*", function (req, res) {
  res.status(404).send("The route is incorrect");
});

export default routerProducts;
