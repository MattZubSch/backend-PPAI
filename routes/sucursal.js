const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");

const db = require("../base-orm/sequelize-init");

router.get("/api/sucursal", async function (req, res, next) {
  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }
  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.Sucursal.findAndCountAll({
    attributes: ["IdSucursal", "Nombre", "FechaInicio", "CodigoPostal"],
    order: [["Nombre", "ASC"]],
    where,
    offset: (Pagina - 1) * TamañoPagina,
    limit: TamañoPagina,
  });
  return res.json({ Items: rows, RegistrosTotal: count });
});


router.get("/api/sucursal/:id", async function (req, res, next) {
  // #swagger.tags = ['Sucursal']
  // #swagger.summary = 'obtiene un Sucursal'
  // #swagger.parameters['id'] = { description: 'identificador del Sucursal...' }
    let data = await db.Sucursal.findAll({
      attributes: ["IdSucursal", "Nombre", "FechaInicio", "CodigoPostal"],
      where: { IdSucursal: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });


router.post("/api/sucursal/", async (req, res) => {
  // #swagger.tags = ['Sucursales']
  // #swagger.summary = 'agrega una Sucursal'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nueva Sucursal',
                schema: { $ref: '#/definitions/Sucursal' }
    } */

  
  try {
    let data = await db.Sucursal.create({
      Nombre: req.body.Nombre,
      FechaInicio: req.body.FechaInicio,
      CodigoPostal: req.body.CodigoPostal,
    });
    res.status(200).json(data.dataValues); 
  } 
    catch (err) {
    if (err instanceof ValidationError) {

      let messages = '';
      err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      throw err;
    }
  }
});



router.put("/api/sucursal/:id", async (req, res) => {
  // #swagger.tags = ['Sucursales']
  // #swagger.summary = 'actualiza una Sucursal'
  // #swagger.parameters['id'] = { description: 'identificador de la Sucursal...' }
  /*    #swagger.parameters['Sucursal'] = {
                in: 'body',
                description: 'Sucursal a actualizar',
                schema: { $ref: '#/definitions/Sucursal' }
    } */

  try {
    let item = await db.Sucursal.findOne({
      attributes: [
        "IdSucursal", 
        "Nombre", 
        "FechaInicio", 
        "CodigoPostal"
      ],
      where: { IdSucursal: req.params.id },
    });
      
      
    if (!item) {
      res.status(404).json({ message: "Sucursal no encontrada" });
      return;
    }
    item.IdSucursal = req.body.IdSucursal;
    item.Nombre = req.body.Nombre;
    item.FechaInicio = req.body.FechaInicio;
    item.CodigoPostal = req.body.CodigoPostal;
    await item.save();
      
    res.sendStatus(200);
  }catch (err) {
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



router.delete("/api/sucursal/:id", async function (req, res){
  // #swagger.tags = ['Sucursales']
  // #swagger.summary = 'elimina una Sucursal'
  // #swagger.parameters['id'] = { description: 'identificador de la Sucursal..' }

  let filasBorradas = await db.Sucursal.destroy({
    where: { IdSucursal: req.params.id },
  });
  if (filasBorradas == 1) res.sendStatus(200);
  else res.sendStatus(404);
}
);

module.exports = router;

