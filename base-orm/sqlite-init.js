// acceder a la base usando aa-sqlite
const db = require("aa-sqlite");

async function CrearBaseSiNoExiste() {
  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/base.db");
  //await db.open(process.env.base);

  let existe = false;
  let res = null;


  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'CambioEstado'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE IF NOT EXISTS CambioEstado (
        idCambioEstado INTEGER PRIMARY KEY,
        fechaHoraInicio TEXT,
        fechaHoraFin TEXT,
        idEstado INTEGER,
        idLlamada INTEGER,
        FOREIGN KEY (idEstado) REFERENCES Estado (idEstado),
        FOREIGN KEY (idLlamada) REFERENCES Llamada (idLlamada)
    );`
    );
    console.log("tabla CambioEstado creada!");
  }

  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Cliente'", []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE IF NOT EXISTS Cliente (
        idCliente INTEGER PRIMARY KEY,
        dni INTEGER,
        nombreCompleto TEXT,
        nroCelular INTEGER
    );
`
    );
    console.log("tabla Cliente creada!");
}

  existe = false;

  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Encuesta'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE IF NOT EXISTS Encuesta (
        idEncuesta INTEGER PRIMARY KEY,
        descripcion TEXT,
        fechaFinVigencia TEXT,
        idPregunta INTEGER,
        FOREIGN KEY (idPregunta) REFERENCES Pregunta (idPregunta)
    );`
    );
    console.log("tabla Encuesta creada!");

  }

  existe = false;

  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Estado'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE IF NOT EXISTS Estado (
        idEstado INTEGER PRIMARY KEY,
        nombre TEXT
    );`
    );
    console.log("tabla Estado creada!");

    await db.run(
      `insert into Estado values
      (1, 'Iniciada'),
      (2, 'Finalizada'),
      (3, 'Cancelada'),
      (4, 'En Curso')
      ;`
    );

    console.log("tabla Estado inicializada!");
  }

  existe = false;

  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Llamada'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE TABLE IF NOT EXISTS Llamada (
        idLlamada INTEGER PRIMARY KEY,
        descripcionOperador TEXT,
        detalleAccionRequerida TEXT,
        duracion TEXT,
        encuestaEnviada TEXT,
        observacionAuditor TEXT,
        idCliente INTEGER,
        FOREIGN KEY (idCliente) REFERENCES Cliente (idCliente)
    );`
    );
    console.log("tabla Llamada creada!");
  }

existe = false;

sql =
  "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'Pregunta'";
res = await db.get(sql, []);
if (res.contar > 0) existe = true;
if (!existe) {
  await db.run(
    `CREATE TABLE IF NOT EXISTS Pregunta (
      idPregunta INTEGER PRIMARY KEY,
      pregunta TEXT
  );`
  );
  console.log("tabla Pregunta creada!");

  await db.run(
    `insert into Pregunta values
      (1, "¿Qué tan fácil fue navegar por el sistema de atención al cliente? (Siendo 1=Muy Dificil y 10=Muy Facil)"),
      (2, "¿Fue fácil navegar por el sistema de atención al cliente? (Siendo 1=Si, fue facil y 2=No, fue dificil)"),
      (3, "¿Qué tan rápido recibió una respuesta a su pregunta? (Siendo 1=Muy Lento y 10=Muy Rapido)"),
      (4, "¿Recibió una respuesta rápida a su pregunta? (Siendo 1=Si, fue rapido y 2=No, fue lento)"),
      (5, "¿Qué tan útil fue la información proporcionada? (Siendo 1=Para nada útil y 10=Indispensable)"),
      (6, "¿Considera que la información proporcionada fue útil? (Siendo 1=Si, fue util y 2=No, no es util)"),
      (7, "¿Qué tan satisfecho está con la calidad del servicio de atención al cliente? (Siendo 1=Muy insatisfecho y 10=Muy satisfecho)"),
      (8, "¿Está satisfecho con la calidad del servicio de atención al cliente? (Siendo 1=Si, estoy satisfecho/a y 2=No, no estoy satisfecho/a)"),
      (9, "¿Qué tan amable fue la persona que lo atendió? (Siendo 1=Muy desagradable y 10=Muy amable)"),
      (10, "¿Fue atendido por alguien amable? (Siendo 1=Si, muy amable y 2=No,fue poco amable)"),
      (11, "¿Qué tan claro fue su entendimiento de las opciones disponibles para usted? (Siendo 1=Pésimo y 10=Excepcional)"),
      (12, "¿Comprendió claramente las opciones disponibles para usted? (Siendo 1=Si, fue muy claro y 2=No, fue ambiguo)"),
      (13, "¿Qué tan probable es que recomiende este servicio de atención al cliente a otros? (Siendo 1=Imposible y 10=Totalmente)"),
      (14, "¿Recomendaría este servicio de atención al cliente a otros? (Siendo 1=Si, lo recomendaria y 2=No, no lo recomendaria)")
    ;`
  );
  
  console.log("tabla Pregunta inicializada!");
}


  existe = false;
  sql = "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'RespuestaPosible'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
  await db.run(`
  CREATE TABLE IF NOT EXISTS RespuestaPosible (
    idRespuestaPosible INTEGER PRIMARY KEY,
    descripcion TEXT,
    valor INTEGER,
    idPregunta INTEGER,
    FOREIGN KEY (idPregunta) REFERENCES Pregunta (idPregunta)
    );
