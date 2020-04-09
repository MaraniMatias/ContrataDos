// https://date-fns.org/v2.0.1/docs/I18n
import format from 'date-fns/formatDistance'
import es from 'date-fns/locale/es'
// const locales = { es }

export default function (date, dateBase) {
  const d1 = typeof date === 'string' ? new Date(date) : date
  const d2 = typeof dateBase === 'string' ? new Date(dateBase) : dateBase
  return format(d1, d2, {
    // locale: locales[window.__localeId__], // or global.__localeId__
    locale: es,
  })
}
