import config from "../config/config.js";

const middlewareInitMessages = async (req, res, next) => {
  const Url = `${req.protocol}://${req.hostname}:${config.mongo.port}`;
  try {
    const resMessages = await fetch(`${Url}/api/messages`).then(function (response) { return response.json(); })
    res.locals.resMessages = resMessages;
    next();
  } catch (error) {
    next(error);
  }
};

export default middlewareInitMessages;