`);
  console.log("tabla RespuestaPosible creada!");

  await db.run(`
    insert into RespuestaPosible values
      (1, "Muy difícil", 1, 1),
      (2, "Difícil", 2, 1),
      (3, "Moderadamente difícil", 3, 1),
      (4, "Algo difícil", 4, 1),
      (5, "Ni difícil ni fácil", 5, 1),
      (6, "Algo fácil", 6, 1),
      (7, "Moderadamente fácil", 7, 1),
      (8, "Fácil", 8, 1),
      (9, "Bastante fácil", 9, 1),
      (10, "Muy fácil", 10, 1),

      (11, "Si, fue facil", 1, 2),
      (12, "No, fue dificil", 2, 2),

      (13, "Muy lento", 1, 3),
      (14, "Lento", 2, 3),
      (15, "Moderadamente lento", 3, 3),
      (16, "Algo lento", 4, 3),
      (17, "Normal", 5, 3),
      (18, "Algo rápido", 6, 3),
      (19, "Moderadamente rápido", 7, 3),
      (20, "Rápido", 8, 3),
      (21, "Bastante rápido", 9, 3),
      (22, "Muy rápido", 10, 3),

      (23, "Si, fue rapido", 1, 4),
      (24, "No, fue lento", 2, 4),

      (25, "Para nada útil", 1, 5),
      (26, "Poco útil", 2, 5),
      (27, "Ligeramente útil", 3, 5),
      (28, "Algo útil", 4, 5),
      (29, "Moderadamente útil", 5, 5),
      (30, "Bastante útil", 6, 5),
      (31, "Muy útil", 7, 5),
      (32, "Sumamente útil", 8, 5),
      (33, "Extremadamente útil", 9, 5),
      (34, "Indispensable", 10, 5),

      (35, "Si, fue util", 1, 6),
      (36, "No, no es util", 2, 6),

      (37, "Muy insatisfecho", 1, 7),
      (38, "Insatisfecho", 2, 7),
      (39, "Moderadamente insatisfecho", 3, 7),
      (40, "Algo insatisfecho", 4, 7),
      (41, "Neutro", 5, 7),
      (42, "Algo satisfecho", 6, 7),
      (43, "Moderadamente satisfecho", 7, 7),
      (44, "Satisfecho", 8, 7),
      (45, "Bastante satisfecho", 9, 7),
      (46, "Muy satisfecho", 10, 7),

      (47, "Si, estoy satisfecho/a", 1, 8),
      (48, "No, no estoy satisfecho/a", 2, 8),

      (49, "Muy desagradable", 1, 9),
      (50, "Desagradable", 2, 9),
      (51, "Moderadamente desagradable", 3, 9),
      (52, "Algo desagradable", 4, 9),
      (53, "Neutro", 5, 9),
      (54, "Algo amable", 6, 9),
      (55, "Moderadamente amable", 7, 9),
      (56, "Amable", 8, 9),
      (57, "Bastante amable", 9, 9),
      (58, "Muy amable", 10, 9),

      (59, "Si, muy amable", 1, 10),
      (60, "No, fue poco amable", 2, 10),

      (61, "Pésimo", 1, 11),
      (62, "Muy malo", 2, 11),
      (63, "Deficiente", 3, 11),
      (64, "Malo", 4, 11),
      (65, "Regular", 5, 11),
      (66, "Bueno", 6, 11),
      (67, "Muy bueno", 7, 11),
      (68, "Excelente", 8, 11),
      (69, "Sobresaliente", 9, 11),
      (70, "Excepcional", 10, 11),

      (71, "Si, fue muy claro", 1, 12),
      (72, "No, fue ambiguo", 2, 12),

      (73, "Imposible", 1, 13),
      (74, "Muy improbable", 2, 13),
      (75, "Altamente improbable", 3, 13),
      (76, "Poco probable", 4, 13),
      (77, "Neutro", 5, 13),
      (78, "Algo probable", 6, 13),
      (79, "Probable", 7, 13),
      (80, "Muy probable", 8, 13),
      (81, "Altamente probable", 9, 13),
      (82, "Totalmente", 10, 13),

      (83, "Si, lo recomendaria", 1, 14),
      (84, "No, no lo recomendaria", 2, 14)
      `
);

  console.log("tabla RespuestaPosible inicializada!");

  }

  existe = false;
  sql = "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'RespuestaCliente'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
  await db.run(`
  CREATE TABLE IF NOT EXISTS RespuestaCliente (
    idRespuestaCliente INTEGER PRIMARY KEY,
    fechaEncueta TEXT,
    idRespuesta INTEGER,
    idLlamada INTEGER,
    FOREIGN KEY (idLlamada) REFERENCES Llamada (idLlamada),
    FOREIGN KEY (idRespuesta) REFERENCES RespuestaPosible (idRespuestaPosible)
    );
  `)

  console.log("tabla RespuestaCliente creada!");
}

  // cerrar la base
  db.close();
}

CrearBaseSiNoExiste();

module.exports = CrearBaseSiNoExiste;


