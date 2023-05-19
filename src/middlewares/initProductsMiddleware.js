import config from "../config/config.js";

const middlewareInitProducts = async (req, res, next) => {
  const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
  const route = req.params.pid? `/api/products/${req.params.pid}` : `/api/products`;
  try {
    const resProducts = await fetch(`${Url}${route}`).then(function (response) { return response.json(); })
    res.locals.resProducts = resProducts;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitProducts;