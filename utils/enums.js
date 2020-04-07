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
module.exports.EstadoTrabajoColor = {
  [this.EstadoTrabajo.CONSULTA]: 'cyan',
  [this.EstadoTrabajo.PENDIENTE]: 'blue',
  [this.EstadoTrabajo.EN_PROGRESO]: 'indigo',
  [this.EstadoTrabajo.TERMINADO]: 'deep-purple',
  [this.EstadoTrabajo.CANCELADO]: 'grey darken-1',
}

module.exports.TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO',
}
