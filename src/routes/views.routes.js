import { Router } from "express";

const routerViews = Router();
let resProducts;
let resMessages;

let domain, protocol, Url, route;

async function initProducts(req, id) {
  try {
    domain = req.hostname;
    protocol = req.protocol;
    Url = protocol + "://" + domain + ":3000";
    id ? (route = `/api/products/${id}`) : (route = `/api/products`);
    resProducts = await fetch(`${Url}${route}`).then(function (response) {
      return response.json();
    });
    return resProducts;
  } catch (error) {
    return error;
  }
}

async function initChat(req) {
  try {
    domain = req.hostname;
    protocol = req.protocol;
    Url = protocol + "://" + domain + ":3000";
    resMessages = await fetch(`${Url}/api/messages`).then(function (response) {
      return response.json();
    });
    return resMessages;
  } catch (error) {
    return error;
  }
}

routerViews.get("/", (req, res) => {
  res.render("index", {});
});

routerViews.get("/home", async (req, res) => {
  resProducts = await initProducts(req);
  res.render("home", { resProducts });
});

routerViews.get("/realtimeproducts", async (req, res) => {
  resProducts = await initProducts(req);
  res.render("realtimeproducts", { resProducts });
});

routerViews.get("/realtimeproducts/:pid", async (req, res) => {
  const pid = req.params.pid;
  resProducts = await initProducts(req, pid);
  res.render("realtimeproducts", { resProducts });
});

routerViews.get("/chat", async (req, res) => {
  resMessages = await initChat(req);
  res.render("chat", { resMessages });
});

export default routerViews;
export { resProducts, resMessages };
