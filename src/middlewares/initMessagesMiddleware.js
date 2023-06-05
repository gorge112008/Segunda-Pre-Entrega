import config from "../config/config.js";
import axios from "axios";

const middlewareInitMessages = async (req, res, next) => {
  const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
  try {
    const resMessages = await axios.get(`${Url}/api/messages`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
    res.locals.resMessages = resMessages.data;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitMessages;
