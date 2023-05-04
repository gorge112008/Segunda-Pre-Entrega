import { ProductFM } from "../dao/Mongo/classes/DBmanager.js";

getProducts = (req, res) => {
    try {
      let response = ProductFM.getProducts();
      const limit = req.query.limit;
      if (limit && !isNaN(Number(limit))) {
        response = response.slice(0, limit);
      }
      res.status(200).send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  };

  export default productsController;