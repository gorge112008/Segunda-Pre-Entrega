import http from "http";
import app from "./app.js";
import initSocketServer from "./socket.js";
import config from "./config/config.js";

const server = http.createServer(app);
initSocketServer(server);

server.listen(config.mongo.port, () => {
  console.log("Server up in port", config.mongo.port);
});