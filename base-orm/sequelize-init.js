// configurar ORM sequelize
const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = new Sequelize("sqlite:" + process.env.base );
const sequelize = new Sequelize("sqlite:" + "./.data/base.db");

// definicion del modelo de datos
const Cliente = sequelize.define('Cliente', {
  idCliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  dni: {
      type: DataTypes.INTEGER,
  },
  nombreCompleto: {
      type: DataTypes.STRING,
  },
  nroCelular: {
      type: DataTypes.STRING,
  }
});

const CambioEstado = sequelize.define('CambioEstado', {
  idCambioEstado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fechaHoraInicio: {
    type: DataTypes.STRING,
  },
  fechaHoraFin: {
    type: DataTypes.STRING,
  },
  idEstado: {
    type: DataTypes.INTEGER,
  },
  idLlamada: {
    type: DataTypes.INTEGER,
  },
});


CambioEstado.belongsTo(Estado, { foreignKey: 'idEstado' });
CambioEstado.belongsTo(Llamada, { foreignKey: 'idLlamada' });

const Estado = sequelize.define('Estado', {
  idEstado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
  },
});


const Encuesta = sequelize.define('Encuesta', {
  idEncuesta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  descripcion: {
      type: DataTypes.STRING,
  },
  fechaFinVigencia: {
      type: DataTypes.STRING,
  },
  idPregunta: {
      type: DataTypes.INTEGER,
  }

});
Encuesta.belongsTo(Pregunta, { foreignKey: 'idPregunta' });

const Llamada = sequelize.define('Llamada', {
  idLlamada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  descripcionOperador: {
      type: DataTypes.STRING,
  },
  detalleAccionRequerida: {
      type: DataTypes.STRING,
  },
  duracion: {
      type: DataTypes.STRING,
  },
  encuestaEnviada: {
      type: DataTypes.BOOLEAN,
  },
  observacionAuditor: {
      type: DataTypes.STRING,
  },
  idCliente: {
      type: DataTypes.INTEGER,
  }
});

Llamada.belongsTo(Cliente, { foreignKey: 'idCliente' });

const Pregunta = sequelize.define('Pregunta', {
  idPregunta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  descripcion: {
      type: DataTypes.STRING,
  }
});

const RespuestaDeCliente = sequelize.define('RespuestaDeCliente', {
  idRespuestaDeCliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  fechaEncuesta: {
      type: DataTypes.STRING,
  },
  idRespuestaPosible: {
      type: DataTypes.INTEGER,
  },
  idLlamada: {
      type: DataTypes.INTEGER,
  },
});

RespuestaDeCliente.belongsTo(RespuestaPosible, { foreignKey: 'idRespuestaPosible' });
RespuestaDeCliente.belongsTo(Llamada, { foreignKey: 'idLlamada' });

const RespuestaPosible = sequelize.define('RespuestaPosible', {
  idRespuestaPosible: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  descripcion: {
      type: DataTypes.STRING,
  },
  idPregunta: {
      type: DataTypes.INTEGER,
  },
});

RespuestaPosible.belongsTo(Pregunta, { foreignKey: 'idPregunta' });



module.exports = {
  sequelize,
  Cliente,
  CambioEstado,
  Estado,
  Encuesta,
  Llamada,
  Pregunta,
  RespuestaDeCliente,
  RespuestaPosible
};
