import app from "./app.js";
import initSocketServer from "./socket.js";
import config from "./config/config.js";

const server = app.listen(config.mongo.port, () => {
  console.log("Server up in port", config.mongo.port);
});

initSocketServer(server);

