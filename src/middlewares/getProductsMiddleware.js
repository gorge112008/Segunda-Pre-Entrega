import { ProductFM } from "../dao/Mongo/classes/DBmanager.js";

class ListProducts {
  constructor(payload,totalPages,prevPage,nextPage,page,hasPrevPage,hasNextPage) {
    this.status = "success";
    this.payload = payload;
    this.totalPages = totalPages;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.page = page;
    this.hasPrevPage = hasPrevPage;
    this.hasNextPage = hasNextPage;
    this.prevLink=`/api/products?page=`+prevPage;
    this.nexLink=`/api/productspage=`+nextPage;
  }
}

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
    const resProducts=new ListProducts(products.docs,products.totalPages,products.prevPage,products.nextPage,products.page,products.hasPrevPage,products.hasNextPage,products.prevLink,products.nexLink);
    res.locals.products = resProducts;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareGetProducts;
