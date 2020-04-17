// https://date-fns.org/v2.0.1/docs/I18n
import format from 'date-fns/formatDistanceToNow'
import es from 'date-fns/locale/es'
// const locales = { es }

export default function (value) {
  const date = typeof value === 'string' ? new Date(value) : value
  return format(date, {
    // locale: locales[window.__localeId__], // or global.__localeId__
    locale: es,
    addSuffix: true,
  })
}
