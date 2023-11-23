const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");

const db = require("../base-orm/sequelize-init");

router.get("/api/empleados", async function (req, res, next) {
  
  let where = {};
  if (req.query.NombreEmpleado != undefined && req.query.NombreEmpleado !== "") {
    where.NombreEmpleado = {
      [Op.like]: "%" + req.query.NombreEmpleado + "%",
    };
  }
  const Pagina = req.query.Pagina ?? 1;
  const TamañoPagina = 10;
  const { count, rows } = await db.Empleado.findAndCountAll({
      attributes: ["IdEmpleado", "NombreEmpleado", "FechaIngreso", "Dni"],
      order: [["NombreEmpleado", "ASC"]],
      where,
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });
    return res.json({ Items: rows, RegistrosTotal: count });
  });
  

router.get("/api/empleados/:id", async function (req, res, next) {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'obtiene un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado...' }

    let data = await db.Empleado.findAll({
      attributes: ["IdEmpleado", "NombreEmpleado", "FechaIngreso", "Dni"],
      where: { IdEmpleado: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });


router.post("/api/empleados/", async (req, res) => {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'agrega un Empleado'
  /*    #swagger.parameters['item'] = {
                in: 'body',
                description: 'nuevo Empleado',
                schema: { $ref: '#/definitions/Empleados' }
    } */

  
  try {
    console.log(req.body);
    let data = await db.Empleado.create({
      NombreEmpleado: req.body.NombreEmpleado,
      FechaIngreso: req.body.FechaIngreso,
      Dni: req.body.Dni,
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



router.put("/api/empleados/:id", async (req, res) => {
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'actualiza un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado...' }
  /*    #swagger.parameters['Empleado'] = {
                in: 'body',
                description: 'Empleado a actualizar',
                schema: { $ref: '#/definitions/Empleados' }
    } */

  try {
    let item = await db.Empleado.findOne({
      attributes: [
        "IdEmpleado", 
        "NombreEmpleado", 
        "FechaIngreso", 
        "Dni"
      ],
      where: { IdEmpleado: req.params.id },
    });
      
      
    if (!item) {
      res.status(404).json({ message: "Empleado no encontrado" });
      return;
    }
    item.IdEmpleado = req.body.IdEmpleado;
    item.NombreEmpleado = req.body.NombreEmpleado;
    item.FechaIngreso = req.body.FechaIngreso;
    item.Dni = req.body.Dni;
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



router.delete("/api/empleados/:id", async function (req, res){
  // #swagger.tags = ['Empleados']
  // #swagger.summary = 'elimina un Empleado'
  // #swagger.parameters['id'] = { description: 'identificador del Empleado..' }

  let filasBorradas = await db.Empleado.destroy({
    where: { IdEmpleado: req.params.id },
  });
  if (filasBorradas == 1) res.sendStatus(200);
  else res.sendStatus(404);
}
);


module.exports = router;


