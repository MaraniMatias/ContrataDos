module.exports.Roles = {
  CLIENTE: 'CLIENTE',
  PROFECIONAL: 'PROFECIONAL',
  ADMIN: 'ADMIN',
}

module.exports.EstadoTrabajo = {
  CONSULTA: 'CONSULTA', // El cleinte indica que necesita al profesional
  PENDIENTE_CONFIRMACION: 'PENDIENTE_CONFIRMACION', // El profesional acepta y elige la fecha
  PENDIENTE_REALIZACION: 'PENDIENTE_REALIZACION', // El cliente acepta la fecha elegida por el profesional
  EN_PROGRESO: 'EN_PROGRESO', // A partir de la fecha_inicio y hasta que el profesional marque como terminada
  TERMINADA: 'TERMINADA',
  CANCELADA: 'CANCELADA',
}

module.exports.TipoTrabajo = {
  PUBLICO: 'PUBLICO',
  PRIVADO: 'PRIVADO',
}
