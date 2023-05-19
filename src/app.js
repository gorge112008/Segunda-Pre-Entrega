import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import routerProducts from "./routes/api/products.routes.js";
import routerCarts from "./routes/api/carts.routes.js";
import routerMessage from "./routes/api/chat.routes.js";
import routerUser from "./routes/api/users.routes.js";
import routerViews from "./routes/mainRouter.js";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import config from "./config/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url)); //Obtener la ruta absoluta del directorio actual

const app = express(); //Crear una aplicacion express

app.use(express.json());//Configurar el servidor para que pueda entender los formatos JSON
app.use(express.urlencoded({ extended: true }));//Configurar el servidor para que pueda entender los formatos URL Encoded
app.use("/", routerViews);//Configurar el servidor para que pueda entender las rutas de las vistas
app.use("/api", routerCarts, routerMessage, routerUser, routerProducts);//Configurar el servidor para que pueda entender las rutas de la API

app.engine(//Configurar el servidor para que pueda entender el motor de plantillas
  "handlebars",
  engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),//Permitir el acceso a los prototipos de Handlebars
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));//Configurar el servidor para que pueda entender la ruta de los archivos estaticos

const environment = async () => {
  await mongoose 
    .connect(
      `mongodb+srv://${config.mongo.DB_USER}:${config.mongo.DB_PASS}@codercluster.xq93twh.mongodb.net/${config.mongo.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Conexion a la base de datos exitosa");
    })
    .catch((error) => {
      console.log(`Error en la conexion a la base de datos: ${error.message}`);
    });
};

const isValidStartDate = () => {
  if (config.mongo.DB_USER && config.mongo.DB_PASS) return true;
  else return false;
};

isValidStartDate() && environment();//Si las credenciales de la base de datos son validas, se inicia la aplicacion

export default app;