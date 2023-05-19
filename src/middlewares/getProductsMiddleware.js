import { ProductFM } from "../dao/Mongo/classes/DBmanager.js";

const middlewareGetProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Valor predeterminado de 10
    const page = parseInt(req.query.page) || 1; // Valor predeterminado de 1
    const reqSort = req.query.sort;
    const sort = {};
    if (reqSort === "asc") {
      sort.price = 1;
    } else if (reqSort === "desc") {
      sort.price = -1;
    }
    const reqQuery = req.query || "";
    let query = {};
    
    if (reqQuery !== "") {
      const { limit, page, sort, ...rest } = reqQuery;
      query = { ...rest };
    }else{
      query={};
    }
    const products = await ProductFM.getProducts({
      limit,
      page,
      sort,
      query,
    });
    res.locals.products = products;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareGetProducts;
