import Token from '~/api/Token'
// Guardar el token
export default function ({ route, redirect }) {
  const token = route.query?.token
  console.log(route.query)
  if (Token.get()) return redirect('/trabajos')
  if (token) {
    Token.set(token)
    return redirect('/trabajos')
  }
}
