import { Router } from "express";
import middlewareInitProducts from "../middlewares/initProductsMiddleware.js";
import middlewareInitMessages from "../middlewares/initMessagesMiddleware.js";

const routerViews = Router();
let resProducts, resMessages;

routerViews.get("/", (req, res) => {
  res.render("index", {});
});

routerViews.get("/home", middlewareInitProducts ,async (req, res) => {
  resProducts = await res.locals.resProducts;
  res.render("home", { resProducts });
});

routerViews.get("/realtimeproducts",middlewareInitProducts, async (req, res) => {
  resProducts = await res.locals.resProducts;
  res.render("realtimeproducts", { resProducts });
});

routerViews.get("/realtimeproducts/:pid",middlewareInitProducts, async (req, res) => {
  resProducts = await res.locals.resProducts;
  res.render("realtimeproducts", { resProducts });
});

routerViews.get("/chat",middlewareInitMessages, async (req, res) => {
  resMessages = await res.locals.resMessages;
  res.render("chat", { resMessages });
});

export default routerViews;
export { resProducts, resMessages };
