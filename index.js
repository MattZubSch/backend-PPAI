const express = require("express");
const cors = require("cors");

// crear servidor
const app = express();

app.use(express.json()); // para poder leer json en el body

// Configuración de CORS
app.use(cors());

require("./base-orm/sqlite-init");  // crear base si no existe

// controlar ruta
app.get("/", (req, res) => {
  res.send("Consultar Encuesta - DB");
});

const empleadorouter = require("./routes/empleados");
app.use(empleadorouter);

const clientesrouter = require("./routes/clientes");
app.use(clientesrouter);

const productosrouter = require("./routes/productos");
app.use(productosrouter);

const ventasRouter = require("./routes/ventas");
app.use(ventasRouter);

const sucursalRouter = require("./routes/sucursal");
app.use(sucursalRouter);


// levantar servidor
if (!module.parent) {   // si no es llamado por otro modulo, es decir, si es el modulo principal -> levantamos el servidor
  const port = process.env.PORT || 4000;   // en produccion se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}
module.exports = app;