const getMongoURL = require("./getMongoURL");
const sendEmailTo = require("./sendEmail");
const formatDate = require("./formatDate");
const get = require("./get");
const Agenda = require("agenda");
let agenda;

const getFullName = person => {
  const apellido = person.apellido;
  const nombre = person.nombre;
  return apellido ? `${apellido}, ${nombre}` : nombre ? nombre : "Sin nombre";
};

// Tasks
module.exports.jobName = {
  SEND_EMAIL_EDIT_USER: "SEND_EMAIL_EDIT_USER",
  SEND_EMAIL_MEW_USER: "SEND_EMAIL_MEW_USER",
  SEND_EMAIL_A_VERIFICAR: "SEND_EMAIL_A_VERIFICAR",
  SEND_EMAIL_REPROGRAMACION: "SEND_EMAIL_REPROGRAMACION",
  SEND_EMAIL_SOLICITADA: "SEND_EMAIL_SOLICITADA"
};

module.exports.jobCreate = (jobName, data) => agenda.create(jobName, data).save();

module.exports.start = async function() {
  try {
    agenda = new Agenda({ db: { address: getMongoURL() } });

    agenda.define(
      this.jobName.SEND_EMAIL_MEW_USER,
      { priority: "normal", concurrency: 2 },
      async job => {
        await sendEmailTo(
          { type: "user_abm", subject: "Municipio Verde - Nuevo Usuario" },
          job.attrs.data
        );
      }
    );

    agenda.define(
      this.jobName.SEND_EMAIL_EDIT_USER,
      { priority: "normal", concurrency: 2 },
      async job => {
        await sendEmailTo(
          { type: "user_abm", subject: "Municipio Verde - Modificación de datos de acceso" },
          job.attrs.data
        );
      }
    );

    agenda.define(
      this.jobName.SEND_EMAIL_SOLICITADA,
      { priority: "normal", concurrency: 2 },
      async job => {
        const data = job.attrs.data;
        await sendEmailTo(
          {
            type: "aplicacion_change_solicitada",
            subject:
              "Municipio Verde - SOLICITADA - " +
              data.fecha_realizacion +
              `hs - Lote: ${data.lote}`
          },
          data
        );
      }
    );
    agenda.define(
      this.jobName.SEND_EMAIL_A_VERIFICAR,
      { priority: "normal", concurrency: 2 },
      async job => {
        const data = job.attrs.data;
        await sendEmailTo(
          {
            type: "aplicacion_change_a_verificar",
            subject:
              "Municipio Verde - VERIFICAR - " +
              data.fecha_realizacion +
              `hs - Lote: ${data.lote}`
          },
          data
        );
      }
    );
    agenda.define(
      this.jobName.SEND_EMAIL_REPROGRAMACION,
      { priority: "normal", concurrency: 2 },
      async job => {
        const data = job.attrs.data;
        await sendEmailTo(
          {
            type: "aplicacion_change_reprogramacion",
            subject:
              "Municipio Verde - REPROGRAMADA - " +
              data.fecha_realizacion +
              `hs - Lote: ${data.lote}`
          },
          data
        );
      }
    );

    await agenda.start();
  } catch (e) {
    console.error("Error al cargar agenda");
  }
};
