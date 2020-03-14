'use strict'
const format = require('date-fns/format')
const es = require('date-fns/locale/es')
module.exports = (value, formatValue) =>
  format(value, formatValue, { locale: es })
