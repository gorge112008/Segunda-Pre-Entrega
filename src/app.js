import express from "express";
import { engine } from "express-handlebars";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routerProducts from "./routes/products.routes.js";
import routerCarts from "./routes/carts.routes.js";
import routerMessage from "./routes/chat.routes.js";
import routerUser from "./routes/users.routes.js";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { ProductFM } from "./dao/classes/DBmanager.js";
import { MessageFM } from "./dao/classes/DBmanager.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const DB_USER = process.env.USER_MONGO;
const DB_PASS = process.env.PASS_MONGO;
const DB_NAME = process.env.DB_MONGO;

const httpServer = app.listen(port, () => {
  console.log("Server up in port", port);
});
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routerCarts, routerProducts, routerMessage, routerUser);

app.engine(
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {});
});

let resProducts,
    resMessages;
let Messages = [],
    Products = [];

async function initChat() {
  try {
    Messages = await MessageFM.getMessages();
    return Messages;
  } catch (error) {
    return error;
  }
}

async function initProducts(id) {
  if (id) {
    let Products = await ProductFM.getProductId(id);
    return Products;
  } else {
    let Products = await ProductFM.getProducts();
    return Products;
  }
}

app.get("/home", async (req, res) => {
  resProducts = await initProducts();
  res.render("home", { resProducts });
});

app.get("/realtimeproducts", async (req, res) => {
  resProducts = await initProducts();
  res.render("realtimeproducts", { resProducts });
});

app.get("/realtimeproducts/:pid", async (req, res) => {
  let pid = req.params.pid;
  resProducts = await initProducts(pid);
  res.render("realtimeproducts", { resProducts });
});

app.get("/chat", async (req, res) => {
  resMessages = await initChat();
  res.render("chat", { resMessages });
});

const environment = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@codercluster.xq93twh.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Conexion a la base de datos exitosa");
  } catch (error) {
    console.log("Error en la conexion a la base de datos", error);
  }
};

const isValidStartDate = () => {
  if (DB_USER && DB_PASS) return true;
  else return false;
};

isValidStartDate() && environment();

socketServer.on("connection", async (socket) => {
  console.log("New client connected");
  socket.emit("backMessages",  await resMessages);
  socket.emit("backProducts",  await resProducts);

  socket.on("addproduct", async (newProduct) => {
    socket.broadcast.emit("f5NewProduct", newProduct);
  });

  socket.on("deleteproduct", async (idproduct) => {
    socketServer.emit("f5deleteProduct", idproduct);
  });

  socket.on("updateproduct", async (product) => {
    socket.broadcast.emit("f5updateProduct", product);
  });

  socket.on("updatingProduct", async (msj) => {
    socketServer.emit("updatingProduct", msj);
  });

  socket.on("exonerarStatus", async (msj) => {
    console.log("Emision de Orden de Exoneracion");
    socket.broadcast.emit("ordenExonerar", msj);
  });

  socket.on("responseExonerar", async (id) => {
    console.log("Respuesta de Orden de Exoneracion");
    socket.broadcast.emit("idExonerar", id);
  });

  socket.on("validateStatus", async (productsValid) => {
    socketServer.emit("actualizar", productsValid);
  });

  socket.on("finExo", async (msj) => {
    socketServer.emit("finValidate", msj);
  });

  socket.on("newUser", (data) => {
    socket.user = data.user;
    socket.id = data.id;
    socketServer.emit("newUser-connected", {
      user: socket.user,
      id: socket.id,
    });
  });
  
  socket.on("newMessage", async (lastMessage) => {
    socketServer.emit("messageLogs", lastMessage);
  });
});