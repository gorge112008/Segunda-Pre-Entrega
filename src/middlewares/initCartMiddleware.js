import config from "../config/config.js";
import { CartFM } from "../dao/Mongo/classes/DBmanager.js";

const middlewareInitCart = async (req, res, next) => {
  try {
    let carts = await CartFM.getCarts();
    const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
    const route =`api/carts/${carts[0]._id} `;
    const resProducts = await fetch(`${Url}/${route}`).then(function (response) {
      return response.json();
    });
    const arrayCart=resProducts[0].products;
    const products=arrayCart[0].payload;
    res.locals.resProducts = products;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitCart;
