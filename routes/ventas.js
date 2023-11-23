const express = require("express");
const router = express.Router();
const { ValidationError, Op } = require("sequelize");

const db = require("../base-orm/sequelize-init");

router.get("/api/ventas", async function (req, res, next) {
  let where = {};
  if (req.query.Descripcion != undefined && req.query.Descripcion !== "") {
    where.Descripcion = {
      [Op.like]: "%" + req.query.Descripcion + "%",
    };
  }

  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.Ventas.findAndCountAll({
    attributes: [
      "IdVenta", 
      "Descripcion", 
      "FechaVenta", 
      "Cantidad", 
    ],
    order: [["Descripcion", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });
  return res.json({ Items: rows, RegistrosTotal: count });
});


router.get("/api/ventas/:id", async function (req, res, next) {
    // #swagger.tags = ['Ventas']
    // #swagger.summary = 'obtiene un Ventas'
    // #swagger.parameters['id'] = { description: 'identificador del Ventas...' }
    let data = await db.Ventas.findAll({
      attributes: ["IdVenta", "Descripcion", "FechaVenta", "Cantidad"],
      where: { IdVenta: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });

router.put("/api/ventas/:id", async function (req, res, next) {
  try{
    let item = await db.Ventas.findOne({
      attributes: [
        "IdVenta", 
        "Descripcion", 
        "FechaVenta", 
        "Cantidad"],
        where: { IdVenta: req.params.id },
  });
  if (!item) {
    res.status(404).json({mensaje:'Venta no encontrada.'});
    return
  }
  item.IdVenta = req.body.IdVenta;
  item.Descripcion = req.body.Descripcion;
  item.FechaVenta = req.body.FechaVenta;
  item.Cantidad = req.body.Cantidad;
  await item.save();

  res.sendStatus(200);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
      } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
      }
  }
});

router.delete("/api/ventas/:id", async function (req, res){
    let filasBorradas = await db.Ventas.destroy({
      where: { IdVenta: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  }
)

router.post("/api/ventas/", async (req, res, next) => {
  try {
    console.log(req.body)
    let data = await db.Ventas.create({
      Descripcion:req.body.Descripcion,
      FechaVenta:req.body.FechaVenta,
      Cantidad:req.body.Cantidad,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!

  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});


module.exports = router;
