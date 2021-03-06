const capitalizeWords = require('./../capitalizeWords')

module.exports.Roles = {
  CLIENTE: 'CLIENTE',
  PROFESIONAL: 'PROFESIONAL',
  ADMIN: 'ADMIN',
}
module.exports.RolesLabel = Object.keys(this.Roles).map((key) => ({
  key,
  show: key !== this.Roles.ADMIN,
  label: capitalizeWords(key),
}))

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
module.exports.EstadoTrabajoColor = {
  [this.EstadoTrabajo.CONSULTA]: 'cyan',
  [this.EstadoTrabajo.PENDIENTE]: 'blue',
  [this.EstadoTrabajo.EN_PROGRESO]: 'indigo',
  [this.EstadoTrabajo.TERMINADO]: 'green darken-4',
  [this.EstadoTrabajo.CANCELADO]: 'grey darken-1',
}

module.exports.TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO',
}
module.exports.RatingTrabajo = {
  LIKE: 'LIKE',
  DONT_LIKE: 'DONT_LIKE',
}
