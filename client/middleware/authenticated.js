import Token from '~/api/Token'

export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (store.getters.isLoggedIn === false) {
    if (Token.get()) {
      return store.dispatch('getMe').then((rta) => {
        if (rta.error) {
          return redirect('/login')
        }
      })
    } else {
      return redirect('/login')
    }
  }
}
