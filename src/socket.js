import { Server } from "socket.io";
import { resProducts, resMessages,resCarts } from "./routes/mainRouter.js";

async function initSocketServer(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("backMessages", resMessages);
    socket.emit("callProducts", resProducts);
    socket.emit("callCarts", resCarts);
    
    socket.on("addproduct", async (newProduct) => {
      socket.broadcast.emit("f5NewProduct", newProduct);
    });

    socket.on("deleteproduct", async (idproduct) => {
      socket.broadcast.emit("f5deleteProduct", idproduct);
    });

    socket.on("deleteofcart", async (msj) => {
      socket.emit("deleteofcart", msj);
    });

    socket.on("updateproduct", async (product) => {
      io.emit("f5updateProduct", product);
    });

    socket.on("updatingProduct", async (msj) => {
      io.emit("updatingProduct", msj);
    });

    socket.on("viewingProduct", async (id) => {
      io.emit("viewingProduct", id);
    });
    
    socket.on("addingCart", async (msj) => {
      io.emit("addingCart", msj);
    });

    socket.on("deletingCart", async (msj) => {
      io.emit("deletingCart", msj);
    });

    socket.on("removeProduct", async (msj) => {
      io.emit("removeProduct", msj);
    });
    
    socket.on("emptyCart", async (msj) => {
      io.emit("emptyCart", msj);
    });

    socket.on("removeCart", async (msj) => {
      io.emit("removeCart", msj);
    });

    socket.on("NewCart", async (msj) => {
      io.emit("NewCart", msj);
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
