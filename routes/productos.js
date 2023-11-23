const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");

// Obtenemos todos los productos disponibles.
router.get("/api/productos", async function (req, res) {

  let where = {};
  if (req.query.NombreProducto != undefined && req.query.NombreProducto !== "") {
    where.NombreProducto = {
      [Op.like]: "%" + req.query.NombreProducto + "%",
    };
  }

  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.Producto.findAndCountAll({
    attributes: [
      "IdProducto", 
      "NombreProducto", 
      "FechaLanzamiento", 
      "Precio",
    ],
    order: [["NombreProducto", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });
  return res.json({ Items: rows, RegistrosTotal: count });
});
  
// Obtener productos por Id.
router.get("/api/productos/:id", async function (req, res, next) {
    // #swagger.tags = ['Productos']
    // #swagger.summary = 'obtiene un Productos'
    // #swagger.parameters['id'] = { description: 'identificador del Productos...' }
    let data = await db.Producto.findAll({
        attributes: ["IdProducto", "NombreProducto", "FechaLanzamiento", "Precio"],
      where: { IdProducto: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No econtrado!!'})
  });

// Para agregar un nuevo producto.
router.post("/api/productos/", async (req, res) =>
{
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'agrega un Producto'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Producto',
                schema: { $ref: '#/definitions/Productos' }
    } */

  try
  {
    console.log(req.body);
    let data = await db.Producto.create
    (
      {
        NombreProducto: req.body.NombreProducto,
        FechaLanzamiento: req.body.FechaLanzamiento,
        Precio: req.body.Precio,
      }
    );
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  }
  catch(err)
  {
    if(err instanceof ValidationError)
    {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    }else
    {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
})


// Para realizar una modificación en mis productos.  
router.put("/api/productos/:id", async function(req, res, next)
{
  // #swagger.tags = ['Productos']
  // #swagger.summary = 'actualiza un Producto'
  // #swagger.parameters['id'] = { description: 'identificador del Producto...' }
  /*    #swagger.parameters['Productos'] = {
                in: 'body',
                description: 'Producto a actualizar',
                schema: { $ref: '#/definitions/Productos' }
    } */

  try
  {
    let item = await db.Producto.findOne(
    {
        attributes: 
        [
        "IdProducto",
        "NombreProducto",
        "FechaLanzamiento",
        "Precio"
        ],
        where: {IdProducto: req.params.id},
    });
    if(!item)
    {
      res.status(404).json({mensaje:'Producto no encontrada.'});
      return
    }
    item.IdProducto = req.body.IdProducto;
    item.NombreProducto = req.body.NombreProducto;
    item.FechaLanzamiento = req.body.FechaLanzamiento;
    item.Precio = req.body.Precio;
    await item.save();
    res.sendStatus(200);
  }catch(err)
  {
    if(err instanceof ValidationError)
    {
       // si son errores de validacion, los devolvemos
       let messages = '';
       err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
       res.status(400).json({message : messages});
       } else {
       // si son errores desconocidos, los dejamos que los controle el middleware de errores
       throw err;
       }
    }  
})

router.delete("/api/productos/:id", async function(req, res)
{
  let filasBorradas = await db.Producto.destroy
  (
    {
      where: {IdProducto: req.params.id},
    }
  );
  if(filasBorradas == 1) res.sendStatus(200);
  else res.sendStatus(404);
})
module.exports = router;

