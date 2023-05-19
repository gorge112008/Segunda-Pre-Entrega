import { Server } from "socket.io";
import { resProducts, resMessages } from "./routes/mainRouter.js";

async function initSocketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("backMessages", resMessages);
    socket.emit("callProducts", resProducts);

    socket.on("addproduct", async (newProduct) => {
      socket.broadcast.emit("f5NewProduct", newProduct);
    });

    socket.on("deleteproduct", async (idproduct) => {
      io.emit("f5deleteProduct", idproduct);
    });

    socket.on("updateproduct", async (product) => {
      socket.broadcast.emit("f5updateProduct", product);
    });

    socket.on("updatingProduct", async (msj) => {
      io.emit("updatingProduct", msj);
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
      io.emit("actualizar", productsValid);
    });

    socket.on("finExo", async (msj) => {
      io.emit("finValidate", msj);
    });

    socket.on("newUser", (data) => {
      socket.user = data.user;
      socket.id = data.id;
      io.emit("newUser-connected", {
        user: socket.user,
        id: socket.id,
      });
    });

    socket.on("newMessage", async (lastMessage) => {
      io.emit("messageLogs", lastMessage);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

export default initSocketServer;
