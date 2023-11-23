const express = require("express");
const router = express.Router();
const db = require("../base-orm/sequelize-init");
const { Op, ValidationError } = require("sequelize");

router.get("/api/clientes", async function (req, res, next) {
  const rows  = await db.clientes.findAndCountAll({
      attributes: ["IdCliente", "dni", "nombreCompleto", "nroCelular"],
      order: [["Nombre", "ASC"]],
    });
    return res.json(rows);
  });
  
router.get("/api/clientes/:id", async function (req, res, next) {
    let data = await db.clientes.findAll({
      attributes: ["IdCliente", "Nombre", "FechaNac", "Dni"],
      where: { IdCliente: req.params.id },
    });
    if (data.length > 0 ) res.json(data[0]);
    else res.status(404).json({mensaje:'No encontrado!!'})
  });

router.post("/api/clientes", async function (req, res, next)  {
  try {
    let data = await db.clientes.create({
      Nombre: req.body.Nombre,
      FechaNac: req.body.FechaNac,
      Dni: req.body.Dni,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado
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


router.put("/api/clientes/:id", async function (req, res, next) {
  try {
    let item = await db.clientes.findOne({
      attributes: ["IdCliente"],
      where: { IdCliente: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }
    item.IdCliente = req.body.IdCliente;
    item.Nombre = req.body.Nombre;
    item.FechaNac= req.body.FechaNac,
    item.Dni= req.body.Dni,
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


router.delete("/api/clientes/:id", async function (req, res, next) {
  try {
    // baja fisica
    let filasBorradas = await db.clientes.destroy({
      where: { IdCliente: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);

  } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validacion, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
);

module.exports = router;