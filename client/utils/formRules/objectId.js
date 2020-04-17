const message = 'El campo invalido.'
const re = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

function validate(value) {
  // Valid required with required rule
  if (!value) return true
  return re.test(String(value))
}

export default () => (value) => validate(value) || message
