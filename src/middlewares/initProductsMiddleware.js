import config from "../config/config.js";

const middlewareInitProducts = async (req, res, next) => {
  try {
    const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
    const route = req.params.pid
      ? `/api/products/${req.params.pid}`
      : `/api/products`;
    const resProducts = await fetch(`${Url}${route}`).then(function (response) {
      return response.json();
    });
    req.params.pid
      ? (res.locals.resProducts = resProducts)
      : (res.locals.resProducts = resProducts.payload);
    /*PRUEBA SIN PRODUCTOS*/
    //res.locals.resProducts=[];
      next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitProducts;
