const capitalizeWords = require('./../utils/capitalizeWords')

module.exports.Roles = {
  CLIENTE: 'CLIENTE',
  PROFECIONAL: 'PROFECIONAL',
  ADMIN: 'ADMIN',
}

module.exports.EstadoTrabajo = {
  CONSULTA: 'CONSULTA', // El cleinte indica que necesita al profesional
  PENDIENTE: 'PENDIENTE', // El cliente acepta la fecha elegida por el profesional
  EN_PROGRESO: 'EN_PROGRESO', // A partir de la fecha_inicio y hasta que el profesional marque como terminada
  TERMINADO: 'TERMINADO', // Estos son los que puedne ser publicados
  CANCELADO: 'CANCELADO',
}
module.exports.EstadoTrabajoLabel = Object.keys(
  this.EstadoTrabajo
).map((key) => ({ key, label: capitalizeWords(key) }))
/* [
  [EstadoTrabajo.CONSULTA]:{label:"Consulta"},
  [EstadoTrabajo.PENDIENTE]: {label: "Pendiente"},
  [EstadoTrabajo.EN_PROGRESO]:{label:"En progreso"},
  [EstadoTrabajo.TERMINADO]: {label:"Terminado"},
  [EstadoTrabajo.CANCELADO]: {label:"Cancelado"}
] */

module.exports.TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO',
}
