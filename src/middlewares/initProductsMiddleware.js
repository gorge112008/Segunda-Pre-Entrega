import config from "../config/config.js";
import axios from "axios";

const middlewareInitProducts = async (req, res, next) => {
  try {
    const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
    const route = req.params.pid
      ? `/api/products/${req.params.pid}`
      : `/api/products`;
    const resProducts =  await axios.get(`${Url}${route}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
    req.params.pid
      ? (res.locals.resProducts = resProducts.data)
      : (res.locals.resProducts = resProducts.data.payload);
    /*PRUEBA SIN PRODUCTOS*/
    //res.locals.resProducts=[];
      next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitProducts;
