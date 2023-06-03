import config from "../config/config.js";

const middlewareInitCart = async (req, res, next) => {
  try {
    const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
    const route = req.params.cid
      ? `/api/carts/${req.params.cid}`
      : `/api/carts`;
      const resCarts = await fetch(`${Url}${route}`).then(function (response) {
        return response.json();
      });
    res.locals.resCarts = resCarts;
    /*PRUEBA SIN CARTS*/
    //res.locals.resCarts=[];
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitCart;
